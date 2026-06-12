const functions = require("firebase-functions");
const admin = require("firebase-admin");
const { createMailTransporter, getMailFrom } = require("./mailTransport");
const {
  runReminderEngine,
  buildReminderEmail,
  matchesReminderStage,
} = require("./remindersEngine");

const Stripe = require("stripe");
const stripe = new Stripe(functions.config().stripe.test_secret_key);

// Funcție care rulează la fiecare 5 minute

// Inițializează Firebase Admin SDK
admin.initializeApp();

const db = admin.firestore();

const transporter = createMailTransporter();
const INTERNAL_SIGNUP_NOTIFICATION_TO = "office@real-amor.com";

function mapPurposeToFrenchIntent(purpose) {
  switch (String(purpose || "").trim()) {
    case "love":
      return "chercher une relation stable et durable";
    case "casual":
      return "chercher des rencontres coquines";
    case "friendship":
      return "élargir son cercle d'amis";
    default:
      return "objectif non renseigné";
  }
}

function getSignupNotificationUserName(userData) {
  return String(userData?.username || "").trim() || "Non renseigné";
}

function getSignupNotificationPhone(userData) {
  return (
    String(userData?.phoneDisplay || "").trim() ||
    String(userData?.phone || "").trim() ||
    "Non renseigné"
  );
}

function getSignupNotificationEmail(userData) {
  return String(userData?.email || "").trim() || "Non renseigné";
}

function buildAdminSignupNotification(userData) {
  const username = getSignupNotificationUserName(userData);
  const phone = getSignupNotificationPhone(userData);
  const email = getSignupNotificationEmail(userData);
  const signupIntent = mapPurposeToFrenchIntent(userData?.purpose);

  return {
    username,
    email,
    subject: `RealAmor - Nouveau compte client - ${username}`,
    text:
      `Nom / prénom: ${username}\n` +
      `Téléphone: ${phone}\n` +
      `Email: ${email}\n\n` +
      `${username}, ${phone}, ${email}, a créé un compte sur le site de ` +
      `RealAmor pour ${signupIntent}.`,
  };
}

// Funcție pentru a trimite un email intern către admin când un client creează un cont
exports.sendNewSignupAdminNotification = functions.firestore
  .document("Users/{userId}")
  .onCreate(async (snap, context) => {
    const userId = String(context?.params?.userId || "").trim();
    const newUser = snap.data() || {};
    const adminUids = await getAdminUidSetForFunctions();

    if (adminUids.has(userId)) {
      console.log(
        "Sărim peste notificarea internă pentru cont admin:",
        userId
      );
      return null;
    }

    const mailPayload = buildAdminSignupNotification(newUser);

    try {
      await transporter.sendMail({
        from: getMailFrom(),
        to: INTERNAL_SIGNUP_NOTIFICATION_TO,
        subject: mailPayload.subject,
        text: mailPayload.text,
      });

      console.log(
        "Email intern signup trimis cu succes:",
        JSON.stringify({
          userId,
          email: mailPayload.email,
          to: INTERNAL_SIGNUP_NOTIFICATION_TO,
        })
      );
    } catch (error) {
      console.error(
        "Eroare la trimiterea emailului intern de signup:",
        JSON.stringify({
          userId,
          email: mailPayload.email,
          to: INTERNAL_SIGNUP_NOTIFICATION_TO,
        }),
        error
      );
    }

    return null;
  });

