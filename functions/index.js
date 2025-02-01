const functions = require("firebase-functions");
const admin = require("firebase-admin");
const nodemailer = require("nodemailer");

const Stripe = require("stripe");
const stripe = new Stripe(functions.config().stripe.test_secret_key);

// Funcție care rulează la fiecare 5 minute

// Inițializează Firebase Admin SDK
admin.initializeApp();

const db = admin.firestore();

// Configurații pentru Nodemailer cu contul de email de pe cPanel
const transporter = nodemailer.createTransport({
  host: "mail.real-amor.com",
  port: 465,
  secure: true,
  auth: {
    user: "office@real-amor.com",
    pass: "realamoradm2024",
  },
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
      `Bonjour ${username},\n\n` +
      `Nous vous souhaitons la bienvenue sur Real Amor, ` +
      `l’agence de rencontre ` +
      `sans faux profils !\n\n` +
      `Nous sommes ravis de vous avoir parmi nous.\n\n` +
      `La prochaine étape est de prendre un Rendez-Vous en présentiel. ` +
      `Celui-ci aura lieu en Rue Charles Martel 8, 1000 Bruxelles.\n\n` +
      `Attention ! Ce rendez-vous sera enregistré pour permettre à l’équipe ` +
      `de RealAmor d’étudier votre profil, afin de comprendre votre vécu ` +
      `pour mieux répondre à vos besoins !\n\n` +
      `La vidéo de ce Rendez-Vous ne sera jamais diffusée aux autres membres ` +
      `inscrits à RealAmor.\n\n` +
      `A la fin de l’entretien avec un des conseillers RealAmor, vous aurez ` +
      `la possibilité d’enregistrer une vidéo de présentation (FACULTATIVE) ` +
      `destinée aux profils compatibles. C’est vous-même ` +
      `à décider de partager ` +
      `(ou pas) cette vidéo, qui vous sera envoyée par l’équipe de RealAmor ` +
      `les jours suivant votre entretien.\n\n` +
      `Votre Rendez-Vous en présentiel va se terminer par la réponse à ` +
      `une série des questions, tant sur vos habitudes, sur vos intérêts, ` +
      `mais aussi sur votre personnalité.\n\n` +
      `Vous ne pouvez pas vous libérer dans un des créneaux proposés par ` +
      `l’agence ? N'hésitez pas à nous contacter à info.realamor@gmail.com, ` +
      `ensemble on trouvera une solution !\n\n` +
      `Cordialement,\nL'équipe RealAmor\n\n` +
      `-----------------------------------------\n\n` +
      `Hallo ${username},\n\n` +
      `Wij heten je van harte welkom bij Real Amor, het datingbureau ` +
      `zonder nepprofielen!\n\n` +
      `Wij zijn blij u bij ons te hebben.\n\n` +
      `De volgende stap is het maken van een face-to-face afspraak. Deze ` +
      `zal plaatsvinden in de Karel Martelstraat 8, 1000 Brussel.\n\n` +
      `Aandacht ! Deze bijeenkomst wordt opgenomen zodat het RealAmor-team ` +
      `uw profiel kan bestuderen, om uw ervaringen te begrijpen en beter ` +
      `aan uw behoeften te voldoen!\n\n` +
      `De video van deze bijeenkomst zal nooit worden uitgezonden naar ` +
      `andere leden die bij RealAmor zijn geregistreerd.\n\n` +
      `Aan het einde van het interview met een van onze RealAmor-adviseurs ` +
      `krijgt u de mogelijkheid om een presentatievideo ` +
      `op te nemen (OPTIONEEL) ` +
      `deze is bedoeld voor compatibele profielen. Het is aan jou om te ` +
      `beslissen of je deze video, die je de dagen na je interview door ` +
      `het RealAmor-team wordt toegestuurd, wel of niet deelt.\n\n` +
      `Uw face-to-face ontmoeting eindigt met het antwoord op een reeks ` +
      `vragen, zowel over uw gewoonten, uw interesses, maar ook over ` +
      `uw persoonlijkheid.\n\n` +
      `Niet vrij op de aangeboden slots die het bureau aanbiedt? Aarzel ` +
      `dan niet om ons te contacteren via info.realamor@gmail.com, samen ` +
      `vinden we een oplossing!\n\n` +
      `Groeten,\nHet Real Amor-team\n\n` +
      `-----------------------------------------\n\n` +
      `Hello ${username},\n\n` +
      `We welcome you to Real Amor, the dating agency without ` +
      `fake profiles!\n\n` +
      `We are delighted to have you among us.\n\n` +
      `The next step is to make an appointment in person. This will take ` +
      `place at Rue Charles Martel 8, 1000 Brussels.\n\n` +
      `Attention! This appointment will be recorded to allow the RealAmor ` +
      `team to study your profile, in order to understand your experience ` +
      `to better meet your needs!\n\n` +
      `The video of this appointment will never be broadcast ` +
      `to other members ` +
      `registered with RealAmor.\n\n` +
      `At the end of the interview with one of the RealAmor advisors, you ` +
      `will have the opportunity to record a presentation video (OPTIONAL) ` +
      `intended for compatible profiles. It is up to you to decide whether ` +
      `or not to share this video, which will be sent to you by the RealAmor ` +
      `team in the days following your interview.\n\n` +
      `Your face-to-face meeting will end with the answer to a series of ` +
      `questions, both about your habits, your interests, but also about ` +
      `your personality.\n\n` +
      `You can't free yourself in one of the slots offered by the agency? ` +
      `Do not hesitate to contact us at info.realamor@gmail.com, together ` +
      `we will find a solution!\n\n` +
      `Kind regards,\nThe RealAmor team`;

    if (targetLanguage === "nl") {
      emailSubject = "Welkom bij Real Amor!";
    } else {
      emailSubject = "Bienvenue sur Real Amor!";
    }

    // Configurarea opțiunilor de email
    const mailOptions = {
      from: "office@real-amor.com", // Adresa de email de pe cPanel
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
        const subscriptionId = userData.subscriptionId;

        if (!subscriptionId) continue;

        // Preia datele abonamentului din Stripe
        const subscription = await stripe.subscriptions.retrieve(
          subscriptionId
        );
        const endDateInMillis = subscription.current_period_end * 1000;
        const subscriptionEndDate = new Date(endDateInMillis);

        const cancelAtEnd = subscription.cancel_at_period_end;
        const subscriptionStatus =
          subscription.status === "active" && cancelAtEnd
            ? "canceledUntilEnd"
            : subscription.status === "active"
            ? "active"
            : subscription.status === "canceled" &&
              !subscription.current_period_end
            ? "expired"
            : subscription.status === "incomplete" ||
              subscription.status === "incomplete_expired"
            ? "paymentFailed"
            : "canceledImmediately";

        const updates = {
          subscriptionActive: subscriptionStatus === "active",
          subscriptionStatus: subscriptionStatus,
          subscriptionEndDate: subscriptionEndDate,
          cancelAtPeriodEnd: subscription.cancel_at_period_end,
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
        `Bonjour ${username},\n\n` +
        `Nous sommes ravis de voir que votre entretien en présentiel ` +
        `a eu lieu ` +
        `et toute l’équipe de RealAmor a bien étudié votre profil.\n\n` +
        `Votre compte sur RealAmor a été activé!\n` +
        `Vous pouvez dès à présent choisir un de nos abonnements. ` +
        `Vous pouvez trouver les tarifs et le descriptif ` +
        `de chaque abonnement ` +
        `sur la page : https://real-amor.com/#tarifs\n\n` +
        `L’équipe RealAmor vous transmettra les profils compatibles ` +
        `sur votre profil.\n` +
        `Si vous avez choisi l’abonnement de 6 ` +
        `mois ou 1 an (le plus conseillé), ` +
        `l’équipe de RealAmor vous fera une présentation ` +
        `par visioconférence/téléphone ` +
        `de chaque profil compatible.\n` +
        `Si vous avez choisi l’abonnement de 1 an ` +
        `(le plus conseillé), RealAmor ` +
        `vous contactera pour vous proposer ` +
        `des conseils de l’équipe scientifique ` +
        `pour améliorer vos chances de réussite.\n\n` +
        `Vous pouvez vous connecter dès à présent ` +
        `à votre compte suivant ce lien : ` +
        `https://app.real-amor.com/login\n\n` +
        `Cordialement,\nL'équipe RealAmor\n\n` +
        `-----------------------------------------\n\n` +
        `Hallo ${username},\n\n` +
        `We zijn verheugd om te zien dat uw persoonlijke interview heeft ` +
        `plaatsgevonden en dat het hele RealAmor-team uw profiel zorgvuldig ` +
        `heeft bestudeerd.\n\n` +
        `Uw account op Real Amor is geactiveerd!\n` +
        `Je kunt nu kiezen voor één van onze abonnementen. De prijzen en ` +
        `de omschrijving van ieder abonnement vind je op de pagina: ` +
        `https://real-amor.com/#tarifs\n\n` +
        `Het RealAmor-team stuurt u de compatibele profielen op uw profiel.\n` +
        `Als u gekozen hebt voor het abonnement van 6 maanden of 1 jaar ` +
        `(het meest aanbevolen), zal het RealAmor-team u een presentatie ` +
        `per videoconferentie/telefoon geven van elk compatibel profiel.\n` +
        `Als u gekozen hebt voor het abonnement ` +
        `van 1 jaar (het meest aanbevolen), ` +
        `neemt RealAmor contact met u op om u advies te geven van het ` +
        `wetenschappelijke team om uw kansen op succes te vergroten.\n\n` +
        `U kunt nu inloggen op uw account via deze link: ` +
        `https://app.real-amor.com/login\n\n` +
        `Groeten,\nHet Real Amor-team\n\n` +
        `-----------------------------------------\n\n` +
        `Hello ${username},\n\n` +
        `We are delighted to see that your face-to-face interview took place ` +
        `and the RealAmor team has studied your profile.\n\n` +
        `Your account on RealAmor has been activated!\n` +
        `You can now choose one of our subscriptions. You can find the rates ` +
        `and description of each subscription on the page: ` +
        `https://real-amor.com/#tarifs\n\n` +
        `The RealAmor team will send you the compatible ` +
        `profiles on your profile.\n` +
        `If you have chosen the 6-month or 1-year ` +
        `subscription (the most recommended), ` +
        `the RealAmor team will give you a presentation ` +
        `by videoconference/telephone ` +
        `of each compatible profile.\n` +
        `If you have chosen the 1-year subscription ` +
        `(the most recommended), RealAmor ` +
        `will contact you to offer you advice from ` +
        `the scientific team to improve ` +
        `your chances of success.\n\n` +
        `You can now log in to your account following this link: ` +
        `https://app.real-amor.com/login\n\n` +
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