// Funcție pentru a trimite un email de bun venit
exports.sendWelcomeEmail = functions.firestore
  .document("Users/{userId}")
  .onCreate((snap, context) => {
    const newUser = snap.data();

    const email = newUser.email;
    const username = newUser.username;
    const targetLanguage = newUser.targetLanguage || "fr";

    // Mesaje de bun venit în funcție de limbă
    let emailMessage = "";
    let emailSubject = "";

    emailMessage =
      `Bonjour ${username}\n\n` +
      `Nous vous souhaitons la bienvenue sur Real Amor !\n\n` +
      `Nous sommes ravis de vous avoir parmi nous.\n\n` +
      `La prochaine étape est de prendre un Rendez-Vous pour valider votre profil.\n` +
      `Attention ! Ce rendez-vous sera enregistré pour permettre à l'équipe de RealAmor d'étudier votre profil, afin de comprendre votre vécu pour mieux répondre à vos besoins !\n` +
      `La vidéo de ce Rendez-Vous ne sera jamais diffusée aux autres membres inscrits à RealAmor.\n` +
      `A la fin de l'entretien avec un des conseillers RealAmor, vous aurez la possibilité d'enregistrer une vidéo de présentation (FACULTATIVE) destinée aux profils compatibles. C'est vous-même à décider de partager (ou pas) cette vidéo, qui vous sera envoyée par l'équipe de RealAmor les jours suivant votre entretien.\n` +
      `Durant cet entretien, notre équipe neuroscientifique vous posera une série des questions, tant sur vos habitudes, sur vos intérêts, mais aussi sur votre personnalité.\n` +
      `Le Rendez-vous de validation a un prix de 159,00€. Nous vous invitons à procéder à ce paiement par virement bancaire à\n` +
      `RealAmor SRL\n` +
      `Rue Charles Martel 8, 1000 Bruxelles, Belgique\n` +
      `TVA1015481815\n` +
      `IBAN : BE32 0019 9397 1002\n` +
      `BIC : GEBABEBB\n` +
      `Communication : nom/prénom/adresse/mail\n` +
      `Une fois le paiement reçu, vous pourrez accéder à notre agenda RealAmor pour la prise du Rendez-vous, en vous connectant à votre compte !\n` +
      `Vous ne pouvez pas vous libérer dans un des créneaux proposés par l'agence ? N'hésitez pas à nous contacter à info@real-amor.com, ensemble on trouvera une solution !\n\n` +
      `Cordialement,\nL'équipe RealAmor\n\n` +
      `-----------------------------------------\n\n` +
      `Hallo ${username}\n\n` +
      `Welkom bij Real Amor!\n\n` +
      `We zijn blij je te mogen verwelkomen.\n\n` +
      `De volgende stap is het inplannen van een afspraak om je profiel te valideren.\n\n` +
      `Let op! Deze afspraak wordt opgenomen zodat het RealAmor-team je profiel kan bekijken, je achtergrond kan begrijpen en beter aan je behoeften kan voldoen!\n\n` +
      `De video van deze afspraak wordt nooit gedeeld met andere RealAmor-leden.\n\n` +
      `Aan het einde van je gesprek met een RealAmor-adviseur heb je de mogelijkheid om een korte introductievideo (OPTIONEEL) op te nemen voor geschikte profielen. Het is geheel aan jou of je deze video wilt delen. Deze wordt je binnen enkele dagen na je gesprek door het RealAmor-team toegestuurd.\n\n` +
      `Tijdens dit gesprek stelt ons neurowetenschappelijk team je een aantal vragen over je gewoonten, interesses en persoonlijkheid.\n\n` +
      `De kosten voor de validatieafspraak bedragen € 159,00. U kunt dit bedrag overmaken via bankoverschrijving naar:\n` +
      `RealAmor SRL\n` +
      `Rue Charles Martel 8, 1000 Brussel, België\n` +
      `BTW-nummer: 1015481815\n` +
      `IBAN: BE32 0019 9397 1002\n` +
      `BIC: GEBABEBB\n` +
      `Referentie: naam/achternaam/adres/e-mail\n` +
      `Zodra de betaling is ontvangen, kunt u via uw account inloggen op de RealAmor-agenda om uw afspraak te boeken.\n` +
      `Lukt het je niet op een van de geplande tijden van het bureau? Neem dan gerust contact met ons op via info@real-amor.com; samen vinden we een oplossing!\n\n` +
      `Met vriendelijke groet,\nHet RealAmor-team\n\n` +
      `-----------------------------------------\n\n` +
      `Hello ${username}\n\n` +
      `Welcome to Real Amor!\n\n` +
      `We are delighted to have you with us.\n\n` +
      `The next step is to schedule an appointment to validate your profile.\n\n` +
      `Please note! This appointment will be recorded so the RealAmor team can review your profile, understand your background, and better meet your needs!\n` +
      `The video of this appointment will never be shared with other RealAmor members.\n\n` +
      `At the end of your interview with a RealAmor advisor, you will have the option to record a short introductory video (OPTIONAL) for compatible profiles. It is entirely up to you whether or not to share this video, which will be sent to you by the RealAmor team in the days following your interview.\n\n` +
      `During this interview, our neuroscience team will ask you a series of questions about your habits, interests, and personality.\n\n` +
      `The validation appointment costs €159.00. Please make this payment by bank transfer to:\n` +
      `RealAmor SRL\n` +
      `Rue Charles Martel 8, 1000 Brussels, Belgium\n` +
      `VAT No. 1015481815\n` +
      `IBAN: BE32 0019 9397 1002\n` +
      `BIC: GEBABEBB\n` +
      `Reference: name/surname/address/email\n` +
      `Once payment is received, you will be able to access our RealAmor calendar to book your appointment by logging into your account!\n` +
      `Can't make it during one of the agency's scheduled times? Don't hesitate to contact us at info@real-amor.com; together we'll find a solution!\n\n` +
      `Sincerely,\nThe RealAmor Team`;

    if (targetLanguage === "nl") {
      emailSubject = "Welkom bij Real Amor!";
    } else {
      emailSubject = "Bienvenue sur Real Amor!";
    }

    // Configurarea opțiunilor de email
    const mailOptions = {
      from: getMailFrom(),
      to: email, // Emailul utilizatorului
      subject: emailSubject,
      text: emailMessage,
    };

    console.log("Trimiterea emailului de bun venit către:", email);

    // Trimiterea emailului
    return transporter
      .sendMail(mailOptions)
      .then(() => {
        console.log("Email de bun venit trimis cu succes:", email);
      })
      .catch((error) => {
        console.error("Eroare la trimiterea emailului:", error);
      });
  });

// Funcția periodică pentru actualizarea abonamentelor utilizatorilor
exports.updateUserSubscriptions = functions.pubsub
  .schedule("*/5 * * * *")
  .onRun(async (context) => {
    try {
      const usersSnapshot = await db.collection("Users").get();

      for (const userDoc of usersSnapshot.docs) {
        const userData = userDoc.data();

        // Lifetime users are managed outside Stripe subscriptions.
        // Important: do NOT let Stripe polling overwrite lifetime access/status.
        if (userData?.lifetimeAccess === true || userData?.subscriptionStatus === "lifetime") {
          continue;
        }

        const subscriptionId = userData.subscriptionId;

        if (!subscriptionId) continue;

        // Preia datele abonamentului din Stripe
        const subscription = await stripe.subscriptions.retrieve(
          subscriptionId
        );
        const endDateInMillis = subscription.current_period_end * 1000;
        const subscriptionEndDate = new Date(endDateInMillis);

        const cancelAtEnd = subscription.cancel_at_period_end;
        const isStripeActive = subscription.status === "active";

        // IMPORTANT:
        // If Stripe says the subscription is active, the user should keep premium access
        // even when cancel_at_period_end=true (this is the "canceled until end" state).
        const subscriptionStatus = isStripeActive && cancelAtEnd
          ? "canceledUntilEnd"
          : isStripeActive
          ? "active"
          : subscription.status === "canceled" && !subscription.current_period_end
          ? "expired"
          : subscription.status === "incomplete" ||
            subscription.status === "incomplete_expired"
          ? "paymentFailed"
          : "canceledImmediately";

        const updates = {
          subscriptionActive: isStripeActive,
          subscriptionStatus,
          subscriptionEndDate: subscriptionEndDate,
          cancelAtPeriodEnd: cancelAtEnd,
        };

        if (
          subscriptionStatus === "active" &&
          userData.subscriptionStatus !== "active"
        ) {
          updates.subscriptionStartDate = new Date();
        }

        // Actualizează documentul utilizatorului în Firestore
        await userDoc.ref.update(updates);
        console.log(`Updated subscription for user: ${userDoc.id}`);
      }

      console.log("Subscription updates completed successfully.");
    } catch (error) {
      console.error("Error updating subscriptions:", error);
    }
  });

exports.sendActivationEmail = functions.firestore
  .document("Users/{userId}")
  .onUpdate((change, context) => {
    const newUser = change.after.data();
    const previousUser = change.before.data();

    // Verificăm dacă isActivated devine true
    if (!previousUser.isActivated && newUser.isActivated) {
      const email = newUser.email;
      const username = newUser.username;
      const targetLanguage = newUser.targetLanguage || "fr";

      // Mesaje de activare a contului în funcție de limbă
      let emailMessage = "";
      let emailSubject = "";

      emailMessage =
        `Bonjour ${username}\n\n` +
        `Nous sommes ravis de voir que votre profil a été validé par un de nos conseillers et toute l'équipe de RealAmor a bien étudié votre profil.\n` +
        `Votre compte sur RealAmor a été activé!\n` +
        `Vous pouvez dès à présent choisir un de nos abonnements.\n\n` +
        `Nota Bene : tous nos abonnements sont payables uniquement en un seul paiement.\n\n` +
        `Tarifs:\n` +
        `- Abonnement 3 mois: Total de 417€ (139€/mois pendant 3 mois), renouvellement à 3 mois.\n` +
        `- Abonnement 6 mois: Total de 654€ (109€/mois pendant 6 mois), renouvellement à 6 mois.\n` +
        `- Abonnement 12 mois: Total de 1068€ (89€/mois pendant 12 mois), renouvellement à 12 mois.\n` +
        `- Abonnement à vie: Total de 1068€ (89€/mois pendant 12 mois). PROMO du moment ! Votre abonnement ne sera pas renouvelé et votre compte sera suivi à vie !\n\n` +
        `Vous pouvez trouver les tarifs et le descriptif de chaque abonnement sur la page : https://real-amor.com/#tarifs\n\n` +
        `Nous vous invitons à procéder à ce paiement par virement bancaire à\n` +
        `RealAmor SRL\n` +
        `Rue Charles Martel 8, 1000 Bruxelles, Belgique\n` +
        `TVA1015481815\n` +
        `IBAN : BE32 0019 9397 1002\n` +
        `BIC : GEBABEBB\n` +
        `Communication : nom/prénom/adresse/mail\n\n` +
        `Si vous avez choisi l'abonnement de 6 mois ou 1 an (le plus conseillé), l'équipe de RealAmor vous fera une présentation par visioconférence/téléphone de chaque profil compatible.\n` +
        `Si vous avez choisi l'abonnement de 1 an (le plus conseillé), RealAmor vous contactera pour vous proposer des conseils de l'équipe scientifique pour améliorer vos chances de réussite.\n\n` +
        `Vous pouvez vous connecter dès à présent à votre compte suivant ce lien : https://app.real-amor.com/login\n\n` +
        `Cordialement,\nL'équipe RealAmor\n\n` +
        `-----------------------------------------\n\n` +
        `Hallo ${username}\n\n` +
        `We zijn verheugd om te zien dat uw profiel is gevalideerd door een van onze adviseurs en dat het gehele RealAmor-team uw profiel grondig heeft beoordeeld.\n` +
        `Uw account op Real Amor is geactiveerd!\n` +
        `Je kunt nu kiezen voor één van onze abonnementen.\n\n` +
        `Let op: al onze abonnementen dienen in één keer te worden betaald.\n\n` +
        `Prijzen:\n` +
        `- Abonnement van 3 maanden: Totaal € 417 (€ 139 per maand gedurende 3 maanden), wordt elke 3 maanden verlengd.\n` +
        `- Abonnement van 6 maanden: Totaal € 654 (€ 109 per maand gedurende 6 maanden), wordt elke 6 maanden verlengd.\n` +
        `- Abonnement van 12 maanden: Totaal € 1068 (€ 89 per maand gedurende 12 maanden), wordt elke 12 maanden verlengd.\n` +
        `- Levenslang abonnement: Totaal € 1068 (€ 89 per maand gedurende 12 maanden). Speciale aanbieding! Uw abonnement wordt niet verlengd en uw account wordt levenslang gevolgd!\n\n` +
        `De prijzen en een beschrijving van elk abonnement vindt u op de pagina: https://real-amor.com/#tarifs\n\n` +
        `Wij verzoeken u de betaling te verrichten via bankoverschrijving naar:\n` +
        `RealAmor SRL\n` +
        `Rue Charles Martel 8, 1000 Brussel, België\n` +
        `BTW-nummer: 1015481815\n` +
        `IBAN: BE32 0019 9397 1002\n` +
        `BIC: GEBABEBB\n` +
        `Referentie: naam/achternaam/adres/e-mailadres\n\n` +
        `Als u gekozen hebt voor het abonnement van 6 maanden of 1 jaar (het meest aanbevolen), zal het RealAmor-team u een presentatie van elk compatibel profiel geven per videoconferentie/telefoon.\n` +
        `Als u gekozen hebt voor het abonnement van 1 jaar (het meest aanbevolen), neemt RealAmor contact met u op om u advies te geven van het wetenschappelijke team om uw kansen op succes te vergroten.\n\n` +
        `U kunt nu inloggen op uw account via deze link: https://app.real-amor.com/login\n\n` +
        `Groeten,\nHet RealAmor-team\n\n` +
        `-----------------------------------------\n\n` +
        `Hello ${username}\n\n` +
        `We are delighted to see that your profile has been validated by one of our advisors and the entire RealAmor team has thoroughly reviewed your profile.\n` +
        `Your account on RealAmor has been activated!\n` +
        `You can now choose one of our subscriptions.\n\n` +
        `Please note: all our subscriptions are payable in a single payment.\n\n` +
        `Prices:\n` +
        `- 3-month subscription: Total of €417 (€139/month for 3 months), renews every 3 months.\n` +
        `- 6-month subscription: Total of €654 (€109/month for 6 months), renews every 6 months.\n` +
        `- 12-month subscription: Total of €1068 (€89/month for 12 months), renews every 12 months.\n` +
        `- Lifetime subscription: Total of €1068 (€89/month for 12 months). Special offer! Your subscription will not be renewed and your account will be tracked for life!\n\n` +
        `You can find the prices and a description of each subscription on the page: https://real-amor.com/#tarifs\n\n` +
        `We invite you to make this payment by bank transfer to:\n` +
        `RealAmor SRL\n` +
        `Rue Charles Martel 8, 1000 Brussels, Belgium\n` +
        `VAT No. 1015481815\n` +
        `IBAN: BE32 0019 9397 1002\n` +
        `BIC: GEBABEBB\n` +
        `Reference: name/surname/address/email\n\n` +
        `If you have chosen the 6-month or 1-year subscription (the most recommended), the RealAmor team will give you a presentation by videoconference/telephone of each compatible profile.\n` +
        `If you have chosen the 1-year subscription (the most recommended), RealAmor will contact you to offer you advice from the scientific team to improve your chances of success.\n\n` +
        `You can now log in to your account following this link: https://app.real-amor.com/login\n\n` +
        `Sincerely,\nThe RealAmor Team`;

      if (targetLanguage === "nl") {
        emailSubject = "Uw Real Amor-account is geactiveerd!";
      } else {
        emailSubject = "Votre compte Real Amor est activé!";
      }

      // Configurarea opțiunilor de email
      const mailOptions = {
        from: "office@real-amor.com", // Adresa de email de pe cPanel
        to: email, // Emailul utilizatorului
        subject: emailSubject,
        text: emailMessage,
      };

      console.log("Trimiterea emailului de activare către:", email);

      // Trimiterea emailului
      return transporter
        .sendMail(mailOptions)
        .then(() => {
          console.log("Email de activare trimis cu succes:", email);
        })
        .catch((error) => {
          console.error("Eroare la trimiterea emailului:", error);
        });
    } else {
      // Dacă isActivated nu s-a schimbat sau este deja true, nu trimitem email
      return null;
    }
  });

exports.sendSubscriptionEmail = functions.firestore
  .document("Users/{userId}")
  .onUpdate((change, context) => {
    const newUser = change.after.data();
    const previousUser = change.before.data();

    // Verificăm dacă abonamentul a fost creat sau actualizat
    if (!previousUser.subscriptionActive && newUser.subscriptionActive) {
      if (newUser?.subscriptionActivationSource === "manual_transfer") {
        console.log(
          "Skip legacy sendSubscriptionEmail for manual transfer activation:",
          context?.params?.userId || null
        );
        return null;
      }

      const email = newUser.email;
      const username = newUser.username;
      const subName = newUser.subName;
      const targetLanguage = newUser.targetLanguage || "fr";

      // Mesaje de abonament în funcție de limbă
      let emailMessage = "";
      let emailSubject = "";

      emailMessage =
        `Bonjour ${username},\n\n` +
        `Merci pour votre abonnement à ${subName}!\n\n` +
        `L’équipe RealAmor vous transmettra les profils ` +
        `compatibles sur votre profil. \n` +
        `Si vous avez choisi l’abonnement de 6 mois ou ` +
        `1 an (le plus conseillé), ` +
        `l’équipe de RealAmor vous fera une présentation ` +
        `par visioconférence/téléphone ` +
        `de chaque profil compatible.\n` +
        `Si vous avez choisi l’abonnement de 1 an ` +
        `(le plus conseillé), RealAmor vous ` +
        `contactera pour vous proposer des conseils de ` +
        `l’équipe scientifique pour améliorer ` +
        `vos chances de réussite.\n\n` +
        `Connectez-vous dès maintenant pour accéder à votre profil: ` +
        `https://app.real-amor.com/login\n\n` +
        `Cordialement,\nL'équipe Real Amor\n\n` +
        `-----------------------------------------\n\n` +
        `Hallo ${username},\n\n` +
        `Bedankt voor uw aanmelding voor ${subName}!\n\n` +
        `Het RealAmor-team stuurt u de compatibele profielen op uw profiel.\n` +
        `Als u gekozen hebt voor het abonnement van 6 maanden of 1 jaar ` +
        `(het meest aanbevolen), zal het RealAmor-team u een presentatie ` +
        `per videoconferentie/telefoon geven van elk compatibel profiel.\n` +
        `Als u gekozen hebt voor het abonnement van 1 jaar ` +
        `(het meest aanbevolen), ` +
        `neemt RealAmor contact met u op om u advies te geven ` +
        `van het wetenschappelijke ` +
        `team om uw kansen op succes te vergroten.\n\n` +
        `Log nu in om toegang te krijgen tot uw profiel: ` +
        `https://app.real-amor.com/login\n\n` +
        `Groeten,\nHet Real Amor-team\n\n` +
        `-----------------------------------------\n\n` +
        `Hello ${username},\n\n` +
        `Thank you for subscribing to ${subName}!\n\n` +
        `The RealAmor team will send you the compatible ` +
        `profiles on your profile.\n` +
        `If you have chosen the 6-month or 1-year subscription ` +
        `(the most recommended), ` +
        `the RealAmor team will give you a presentation by ` +
        `videoconference/telephone ` +
        `of each compatible profile.\n` +
        `If you have chosen the 1-year subscription ` +
        `(the most recommended), RealAmor ` +
        `will contact you to offer you advice from ` +
        `the scientific team to improve ` +
        `your chances of success.\n\n` +
        `Log in now to access your profile: ` +
        `https://app.real-amor.com/login\n\n` +
        `Sincerely,\nThe Real Amor team`;

      if (targetLanguage === "nl") {
        emailSubject = `Uw abonnement op ${subName} is geactiveerd!`;
      } else {
        emailSubject = `Votre abonnement à ${subName} est activé!`;
      }

      // Configurarea opțiunilor de email
      const mailOptions = {
        from: "office@real-amor.com", // Adresa de email de pe cPanel
        to: email, // Emailul utilizatorului
        subject: emailSubject,
        text: emailMessage,
      };

      console.log("Trimiterea emailului de abonament către:", email);

      // Trimiterea emailului
      return transporter
        .sendMail(mailOptions)
        .then(() => {
          console.log("Email de abonament trimis cu succes:", email);
        })
        .catch((error) => {
          console.error("Eroare la trimiterea emailului:", error);
        });
    } else {
      // Dacă abonamentul nu a fost activat, nu trimitem email
      return null;
    }
  });

exports.sendFunnelTransitionEmails = functions.firestore
  .document("Users/{userId}")
  .onUpdate(async (change) => {
    const previousUser = change.before.data() || {};
    const newUser = change.after.data() || {};

    if (newUser?.deletedAccount?.isDeleted) return null;
    if (!newUser?.email) return null;

    const stagesToAnchor = ["booking_not_paid", "booking_not_scheduled"];

    for (const stage of stagesToAnchor) {
      const matchedBefore = matchesReminderStage(previousUser, stage);
      const matchedAfter = matchesReminderStage(newUser, stage);
      if (matchedBefore || !matchedAfter) continue;

      const existingAnchor = newUser?.reminders?.[stage]?.stageEnteredAt;
      if (existingAnchor) continue;

      try {
        await change.after.ref.set(
          {
            reminders: {
              [stage]: {
                stageEnteredAt: admin.firestore.FieldValue.serverTimestamp(),
              },
            },
          },
          { merge: true }
        );
      } catch (error) {
        console.error(`Failed setting stageEnteredAt for ${stage}:`, error);
      }
    }

    return null;
  });

function parseAdminCsv(raw) {
  if (!raw || typeof raw !== "string") return [];
  return raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

const FALLBACK_ADMIN_UIDS = [
  "SJTAqVztndgxISJAtnGzaSKieV02",
  "feSm5lY3F7aFrWNWneYw8qbPkiT2",
  "AcjykpO4W4M5JWCFPg0ZuxZVmiz1",
  "5WrGR81tQua0GZpCMW4IyUoZV7K2",
  "haLpd1x2lLZ3cSp68ldGXDPvZKQ2",
];

async function getAdminUidSetForFunctions() {
  const envUids = parseAdminCsv(process.env.ADMIN_UIDS || process.env.NEXT_PUBLIC_ADMIN_UIDS);
  if (envUids.length) return new Set(envUids);

  try {
    const configSnap = await db.collection("Config").doc("AdminUids").get();
    const fromDoc = Array.isArray(configSnap.data()?.uids) ? configSnap.data().uids : [];
    const cleaned = fromDoc.map((v) => String(v || "").trim()).filter(Boolean);
    if (cleaned.length) return new Set(cleaned);
  } catch (err) {
    console.error("Failed loading admin UIDs from Config/AdminUids:", err);
  }

  return new Set(FALLBACK_ADMIN_UIDS);
}

exports.runReminderSequences = functions.pubsub
  .schedule("0 9 * * *")
  .onRun(async () => {
    try {
      const result = await runReminderEngine({
        db,
        admin,
        transporter,
        source: "scheduler",
        action: "send",
        stage: "all",
      });
      console.log("runReminderSequences result:", result?.status, result?.summary);
    } catch (error) {
      console.error("runReminderSequences failed:", error);
    }
    return null;
  });

exports.runRemindersCallable = functions
  .runWith({ timeoutSeconds: 300, memory: "512MB" })
  .https.onCall(async (data, context) => {
  if (!context?.auth?.uid) {
    throw new functions.https.HttpsError("unauthenticated", "Authentication required.");
  }

  const adminUids = await getAdminUidSetForFunctions();
  if (!adminUids.has(context.auth.uid)) {
    throw new functions.https.HttpsError("permission-denied", "Admin access required.");
  }

  const action = String(data?.action || "preview").toLowerCase();
  const stage = String(data?.stage || "all").toLowerCase();
  const force = data?.force === true;
  const defaultLimit = action === "send" ? 50 : 200;
  const limit = Number(data?.limit || defaultLimit);

  const result = await runReminderEngine({
    db,
    admin,
    transporter,
    source: "callable",
    actorUid: context.auth.uid,
    action,
    stage,
    force,
    limit,
  });

  if (!result?.ok) {
    throw new functions.https.HttpsError("invalid-argument", result?.error || "Invalid payload");
  }

    return result;
  });

function isValidEmail(value) {
  if (!value || typeof value !== "string") return false;
  const email = value.trim();
  if (!email || email.length > 254) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

exports.sendNoSubscriptionTestEmailCallable = functions
  .runWith({ timeoutSeconds: 120, memory: "256MB" })
  .https.onCall(async (data) => {
    const to = String(data?.to || "").trim();
    const username = String(data?.username || "").trim();
    const language = String(data?.language || "fr").toLowerCase() === "nl" ? "nl" : "fr";
    const stage = "no_subscription";

    if (!isValidEmail(to)) {
      throw new functions.https.HttpsError("invalid-argument", "Valid `to` email is required.");
    }

    const emailPayload = buildReminderEmail(stage, {
      username,
      targetLanguage: language,
    });
    if (!emailPayload) {
      throw new functions.https.HttpsError("failed-precondition", "Missing reminder template.");
    }

    const info = await transporter.sendMail({
      from: process.env.MAIL_FROM || "office@real-amor.com",
      to,
      subject: emailPayload.subject,
      text: emailPayload.text,
    });

    return {
      ok: true,
      stage,
      to,
      subject: emailPayload.subject,
      messageId: info?.messageId || null,
    };
  });
