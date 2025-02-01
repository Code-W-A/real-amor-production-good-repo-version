export const firstQuestions = [
  {
    id: 0.1,
    text: "En quoi pouvons-nous vous aider?",
    options: [
      "Je cherche un(e) partenaire de vie pour une relation sérieuse et stable.",
      "Je cherche des rencontres coquines en toute discrétion.",
      "Je cherche à élargir mon cercle d’amis.",
    ],
    type: "single",
    next: 0.2, // Trece la întrebarea următoare din acest set
    matchRequired: true, // Această întrebare este folosită pentru matching
    compatibility: true, // Această întrebare este folosită pentru matching
  },
  {
    id: 0.2,
    text: "Choisissez votre canal de communication préféré avec l’équipe de RealAmor, un seul est nécessaire!",
    options: [
      "Par mail",
      "Appel téléphonique sur mon GSM",
      "Appel téléphonique sur mon fixe",
      "Whatsapp",
      "SMS",
    ],
    type: "single",
    next: 0.3, // Trece la întrebarea următoare din acest set
  },
  {
    id: 0.3,
    text: "Dans quelle tranche d’heures préférez-vous être contacté? (Choix multiple)",
    options: ["Matin", "Midi", "Après midi", "Début soirée", "Soirée"],
    type: "multiple",
    next: 0.4, // După această întrebare, să treacă la un set nou, în funcție de răspunsul la întrebarea 1
  },
  // {
  //   id: 0.4,
  //   text: "Acceptez-vous que cette information soit partagée avec les profils compatibles ?",
  //   options: ["Oui", "Non"],
  //   type: "single", // Consimțământ simplu
  //   consentFor: [0.1, 0.2, 0.3], // Se referă la întrebarea 3
  //   next: null, // Urmează următoarea întrebare din secțiune
  // },
];

export const questionsSet1 = [
  {
    id: 1,
    section: "Amour",
    text: "Etes-vous:",
    options: ["Homme", "Femme", "Non-binaire"],
    type: "single", // Se poate selecta o singură opțiune
    next: 2, // Urmează întrebarea despre consimțământ
    consentAfter: true, // Afișează consimțământul după răspuns
    matchRequired: false, // Această întrebare este folosită pentru matching
    compatibility: true, // Această întrebare este folosită pentru matching
  },
  // {
  //   id: 2,
  //   text: "Acceptez-vous que cette information soit partagée avec les profils compatibles ?",
  //   options: ["Oui", "Non"],
  //   type: "single", // Consimțământ simplu
  //   consentFor: [1], // Se referă la întrebarea 1
  //   next: 3, // Urmează următoarea întrebare din secțiune
  // },
  {
    id: 3,
    text: "Langues parlées :",
    options: [
      "Français",
      "Anglais",
      "Espagnol",
      "Allemand",
      "Italien",
      "Chinois",
      "Japonais",
    ], // Listă predefinită de limbi
    type: "multiple", // Permite selecția multiplă
    allowsCustom: true, // Permite adăugarea unei limbi personalizate
    next: 4, // Urmează întrebarea despre consimțământ
    consentAfter: true, // Afișează consimțământul după răspuns
    matchRequired: false, // Această întrebare este folosită pentru matching
    compatibility: true, // Această întrebare este folosită pentru matching
  },
  // {
  //   id: 4,
  //   text: "Acceptez-vous que cette information soit partagée avec les profils compatibles ?",
  //   options: ["Oui", "Non"],
  //   type: "single", // Consimțământ simplu
  //   consentFor: [3], // Se referă la întrebarea 3
  //   next: 5, // Urmează următoarea întrebare din secțiune
  // },
  {
    id: 5,
    text: "Cherchez-vous:",
    options: ["Homme", "Femme", "Bisexuel/le"],
    type: "single", // Se poate selecta o singură opțiune
    next: 6, // Urmează întrebarea despre consimțământ
    matchRequired: false, // Această întrebare este folosită pentru matching
    compatibility: true, // Această întrebare este folosită pentru matching
    consentAfter: true, // Afișează consimțământul după răspuns
  },
  // {
  //   id: 6,
  //   text: "Acceptez-vous que cette information soit partagée avec les profils compatibles ?",
  //   options: ["Oui", "Non"],
  //   type: "single", // Consimțământ simplu
  //   consentFor: [5], // Se referă la întrebarea 5
  //   next: 7, // Urmează următoarea întrebare din secțiune
  // },
  {
    id: 7,
    text: "Votre orientation sexuelle est :",
    options: [
      "Hétérosexuel/le",
      "Bisexuel/le",
      "Homosexuel",
      "Transgenre",
      "En questionnement",
    ],
    type: "single", // Se poate selecta o singură opțiune
    next: 8, // Urmează întrebarea despre consimțământ
    consentAfter: true, // Afișează consimțământul după răspuns
    matchRequired: false, // Această întrebare este folosită pentru matching
    compatibility: true, // Această întrebare este folosită pentru matching
  },
  // {
  //   id: 8,
  //   text: "Acceptez-vous que cette information soit partagée avec les profils compatibles ?",
  //   options: ["Oui", "Non"],
  //   type: "single", // Consimțământ simplu
  //   consentFor: [7], // Se referă la întrebarea 7
  //   next: 9, // Urmează următoarea întrebare din secțiune
  // },
  {
    id: 9,
    text: "Où habitez-vous ?",
    type: "input", // Input pentru cod poștal
    placeholder: "Code postal (Belgique)",
    api: {
      url: "https://api.zippopotam.us/",
      // url: "https://api.zippopotam.us/",
      params: { country: "be" }, // Specificație pentru Belgia
    },
    responseMapping: {
      postalCode: "post code", // Maparea codului poștal
      city: "places[0]['place name']", // Maparea orașului din API
    },
    next: 10, // Urmează întrebarea despre consimțământ
    consentAfter: true, // Afișează consimțământul după răspuns
  },
  // {
  //   id: 10,
  //   text: "Acceptez-vous que cette information soit partagée avec les profils compatibles ?",
  //   options: ["Oui", "Non"],
  //   type: "single", // Consimțământ simplu
  //   consentFor: [9], // Se referă la întrebarea 9
  //   next: 11, // Urmează următoarea întrebare din secțiune
  // },
  {
    id: 11,
    text: "Quelle est votre date de naissance ?",
    type: "input", // Input pentru introducerea datei
    placeholder: "JJ/MM/AAAA",
    validation: {
      type: "date",
      format: "dd/MM/yyyy",
    },
    next: 12, // Urmează întrebarea despre vârsta partenerului ideal
    consentAfter: false,
    matchRequired: false, // Această întrebare este folosită pentru matching
    compatibility: true, // Această întrebare este folosită pentru matching
    compatibilityForOtherQuestion: true, // Această întrebare este folosită pentru matching
  },
  {
    id: 12,
    text: "Quel est la tranche d’âge idéale de votre futur partenaire ?",
    type: "range", // Selectarea unui interval de vârstă
    placeholder: { min: "De", max: "À" },
    validation: {
      type: "range",
      min: 18, // Limită minimă de vârstă
      max: 100, // Limită maximă de vârstă
    },
    next: 13, // Urmează următoarea întrebare
    matchWith: [11], // Se face matching între vârsta persoanei și intervalul dorit
    consentAfter: false,
    matchRequired: false, // Această întrebare este folosită pentru matching
    compatibility: true, // Această întrebare este folosită pentru matching
    compatibilityForOtherQuestion: true, // Această întrebare este folosită pentru matching
    qustionForCompatibility: [11],
  },
  {
    id: 13,
    text: "De quelle origine êtes-vous ?",
    options: [
      "Européenne",
      "Asiatique",
      "Arabe",
      "Indienne",
      "Africaine",
      "Latino-américaine",
    ],
    type: "single", // Se poate selecta o singură opțiune
    allowsCustom: true, // Permite adăugarea unei origini personalizate
    next: 14,
    consentAfter: false,
    matchRequired: false, // Această întrebare este folosită pentru matching
    compatibility: true, // Această întrebare este folosită pentru matching
    compatibilityForOtherQuestion: true, // Această întrebare este folosită pentru matching
  },
  {
    id: 14,
    text: "De quelle origine souhaiteriez-vous votre partenaire ?",
    options: [
      "Sans importance",
      "Européenne",
      "Asiatique",
      "Arabe",
      "Indienne",
      "Africaine",
      "Latino-américaine",
    ],
    type: "multiple", // Permite selecția multiplă
    allowsCustom: true, // Permite adăugarea unei origini personalizate
    next: 15, // Urmează următoarea întrebare
    matchWith: [13], // Se face matching între originea persoanei și dorințele exprimate
    consentAfter: false,
    matchRequired: false, // Această întrebare este folosită pentru matching
    compatibility: true, // Această întrebare este folosită pentru matching
    compatibilityForOtherQuestion: true, // Această întrebare este folosită pentru matching
    qustionForCompatibility: [11],
  },
  {
    id: 15,
    text: "Quelle est votre religion ?",
    options: [
      "Bouddhiste",
      "Catholique",
      "Croyant, non pratiquant",
      "Juive",
      "Musulmane",
      "Non croyant et non pratiquant",
      "Orthodoxe",
      "Protestante",
    ],
    type: "single", // Se poate selecta o singură opțiune
    allowsCustom: true, // Permite adăugarea unei religii personalizate
    next: 16,
    consentAfter: false,
    matchRequired: true, // Această întrebare este folosită pentru matching
    compatibility: true, // Această întrebare este folosită pentru matching
    compatibilityUserReligion: true, // Această întrebare este folosită pentru matching
  },
  {
    id: 16,
    text: "Avez-vous une préférence quant à la religion de votre partenaire ?",
    options: [
      "Sans importance",
      "Bouddhiste",
      "Catholique",
      "Croyant, non pratiquant",
      "Juive",
      "Musulmane",
      "Non croyant et non pratiquant",
      "Orthodoxe",
      "Protestante",
    ],
    type: "multiple", // Permite selecția multiplă
    allowsCustom: true, // Permite adăugarea unei religii personalizate
    next: 17, // Urmează întrebarea despre consimțământ
    matchWith: [15], // Se face matching între religia persoanei și dorințele exprimate
    consentAfter: true,
    matchRequired: true, // Această întrebare este folosită pentru matching
    compatibility: true, // Această întrebare este folosită pentru matching
    compatibilityWantedReligion: true, // Această întrebare este folosită pentru matching
  },
  // {
  //   id: 17,
  //   text: "Acceptez-vous que cette information soit partagée avec les profils compatibles ?",
  //   options: ["Oui", "Non"],
  //   type: "single", // Consimțământ simplu
  //   consentFor: [11, 12, 13, 14, 15, 16], // Se aplică pentru întrebările din acest calup
  //   next: 18,
  // },
  {
    id: 18,
    text: "Quel est votre métier ?",
    options: ["Sans emploi"],
    type: "single", // Se poate selecta o singură opțiune
    allowsCustom: true, // Permite adăugarea unui alt răspuns
    api: {
      url: "https://www.je-change-de-metier.com/les-metiers-de-a-a-z", // Pentru sugestii de meserii
      params: {},
    },
    next: 19, // Urmează întrebarea despre satisfacția în muncă
    consentAfter: false,
  },
  {
    id: 19,
    text: "Etes-vous satisfait de votre métier ?",
    options: [
      "Oui, mon métier me passionne.",
      "Non.",
      "J’envisage une reconversion professionnelle.",
      "Il me fait vivre, mais ce n’est pas ma priorité.",
    ],
    type: "single", // Se poate selecta o singură opțiune
    next: 20,
    consentAfter: false,
  },
  {
    id: 20,
    text: "Votre carrière est :",
    options: [
      "Continue dans le même emploi.",
      "Avec des pauses.",
      "Continue mais avec des changements d’emploi.",
    ],
    type: "single", // Se poate selecta o singură opțiune
    next: 21,
    consentAfter: false,
  },
  {
    id: 21,
    text: "Travaillez-vous :",
    options: [
      "De jour, horaire de bureau.",
      "En pause, y compris la nuit.",
      "Uniquement la nuit.",
      "Horaires variable, je peux travailler même le week-end.",
      "Horaires variable, mais jamais le week-end.",
    ],
    type: "multiple", // Permite selecția multiplă
    next: 22,
    compatibility: true, // Această întrebare este folosită pentru matching
    consentAfter: false,
  },
  {
    id: 22,
    text: "Travaillez-vous loin de votre domicile ?",
    options: [
      "A moins de 15 minutes.",
      "A moins de 30 minutes.",
      "A moins de 1 heure.",
      "A moins de 2 heures.",
    ],
    type: "single", // Se poate selecta o singură opțiune
    next: 23,
    consentAfter: false,
  },
  {
    id: 23,
    text: "Quel est votre niveau d’études ?",
    options: [
      "Etudes secondaires.",
      "Breveté.",
      "Bachelier.",
      "Master.",
      "Doctorat.",
    ],
    type: "single", // Se poate selecta o singură opțiune
    next: 24, // Urmează întrebarea despre consimțământ
    consentAfter: true,
    matchRequired: false, // Această întrebare este folosită pentru matching
    compatibility: true, // Această întrebare este folosită pentru matching
  },
  // {
  //   id: 24,
  //   text: "Acceptez-vous que cette information soit partagée avec les profils compatibles ?",
  //   options: ["Oui", "Non"],
  //   type: "single", // Consimțământ simplu
  //   consentFor: [18, 19, 20, 21, 22, 23], // Se referă la întrebările din acest calup
  //   next: 25,
  // },
  {
    id: 25,
    text: "Habitez-vous :",
    options: [
      "Seul.",
      "Avec mes parents.",
      "Avec mes enfants tout le temps.",
      "Avec mes enfants une partie du temps.",
      "Colocation.",
      "C’est délicat.",
      "Sans domicile fixe.",
    ],
    type: "single", // Se poate selecta o singură opțiune
    next: 26,
    consentAfter: false,
  },
  {
    id: 26,
    text: "Combien d’enfants avez-vous ?",
    options: ["Je n’ai pas d’enfants.", "1", "2", "3", "4", "5", "6+"],
    type: "single", // Se poate selecta o singură opțiune
    conditionalNext: {
      "Je n’ai pas d’enfants.": 30, // Sare direct la întrebarea 30 dacă utilizatorul nu are copii
    },
    next: 27, // Dacă există copii, continuă cu detalii despre aceștia
    consentAfter: false,
  },
  {
    id: 27,
    text: "Quel âge a le plus jeune de vos enfants ?",
    type: "input", // Input numeric
    placeholder: "Années",
    validation: {
      type: "number",
      min: 0,
      max: 100,
    },
    next: 28,
    consentAfter: false,
  },
  {
    id: 28,
    text: "Quel âge a le plus âgé de vos enfants ?",
    type: "input", // Input numeric
    placeholder:
      "Années (si enfant unique mettre le même âge que la question précédente)",
    validation: {
      type: "number",
      min: 0,
      max: 100,
    },
    next: 29,
    consentAfter: false,
  },
  {
    id: 29,
    text: "Avez-vous une bonne relation avec l’autre parent ?",
    options: [
      "Oui, il y a une bonne communication entre nous.",
      "Non, c’est encore conflictuel.",
      "Par moment c’est conflictuel.",
    ],
    type: "single",
    next: 30,
    consentAfter: false,
    matchRequired: false, // Această întrebare este folosită pentru matching
    compatibility: true, // Această întrebare este folosită pentru matching
  },
  {
    id: 30,
    text: "Vous vivez avec vos enfants :",
    options: [
      "100% du temps",
      "50% du temps (garde alternée)",
      "20% du temps (2 week-ends par mois)",
      "Moins que le 20% du temps (vacances scolaires ou moins)",
    ],
    type: "single",
    next: 31,
    consentAfter: false,
    matchRequired: false, // Această întrebare este folosită pentru matching
    compatibility: true, // Această întrebare este folosită pentru matching
  },
  {
    id: 31,
    text: "Accepteriez-vous que votre partenaire ait des enfants à charge ?",
    options: ["Oui", "Non"],
    type: "single",
    conditionalNext: {
      Oui: 32,
      Non: 35,
    },
    next: 35,
    consentAfter: false,
    matchRequired: false, // Această întrebare este folosită pentru matching
    compatibility: true, // Această întrebare este folosită pentru matching
  },
  {
    id: 32,
    text: "Combien d’enfants au maximum accepteriez-vous du coté de votre partenaire ?",
    type: "input", // Input numeric
    placeholder: "Nombre d'enfants",
    validation: {
      type: "number",
      min: 0,
      max: 10,
    },
    next: 33,
    consentAfter: false,
  },
  {
    id: 33,
    text: "Avez-vous une préférence concernant l’âge minimum des enfants du coté de votre partenaire ?",
    options: ["Non", "Oui"],
    type: "single",
    conditionalNext: {
      Oui: 34,
      Non: 35,
    },
    next: 35,
    consentAfter: false,
    matchRequired: false, // Această întrebare este folosită pentru matching
    compatibility: true, // Această întrebare este folosită pentru matching
  },
  {
    id: 34,
    text: "Si Oui, indiquez l’âge minimum :",
    type: "input", // Input numeric
    placeholder: "Années",
    validation: {
      type: "number",
      min: 0,
      max: 100,
    },
    next: 35,
    consentAfter: false,
  },
  {
    id: 35,
    text: "Voulez-vous avoir des enfants avec votre futur partenaire ?",
    options: ["Oui", "Non"],
    type: "single",
    next: 36,
    consentAfter: false,
  },
  {
    id: 36,
    text: "Avez-vous des animaux de compagnie ?",
    options: ["Oui", "Non"],
    type: "single",
    conditionalNext: {
      Oui: 37,
      Non: 39,
    },
    next: 39,
    consentAfter: false,
    matchRequired: false, // Această întrebare este folosită pentru matching
    compatibility: true, // Această întrebare este folosită pentru matching
  },
  {
    id: 37,
    text: "Si Oui, lesquels ?",
    options: [
      "Chien",
      "Chat",
      "Poisson",
      "Reptiles",
      "Hamster",
      "Lapin",
      // "Autre : ajouter un animal",
      "J’ai une ferme !!!",
    ],
    type: "multiple",
    next: 39,
    consentAfter: false,
    allowsCustom: true, // Permite adăugarea unei limbi personalizate
  },
  {
    id: 39,
    text: "Accepteriez-vous que votre partenaire ait des animaux de compagnie ?",
    options: ["Oui", "Non"],
    type: "single",
    next: 40,
    consentAfter: false,
    matchRequired: false, // Această întrebare este folosită pentru matching
    compatibility: true, // Această întrebare este folosită pentru matching
  },
  // {
  //   id: 40,
  //   text: "Acceptez-vous que cette information soit partagée avec les profils compatibles ?",
  //   options: ["Oui", "Non"],
  //   type: "single", // Consimțământ simplu
  //   consentFor: [25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 39], // Se aplică pentru întrebările din acest calup
  //   next: 41,
  // },
  {
    id: 41,
    text: "Vous habitez :",
    options: ["Dans un appartement", "Dans une maison", "En colocation"],
    type: "single", // Se poate selecta o singură opțiune
    next: 42,
    consentAfter: false,
    allowsCustom: true,
  },
  {
    id: 42,
    text: "Etes-vous :",
    options: ["Propriétaire", "Locataire"],
    type: "single", // Se poate selecta o singură opțiune
    next: 43,
    consentAfter: false,
  },
  {
    id: 43,
    text: "Au cas où vous rencontriez la personne de votre cœur, comment voyez-vous les projets futurs dans votre couple ?",
    options: [
      "Cohabitation.",
      "Chacun chez soit, on pourra se voir dans notre temps libre.",
    ],
    type: "single", // Se poate selecta o singură opțiune
    next: 44,
    consentAfter: false,
    matchRequired: false, // Această întrebare este folosită pentru matching
    compatibility: true, // Această întrebare este folosită pentru matching
  },
  {
    id: 44,
    text: "Au cas où vous rencontriez la personne de votre cœur, seriez-vous d’accord à déménager chez l’autre ?",
    options: ["Oui", "Non", "Un foyer nouveau pour les deux c’est mieux."],
    type: "single", // Se poate selecta o singură opțiune
    next: 45,
    consentAfter: false,
  },
  {
    id: 45,
    text: "Quel est votre moyen de transport principal :",
    options: [
      "A pieds.",
      "En Vélo",
      "En Moto",
      "En Voiture",
      "En Transport en commun.",
    ],
    type: "single", // Se poate selecta o singură opțiune
    next: 46,
    consentAfter: false,
  },
  {
    id: 46,
    text: "Combien des Km êtes-vous prêt à faire pour aller voir (souvent) votre partenaire ?",
    options: ["Moins de 10 km.", "Moins de 50 km.", "Moins de 100 km."],
    type: "single", // Se poate selecta o singură opțiune
    next: 47, // Urmează întrebarea despre consimțământ
    consentAfter: true,
  },
  {
    id: 47,
    text: "Acceptez-vous que ces informations soient partagées avec les profils compatibles ?",
    options: ["Oui", "Non"],
    type: "single", // Consimțământ simplu
    consentFor: [41, 42, 43, 44, 45, 46], // Se aplică pentru întrebările din acest calup
    next: 48,
  },
  {
    id: 48,
    text: "Quelle est votre situation familiale personnelle ?",
    options: [
      "Je n’ai jamais été marié(e).",
      "Je suis divorcé(e).",
      "Je suis séparé(e).",
      "Je suis veuf(ve).",
      "C’est compliqué.",
    ],
    type: "single", // Se poate selecta o singură opțiune
    next: 49,
    consentAfter: false,
  },
  {
    id: 49,
    text: "Quelle est la place du mariage dans votre vie ?",
    options: [
      "C’est primordial.",
      "C’est possible, mais non nécessaire.",
      "J’ai déjà donné, plus jamais !",
    ],
    type: "single", // Se poate selecta o singură opțiune
    next: 50,
    consentAfter: false,
  },
  {
    id: 50,
    text: "Quelle est la relation avec votre famille d’origine ?",
    options: [
      "Fusionnelle, nous nous voyons tous les jours.",
      "On se voit de façon récurrente, chacun chez soi pour le reste",
      "Je n’ai plus de famille ou j’ai coupé les contacts",
      "Je suis en contact avec ma famille, à distance",
    ],
    type: "single", // Se poate selecta o singură opțiune
    next: 51,
    consentAfter: false,
  },
  {
    id: 51,
    text: "Votre famille d’origine a-t-elle émis des avis négatifs sur un ou plusieurs de vos partenaires pendant ou après vos relations ?",
    options: ["Oui, toujours", "Oui, parfois", "Non"],
    type: "single", // Se poate selecta o singură opțiune
    next: 52,
    consentAfter: false,
  },
  {
    id: 52,
    text: "Vos enfants ont-ils émis des avis négatifs sur un ou plusieurs de vos partenaires pendant ou après vos relations ?",
    options: ["Je n’ai pas d’enfants", "Oui, toujours", "Oui, parfois", "Non"],
    type: "single", // Se poate selecta o singură opțiune
    next: 53, // Urmează întrebarea despre consimțământ
    consentAfter: true,
  },
  {
    id: 53,
    text: "Acceptez-vous que ces informations soient partagées avec les profils compatibles ?",
    options: ["Oui", "Non"],
    type: "single", // Consimțământ simplu
    consentFor: [48, 49, 50, 51, 52], // Se aplică pentru întrebările din acest calup
    next: 54,
  },
  //start nou
  {
    id: 54,
    text: "Quelle est votre taille ?",
    type: "range", // Slider pentru selecție
    singleValue: true, // Specifică dacă este un slider cu o singură valoare
    validation: {
      min: 50,
      max: 250,
    },
    next: 55,
    matchRequired: false,
    compatibility: true,
    compatibilityHeightUser: true,
  },

  {
    id: 55,
    text: "Quel est votre poids ?",
    type: "range", // Schimbat din "input" în "range"
    singleValue: true, // Slider cu o singură valoare
    validation: {
      min: 30, // Greutatea minimă rezonabilă
      max: 300, // Greutatea maximă rezonabilă
    },
    next: 56,
    matchRequired: false,
    compatibility: true,
    compatibilityWeightUser: true, // Folosit pentru matching
  },

  {
    id: 56,
    text: "Avez-vous une préférence concernant la taille et le poids de votre partenaire ?",
    options: ["Oui", "Non"],
    type: "single", // Selecție simplă
    conditionalNext: {
      Oui: 57, // Continuă cu preferințele pentru talie și greutate
      Non: 59, // Sare direct la întrebarea 59
    },
    next: 59,
  },
  {
    id: 57,
    text: "Taille minimum et maximum du partenaire :",
    type: "range", // Interval pentru talie
    placeholder: { min: "Min cm", max: "Max cm" },
    validation: {
      type: "range",
      min: 50,
      max: 250,
    },
    next: 58,
    matchWith: [54], // Match între talia utilizatorului și preferințe
    compatibility: true,
    compatibilityHeightPartner: true, // Preferințe de talie
  },
  {
    id: 58,
    text: "Poids minimum et maximum du partenaire :",
    type: "range", // Interval pentru greutate
    placeholder: { min: "Min kg", max: "Max kg" },
    validation: {
      type: "range",
      min: 30,
      max: 300,
    },
    next: 59,
    matchWith: [55], // Match între greutatea utilizatorului și preferințe
    compatibility: true,
    compatibilityWeightPartner: true, // Preferințe de greutate
  },
  {
    id: 59,
    text: "Etes-vous satisfait de votre aspect physique ?",
    options: ["Oui !", "Non", "Je me sens beau/belle parfois, parfois moins."],
    type: "single", // Selecție simplă
    next: 60,
  },
  {
    id: 60,
    text: "Soignez-vous votre aspect physique :",
    options: [
      "Oui, je fais beaucoup d’attention à ça.",
      "Non, je suis comme je suis.",
      "Oui, dans la limite du temps à disposition.",
    ],
    type: "single", // Selecție simplă
    next: 61,
    compatibility: true,
  },
  {
    id: 61,
    text: "Faites-vous du sport ?",
    type: "single",
    options: [
      "Oui, tous les jours",
      "Oui, entre 4 et 5 fois par semaine.",
      "Oui, entre 2 et 3 fois par semaine.",
      "Oui, 1 fois par semaine.",
      "Non",
    ],
    next: 62,
    compatibility: true, // Nu este utilizată pentru compatibilitate
  },
  {
    id: 62,
    text: "Avez-vous une maladie ou un handicap qui pourrait avoir un impact sur vos recontres?",
    type: "single",
    options: ["Oui", "Non"],
    next: 63,
    compatibility: true,
  },
  {
    id: 63,
    text: "Acceptez-vous que ces informations soient partagées avec les profils compatibles ?",
    type: "single",
    options: ["Oui", "Non"],
    next: 64,
  },
  {
    id: 64,
    text: "Alimentation : vous êtes :",
    type: "single",
    options: [
      "Omnivore",
      "Végétarien",
      "Végan",
      "Végétalien",
      "Régime particulier",
    ],
    next: 65,
    compatibility: true,
  },
  {
    id: 65,
    text: "Accepteriez-vous que votre partenaire ait des habitudes alimentaires différentes des vôtres ?",
    type: "single",
    options: ["Oui", "Non", "Oui, mais sans obligation de changement."],
    next: 66,
    compatibility: true,
  },
  {
    id: 66,
    text: "Acceptez-vous que ces informations soient partagées avec les profils compatibles ?",
    type: "single",
    options: ["Oui", "Non"],
    next: 67,
  },
  {
    id: 67,
    text: "Tabac :",
    type: "single",
    options: ["Oui", "Non"],
    conditionalNext: {
      Oui: 68,
      Non: 69,
    },
  },
  {
    id: 68,
    text: "Si Oui : Quelle est la fréquence ?",
    type: "single",
    options: ["Tous les jours", "Occasionnellement", "Rarement"],
    next: 69,
  },
  {
    id: 69,
    text: "Alcool :",
    type: "single",
    options: ["Oui", "Non"],
    conditionalNext: {
      Oui: 70,
      Non: 72,
    },
  },
  {
    id: 70,
    text: "Si Oui : Quelle est la fréquence ?",
    type: "single",
    options: ["Tous les jours", "Occasionnellement", "Rarement"],
    next: 71,
  },
  {
    id: 71,
    text: "Quel type d’alcool consommez-vous le plus ?",
    type: "single",
    options: ["Bière", "Vin", "Spiritueux et Cocktails"],
    next: 72,
  },
  {
    id: 72,
    text: "Café :",
    type: "single",
    options: ["Oui", "Non"],
    conditionalNext: {
      Oui: 73,
      Non: 74,
    },
  },
  {
    id: 73,
    text: "Si Oui : Quelle est la fréquence ?",
    type: "single",
    options: ["Tous les jours", "Occasionnellement", "Rarement"],
    next: 74,
  },
  {
    id: 74,
    text: "Thé :",
    type: "single",
    options: ["Oui", "Non"],
    conditionalNext: {
      Oui: 75,
      Non: 76,
    },
  },
  {
    id: 75,
    text: "Si Oui : Quelle est la fréquence ?",
    type: "single",
    options: ["Tous les jours", "Occasionnellement", "Rarement"],
    next: 76,
  },
  {
    id: 76,
    text: "Boissons sucrées :",
    type: "single",
    options: ["Oui", "Non"],
    conditionalNext: {
      Oui: 77,
      Non: 78,
    },
  },
  {
    id: 77,
    text: "Si Oui : Quelle est la fréquence ?",
    type: "single",
    options: ["Tous les jours", "Occasionnellement", "Rarement"],
    next: 78,
  },
  {
    id: 78,
    text: "Boissons énergétiques :",
    type: "single",
    options: ["Oui", "Non"],
    conditionalNext: {
      Oui: 79,
      Non: 80,
    },
  },
  {
    id: 79,
    text: "Si Oui : Quelle est la fréquence ?",
    type: "single",
    options: ["Tous les jours", "Occasionnellement", "Rarement"],
    next: 80,
  },
  {
    id: 80,
    text: "Acceptez-vous que ces informations soient partagées avec les profils compatibles ?",
    type: "single",
    options: ["Oui", "Non"],
  },
  //Premier Rendez-vous//
  {
    id: 81,
    text: "Quelle activité choisiriez-vous pour un premier rendez-vous ?",
    type: "image-selection", // Tipul este bazat pe imagini
    options: [
      { image: "activityfour.png" },
      { image: "activitythree.png" },
      { image: "activitytwo.png" },
      { image: "activityone.png" },
    ],
    next: 82,
  },
  {
    id: 82,
    text: "Etes-vous plutôt rapide pour un premier rendez-vous ?",
    type: "single",
    options: [
      "Oui, je préfère le réel.",
      "Je prends mon temps pour connaitre l’autre avant d’envisager le rendez-vous.",
    ],
    next: 83,
  },
  {
    id: 83,
    text: "Un profil intéressant vous propose de vous voir demain soir, mais votre soirée est déjà prise :",
    type: "single",
    options: [
      "J’annule ma soirée et j’accepte le rendez-vous proposé.",
      "Je décline l’invitation.",
      "Je décline l’invitation en lui proposant un autre moment.",
    ],
    next: 84,
    compatibility: true,
  },
  {
    id: 84,
    text: "Compte tenu de vos activités professionnelles/familiales/personnelles, combien de jours par semaine êtes-vous disponible pour un rendez-vous ?",
    type: "single",
    options: [
      "Tous les jours.",
      "Moins que 5 jours par semaine.",
      "Moins que 3 jours par semaine.",
      "Moins qu’un jour par semaine.",
      "Uniquement les week-ends.",
      "Une fois chaque 2 semaines.",
      "En fonction de la garde parentale.",
    ],
    next: 85,
    compatibility: true,
  },
  {
    id: 85,
    text: "Un rendez-vous professionnel non obligatoire est-il prioritaire à un premier rendez-vous ?",
    type: "single",
    options: ["Oui", "Non"],
    next: 86,
    compatibility: true,
  },
  {
    id: 86,
    text: "Un repas familial routinier est-il prioritaire à un premier rendez-vous ?",
    type: "single",
    options: ["Oui", "Non"],
    next: 87,
    compatibility: true,
  },
  {
    id: 87,
    text: "Auriez-vous l’envie et la possibilité d’organiser un premier rendez-vous pendant la garde de vos enfants ?",
    type: "single",
    options: ["Je n’ai pas d’enfants.", "Oui", "Non"],
    next: 88,
    compatibility: true,
  },
  {
    id: 88,
    text: "Vous avez prévu une activité sportive, seul ou avec des amis, l’annuleriez-vous pour un premier rendez-vous ?",
    type: "single",
    options: ["Oui", "Non"],
    next: 89,
    compatibility: true,
  },
  {
    id: 89,
    text: "Une sortie habituelle avec des amis est-il prioritaire à un premier rendez-vous ?",
    type: "single",
    options: ["Oui", "Non"],
    next: 90,
    compatibility: true,
  },
  {
    id: 90,
    text: "Qui paye l’addition au premier rendez-vous ?",
    type: "single",
    options: [
      "Moi, mais j’apprécie que l’autre se propose.",
      "L’autre.",
      "On partage.",
      "On partage, mais j’apprécie la galanterie.",
    ],
    next: 91,
  },
  {
    id: 91,
    text: "Etes-vous ponctuel/le ?",
    type: "single",
    options: ["Oui", "Non"],
    next: 92,
    compatibility: true,
  },
  {
    id: 92,
    text: "Etes-vous plutôt à l’écoute ou celui qui tient la conversation lors d’un premier rendez-vous ?",
    type: "single",
    options: ["A l’écoute.", "Je tiens la conversation.", "Les deux."],
    next: 93,
  },
  {
    id: 93,
    text: "Etes-vous de nature timide ?",
    type: "single",
    options: ["Oui", "Non"],
    next: 94,
  },
  {
    id: 94,
    text: "Le statut de l’autre personne pourrait-il vous impressionner ?",
    type: "single",
    options: ["Oui", "Non"],
    next: 95,
  },
  {
    id: 95,
    text: "Le contact physique (hors sexe) au premier rendez-vous est :",
    type: "single",
    options: [
      "Impossible.",
      "Envisageable.",
      "Je recherche un contact physique même au premier rendez-vous.",
    ],
    next: 96,
    compatibility: true,
  },
  {
    id: 96,
    text: "Le sexe au premier rendez-vous est :",
    type: "single",
    options: [
      "Impossible.",
      "Envisageable.",
      "Je recherche un contact physique même au premier rendez-vous.",
    ],
    next: 97,
  },
  {
    id: 97,
    text: "Si vous devez chercher un peu d’intimité avec l’autre lors d’un premier rendez-vous, une location serait :",
    type: "multiple",
    options: [
      "Chez moi.",
      "Chez l’autre.",
      "Dans la voiture.",
      "A l’Hôtel.",
      "Dans un lieu insolite.",
    ],
    next: 98,
  },
  {
    id: 98,
    text: "Quel est l’élément qui attire plus votre attention chez l’autre :",
    type: "multiple",
    options: [
      "Aspect physique.",
      "Aspect financier.",
      "Aspect familial.",
      "Aspect culturel.",
      "Statut.",
      "Personnalité.",
    ],
    validation: {
      max: 2, // Maxim două opțiuni
    },
    next: 99,
    compatibility: true,
  },
  {
    id: 99,
    text: "A qui parlez-vous de votre premier rendez-vous ?",
    type: "single",
    options: [
      "Je n’en parle pas.",
      "Parent.",
      "Frère/Sœur.",
      "Enfant.",
      "Amis.",
    ],
    next: 100,
  },
  {
    id: 100,
    text: "Est-il important de prévoir un second rendez-vous si le courant passe bien ?",
    type: "single",
    options: [
      "Oui, j’attends que l’autre me le propose.",
      "Oui, je le propose à l’autre.",
      "Non.",
    ],
    next: 101,
  },
  {
    id: 101,
    text: "Vous venez de rencontrer une personne qui vous attire beaucoup. Après combien de temps aimeriez-vous un second rendez-vous ?",
    type: "single",
    options: [
      "Le lendemain.",
      "A 3 jours maximum.",
      "Dans la semaine au plus tard.",
      "Dans les 2 semaines au plus tard.",
      "Dans le mois.",
    ],
    next: 102,
    compatibility: true,
  },
  {
    id: 102,
    text: "Après un premier rendez-vous, aimeriez-vous avoir un feedback de la part de l’autre sur son ressenti ?",
    type: "single",
    options: ["Oui", "Non"],
    next: 103,
    compatibility: true,
  },
  {
    id: 103,
    text: "Est-il important pour vous d’avoir un échange (sms/appel) entre le premier et le second rendez-vous ?",
    type: "single",
    options: ["Oui", "Non"],
    next: 104,
    compatibility: true,
  },
  {
    id: 104,
    text: "L’autre annule le rendez-vous à la dernière minute, comment vous vous comportez ?",
    type: "single",
    options: [
      "Ça dépend de la raison.",
      "Au suivant.",
      "Je suis déçu et j’exprime mon ressenti.",
    ],
    next: 105,
  },
  {
    id: 105,
    text: "Acceptez-vous que ces informations soient partagées avec les profils compatibles ?",
    type: "single",
    options: ["Oui", "Non"],
  },
  //Dans une relation à long terme//
  {
    id: 106,
    text: "Vous-êtes célibataire depuis :",
    type: "multiple",
    options: [
      "<6 mois", // 1 lună
      "<1 an", // 3 luni
      "<2 ans", // 6 luni
      "<3 ans", // 1 an
      ">5 ans", // 2 ani
    ],
    allowsCustom: true,
    next: 107,
  },
  {
    id: 107,
    text: "Votre histoire amoureuse plus longue a duré :",
    type: "multiple",
    options: [
      "<1 an", // 1 lună
      "<3 ans ", // 3 luni
      "<5 ans", // 6 luni
      "<8 ans", // 1 an
      "10 ans ou plus", // 2 ani
    ],
    next: 108,
    allowsCustom: true,
  },
  {
    id: 108,
    text: "Dans le passé avez-vous eu la sensation ou la certitude d’avoir été trahi ?",
    type: "single",
    options: ["Oui", "Non"],
    next: 109,
    compatibility: true,
  },
  {
    id: 109,
    text: "Dans le passé avez-vous trahi ?",
    type: "single",
    options: ["Oui", "Non"],
    next: 110,
    compatibility: true,
  },
  {
    id: 110,
    text: "Etes-vous disponible à voir l’autre :",
    type: "single",
    options: [
      "Tous les jours.",
      "Entre 4 et 5 par semaine.",
      "Entre 2 et 3 jours par semaine.",
      "Une fois par semaine.",
      "Moins qu’une fois par semaine.",
    ],
    next: 111,
  },
  {
    id: 111,
    text: "Pour vous, être en couple, c'est...",
    type: "single",
    options: [
      "Un bon équilibre entre loisirs personnels et loisirs de couple",
      "Tout faire ensemble, profiter de chaque instant à deux",
      "Etre ensemble pour le meilleur et pour les moments moins faciles",
      "On passe des bons moments ensemble",
    ],
    next: 112,
    compatibility: true,
  },
  {
    id: 112,
    text: "Quand votre partenaire reçoit une bonne nouvelle (une promotion, etc.), que ressentez-vous réellement ?",
    type: "single",
    options: [
      "J’en suis content(e) et fier (fière) de l’autre.",
      "J’en suis envieux(se).",
      "Cela me laisse indifférent.",
      "J’ai un sentiment de compétition, je dois faire mieux.",
    ],
    next: 113,
    compatibility: true,
  },
  {
    id: 113,
    text: "A la maison, je peux m’occuper de (choix multiple) :",
    type: "multiple",
    options: [
      "La cuisine",
      "Le ménage",
      "La lessive",
      "Le repassage",
      "Le rangement",
      "Le jardin",
      "Gestion des enfants",
      "Gestion des finances",
      "Tâches administratives",
      "Mobilité (voiture/Vélo etc)",
      "Organisation de la vie sociale",
      "Bricolage",
    ],
    next: 114,
  },
  {
    id: 114,
    text: "Quelle serait la fréquence sexuelle adaptée à vous ?",
    type: "single",
    options: [
      "Plusieurs fois par jour.",
      "Quotidienne.",
      "Plusieurs fois par semaine.",
      "Hebdomadaire.",
      "Quelques fois par mois.",
      "Je suis asexuel.",
    ],
    next: 115,
    compatibility: true,
  },
  {
    id: 115,
    text: "Quelle est pour vous la place de la tendresse dans le couple ?",
    type: "single",
    options: [
      "Plus importante que le sexe.",
      "Aussi importante que le sexe.",
      "Importante, sans plus.",
      "Pas importante.",
    ],
    next: 116,
    compatibility: true,
  },
  {
    id: 116,
    text: "Vos vacances préférées sont (choix multiple):",
    type: "multiple", // Permite selectarea multiplă
    options: [
      "A la maison.",
      "A la mer.",
      "En montagne.",
      "Visite des villes.",
      "Nature.",
      "Camping.",
    ],
    next: 117,
    allowsCustom: true,
  },
  {
    id: 117,
    text: "Si vous avez des enfants, avez-vous la possibilité et l’envie d’envisager des vacances sans eux ?",
    type: "single",
    options: ["Je n’ai pas d’enfants", "Oui", "Non"],
    next: 118,
  },
  {
    id: 118,
    text: "Etes-vous un sorteur/sorteuse ?",
    type: "single",
    options: ["Oui", "Non"],
    next: 119,
    compatibility: true,
  },
  {
    id: 119,
    text: "Etes-vous plutôt casanier(ère) ?",
    type: "single",
    options: ["Oui", "Non"],
    next: 120,
    compatibility: true,
  },
  {
    id: 120,
    text: "Est-il important pour vous que votre partenaire partage vos hobbys ?",
    type: "single",
    options: ["Oui", "Non"],
    next: 121,
    compatibility: true,
  },
  {
    id: 121,
    text: "Quels sont vos hobbys ?",
    type: "input", // Permite răspuns liber
    placeholder: "Écrivez vos hobbys",
    next: 122,
  },
  {
    id: 122,
    text: "Quel genre de musique écoutez-vous ?",
    type: "input", // Permite răspuns liber
    placeholder: "Écrivez votre genre musical préféré",
    next: 123,
  },
  {
    id: 123,
    text: "Acceptez-vous que ces informations soient partagées avec les profils compatibles ?",
    type: "single",
    options: ["Oui", "Non"],
  },
  //Asta e identic pe toate cele 3 subiecte//

  {
    personaliteStart: true,
    id: 124,
    text: "Je me sens tendu(e) ou énervé(e).",
    type: "single",
    options: ["Oui", "Non"],
    personalitate: true,
    next: 125,
    categoriePersonalitate: "CATEGORIA A",
  },
  {
    id: 125,
    text: "J’ai une sensation de peur comme si quelque chose d’horrible allait m’arriver.",
    type: "single",
    options: ["Oui", "Non"],
    personalitate: true,
    next: 126,
    categoriePersonalitate: "CATEGORIA A",
  },
  {
    id: 126,
    text: "Je ris facilement et vois le bon côté des choses.",
    type: "single",
    options: ["Oui", "Non"],
    personalitate: true,
    next: 127,
    categoriePersonalitate: "CATEGORIA F",
  },
  {
    id: 127,
    text: "Je suis de bonne humeur.",
    type: "single",
    options: ["Oui", "Non"],
    personalitate: true,
    next: 128,
    categoriePersonalitate: "CATEGORIA F",
  },
  {
    id: 128,
    text: "Je peux rester tranquillement assis(e) à ne rien faire et me sentir décontracté(e).",
    type: "single",
    options: ["Oui", "Non"],
    personalitate: true,
    next: 129,
    categoriePersonalitate: "CATEGORIA F",
  },
  {
    id: 129,
    text: "J’ai l’impression de fonctionner au ralenti.",
    type: "single",
    options: ["Oui", "Non"],
    personalitate: true,
    next: 130,
  },
  {
    id: 130,
    text: "J’éprouve des sensations de peur et j’ai l’estomac noué.",
    type: "single",
    options: ["Oui", "Non"],
    personalitate: true,
    next: 131,
    categoriePersonalitate: "CATEGORIA A",
  },
  {
    id: 131,
    text: "Je fais attention à mon apparence.",
    type: "single",
    options: ["Oui", "Non"],
    personalitate: true,
    next: 132,
    categoriePersonalitate: "CATEGORIA F",
  },
  {
    id: 132,
    text: "J’ai la bougeotte et n’arrive pas à tenir en place.",
    type: "single",
    options: ["Oui", "Non"],
    personalitate: true,
    next: 133,
    categoriePersonalitate: "CATEGORIA C",
  },
  {
    id: 133,
    text: "Je me réjouis d’avance à l’idée de faire certaines choses.",
    type: "single",
    options: ["Oui", "Non"],
    personalitate: true,
    next: 134,
    categoriePersonalitate: "CATEGORIA F",
  },
  {
    id: 134,
    text: "J’éprouve des sensations soudaines de panique.",
    type: "single",
    options: ["Oui", "Non"],
    personalitate: true,
    next: 135,
    categoriePersonalitate: "CATEGORIA A",
  },
  {
    id: 135,
    text: "Je fais/Je dis les choses sans y penser.",
    type: "single",
    options: ["Oui", "Non"],
    personalitate: true,
    next: 136,
    categoriePersonalitate: "CATEGORIA C",
  },
  {
    id: 136,
    text: "J'ai des idées qui fusent.",
    type: "single",
    options: ["Oui", "Non"],
    personalitate: true,
    next: 137,
    categoriePersonalitate: "CATEGORIA C",
  },
  {
    id: 137,
    text: "Je projette mes voyages longtemps à l'avance.",
    type: "single",
    options: ["Oui", "Non"],
    personalitate: true,
    next: 138,
    categoriePersonalitate: "CATEGORIA A",
  },
  {
    id: 138,
    text: "Je suis maître de moi.",
    type: "single",
    options: ["Oui", "Non"],
    personalitate: true,
    next: 139,
    categoriePersonalitate: "CATEGORIA F",
  },
  {
    id: 139,
    text: "Je me concentre facilement.",
    type: "single",
    options: ["Oui", "Non"],
    personalitate: true,
    next: 140,
    categoriePersonalitate: "CATEGORIA F",
  },
  {
    id: 140,
    text: "J'ai la bougeotte au spectacle ou aux conférences.",
    type: "single",
    options: ["Oui", "Non"],
    personalitate: true,
    next: 141,
    categoriePersonalitate: "CATEGORIA C",
  },
  {
    id: 141,
    text: "Je veille à ma sécurité d'emploi.",
    type: "single",
    options: ["Oui", "Non"],
    personalitate: true,
    next: 142,
    categoriePersonalitate: "CATEGORIA A",
  },
  {
    id: 142,
    text: "J'aime réfléchir à des problèmes complexes.",
    type: "single",
    options: ["Oui", "Non"],
    personalitate: true,
    next: 143,
    categoriePersonalitate: "CATEGORIA D",
  },
  {
    id: 143,
    text: "J'ai peur sans aucune raison.",
    type: "single",
    options: ["Oui", "Non"],
    personalitate: true,
    categoriePersonalitate: "CATEGORIA A",
  },
  {
    id: 144,
    text: "J'agis sur un 'coup de tête'.",
    type: "single",
    options: ["Oui", "Non"],
    personalitate: true,
    next: 145,
    categoriePersonalitate: "CATEGORIA C",
  },
  {
    id: 145,
    text: "Je parle vite.",
    type: "single",
    options: ["Oui", "Non"],
    personalitate: true,
    next: 146,
    categoriePersonalitate: "CATEGORIA A",
  },
  {
    id: 146,
    text: "J’aime les rendez-vous romantiques traditionnels.",
    type: "single",
    options: ["Oui", "Non"],
    personalitate: true,
    next: 147,
    categoriePersonalitate: "CATEGORIA D",
  },
  {
    id: 147,
    text: "Je suis rapidement impatient(e) et irrité(e) si je ne trouve pas une solution à un problème.",
    type: "single",
    options: ["Oui", "Non"],
    personalitate: true,
    next: 148,
    categoriePersonalitate: "CATEGORIA D",
  },
  {
    id: 148,
    text: "Il m’a été déjà dit que j’ai une drôle d’allure ou de démarche.",
    type: "single",
    options: ["Oui", "Non"],
    personalitate: true,
    next: 149,
    categoriePersonalitate: "CATEGORIA D",
  },
  {
    id: 149,
    text: "Je trouve difficile d'apprendre des choses pour lesquelles je ne suis pas intéressé(e).",
    type: "single",
    options: ["Oui", "Non"],
    personalitate: true,
    next: 150,
    categoriePersonalitate: "CATEGORIA D",
  },
  {
    id: 150,
    text: "J’ai des habitudes difficiles à interrompre.",
    type: "single",
    options: ["Oui", "Non"],
    personalitate: true,
    next: 151,
    categoriePersonalitate: "CATEGORIA D",
  },
  {
    id: 151,
    text: "Si je suis interrompu(e), je ne peux pas revenir rapidement à ce que je faisais avant.",
    type: "single",
    options: ["Oui", "Non"],
    personalitate: true,
    next: 152,
    categoriePersonalitate: "CATEGORIA D",
  },
  {
    id: 152,
    text: "Je trouve facile de décrire mes sentiments.",
    type: "single",
    options: ["Oui", "Non"],
    personalitate: true,
    next: 153,
    categoriePersonalitate: "CATEGORIA F",
  },
  {
    id: 153,
    text: "J’ai un besoin intense d'observer les habitudes des humains et/ ou des animaux",
    type: "single",
    options: ["Oui", "Non"],
    personalitate: true,
    next: 154,
    categoriePersonalitate: "CATEGORIA D",
  },
  {
    id: 154,
    text: "J’ai la tendance à être tellement absorbé(e) par mes intérêts spécifiques que j’oublie tout le reste.",
    type: "single",
    options: ["Oui", "Non"],
    personalitate: true,
    next: 155,
    categoriePersonalitate: "CATEGORIA D",
  },
  {
    id: 155,
    text: "Je suis jaloux(se) en couple.",
    type: "single",
    options: ["Oui", "Non"],
    personalitate: true,
    next: 156,
    categoriePersonalitate: "CATEGORIA A",
  },
  {
    id: 156,
    text: "J’ai été accusé d’avoir un regard fixe ou de regarder fixement.",
    type: "single",
    options: ["Oui", "Non"],
    personalitate: true,
    next: 157,
    categoriePersonalitate: "CATEGORIA D",
  },
  {
    id: 157,
    text: "Je suis bon(ne) dans l'interprétation des expressions du visage.",
    type: "single",
    options: ["Oui", "Non"],
    personalitate: true,
    next: 158,
    categoriePersonalitate: "CATEGORIA F",
  },
  {
    id: 158,
    text: "Je suis fidèle.",
    type: "single",
    options: ["Oui", "Non"],
    personalitate: true,
    next: 159,
    categoriePersonalitate: "CATEGORIA F",
  },
  {
    id: 159,
    text: "J’ai besoin de beaucoup de motivation pour faire les choses.",
    type: "single",
    options: ["Oui", "Non"],
    personalitate: true,
    next: 160,
    categoriePersonalitate: "CATEGORIA B",
  },
  {
    id: 160,
    text: "J’aime les voyages.",
    type: "single",
    options: ["Oui", "Non"],
    personalitate: true,
    next: 161,
    categoriePersonalitate: "CATEGORIA F",
  },
  {
    id: 161,
    text: "J’ai tendance à interpréter les choses littéralement.",
    type: "single",
    options: ["Oui", "Non"],
    personalitate: true,
    next: 162,
    categoriePersonalitate: "CATEGORIA D",
  },
  {
    id: 162,
    text: "Je me sens souvent triste.",
    type: "single",
    options: ["Oui", "Non"],
    personalitate: true,
    next: 163,
    categoriePersonalitate: "CATEGORIA B",
  },
  {
    id: 163,
    text: "Je crois avoir connu plus d’échecs que le reste des gens.",
    type: "single",
    options: ["Oui", "Non"],
    personalitate: true,
    categoriePersonalitate: "CATEGORIA B",
  },

  {
    id: 164,
    text: "Mon sommeil est perturbé.",
    type: "single",
    options: ["Oui", "Non"],
    personalitate: true,
    next: 165,
    categoriePersonalitate: "CATEGORIA B",
  },
  {
    id: 165,
    text: "Je suis capable de me détendre.",
    type: "single",
    options: ["Oui", "Non"],
    personalitate: true,
    next: 166,
    categoriePersonalitate: "CATEGORIA F",
  },
  {
    id: 166,
    text: "Je suis timide.",
    type: "single",
    options: ["Oui", "Non"],
    personalitate: true,
    next: 167,
    categoriePersonalitate: "CATEGORIA D",
  },
  {
    id: 167,
    text: "Je me sens à l'aise avec le travail d'équipe.",
    type: "single",
    options: ["Oui", "Non"],
    personalitate: true,
    next: 168,
    categoriePersonalitate: "CATEGORIA F",
  },
  {
    id: 168,
    text: "J’ai la tendance à me sentir coupable.",
    type: "single",
    options: ["Oui", "Non"],
    personalitate: true,
    next: 169,
    categoriePersonalitate: "CATEGORIA B",
  },
  {
    id: 169,
    text: "Je suis fier (fière) de moi-même.",
    type: "single",
    options: ["Oui", "Non"],
    personalitate: true,
    next: 170,
    categoriePersonalitate: "CATEGORIA F",
  },
  {
    id: 170,
    text: "Je me critique beaucoup.",
    type: "single",
    options: ["Oui", "Non"],
    personalitate: true,
    next: 171,
    categoriePersonalitate: "CATEGORIA B",
  },
  {
    id: 171,
    text: "Je me soucie de ce que les gens pensent de moi.",
    type: "single",
    options: ["Oui", "Non"],
    personalitate: true,
    next: 172,
    categoriePersonalitate: "CATEGORIA A",
  },
  {
    id: 172,
    text: "Je suis fier (fière) de mon apparence.",
    type: "single",
    options: ["Oui", "Non"],
    personalitate: true,
    next: 173,
    categoriePersonalitate: "CATEGORIA F",
  },
  {
    id: 173,
    text: "J’aime les grandes manifestations, même s'il y a foule.",
    type: "single",
    options: ["Oui", "Non"],
    personalitate: true,
    next: 174,
    categoriePersonalitate: "CATEGORIA F",
  },
  {
    id: 174,
    text: "J’ai des problèmes pour trouver mon chemin vers de nouveaux lieux.",
    type: "single",
    options: ["Oui", "Non"],
    personalitate: true,
    next: 175,
    categoriePersonalitate: "CATEGORIA D",
  },
  {
    id: 175,
    text: "J’ai déjà pensé à me tuer.",
    type: "single",
    options: ["Oui", "Non"],
    personalitate: true,
    next: 176,
    categoriePersonalitate: "CATEGORIA B",
  },
  {
    id: 176,
    text: "Je suis sensible lorsque je regarde les films.",
    type: "single",
    options: ["Oui", "Non"],
    personalitate: true,
    next: 177,
    categoriePersonalitate: "CATEGORIA D",
  },
  {
    id: 177,
    text: "J’ai un bon équilibre entre le travail, les loisirs et le repos.",
    type: "single",
    options: ["Oui", "Non"],
    personalitate: true,
    next: 178,
    categoriePersonalitate: "CATEGORIA F",
  },
  {
    id: 178,
    text: "J’ai déjà vécu des pressions importantes au travail.",
    type: "single",
    options: ["Oui", "Non"],
    personalitate: true,
    next: 179,
    categoriePersonalitate: "CATEGORIA B",
  },
  {
    id: 179,
    text: "Je pleure souvent.",
    type: "single",
    options: ["Oui", "Non"],
    personalitate: true,
    next: 180,
    categoriePersonalitate: "CATEGORIA B",
  },
  {
    id: 180,
    text: "Je suis irritable au volant.",
    type: "single",
    options: ["Oui", "Non"],
    personalitate: true,
    next: 181,
    categoriePersonalitate: "CATEGORIA B",
  },
  {
    id: 181,
    text: "J’ai du mal à reconnaitre mes responsabilités.",
    type: "single",
    options: ["Oui", "Non"],
    personalitate: true,
    next: 182,
    categoriePersonalitate: "CATEGORIA B",
  },
  {
    id: 182,
    text: "Je remets les décisions au lendemain (procrastination).",
    type: "single",
    options: ["Oui", "Non"],
    personalitate: true,
    next: 183,
    categoriePersonalitate: "CATEGORIA B",
  },
  {
    id: 183,
    text: "Je me trouve attrayant(e).",
    type: "single",
    options: ["Oui", "Non"],
    personalitate: true,
    categoriePersonalitate: "CATEGORIA F",
  },

  {
    id: 184,
    text: "J’ai des problèmes liés au temps dans les conversations.",
    type: "single",
    options: ["Oui", "Non"],
    personalitate: true,
    next: 185,
    categoriePersonalitate: "CATEGORIA D",
  },
  {
    id: 185,
    text: "Je collectionne des objets.",
    type: "single",
    options: ["Oui", "Non"],
    personalitate: true,
    next: 186,
    categoriePersonalitate: "CATEGORIA D",
  },
  {
    id: 186,
    text: "Mon travail me demande beaucoup d’effort.",
    type: "single",
    options: ["Oui", "Non"],
    personalitate: true,
    next: 187,
    categoriePersonalitate: "CATEGORIA B",
  },
  {
    id: 187,
    text: "Je me sens souvent fatigué(e).",
    type: "single",
    options: ["Oui", "Non"],
    personalitate: true,
    next: 188,
    categoriePersonalitate: "CATEGORIA B",
  },
  {
    id: 188,
    text: "Si je suis irritable j’ai la tendance à manger moins.",
    type: "single",
    options: ["Oui", "Non"],
    personalitate: true,
    next: 189,
    categoriePersonalitate: "CATEGORIA G",
  },
  {
    id: 189,
    text: "Si je suis irritable j’ai la tendance à manger plus.",
    type: "single",
    options: ["Oui", "Non"],
    personalitate: true,
    next: 190,
    categoriePersonalitate: "CATEGORIA G",
  },
  {
    id: 190,
    text: "Je m’identifie à toutes les pathologies que je lis sur internet.",
    type: "single",
    options: ["Oui", "Non"],
    personalitate: true,
    next: 191,
    categoriePersonalitate: "CATEGORIA E",
  },
  {
    id: 191,
    text: "J’ai un humour noir.",
    type: "single",
    options: ["Oui", "Non"],
    personalitate: true,
    next: 192,
    categoriePersonalitate: "CATEGORIA F",
  },
  {
    id: 192,
    text: "Je suis mal à l’aise face à des personnes qui ont une communication ironique.",
    type: "single",
    options: ["Oui", "Non"],
    personalitate: true,
    next: 193,
    categoriePersonalitate: "CATEGORIA D",
  },
  {
    id: 193,
    text: "Je suis gêné(e) par les étiquettes des vêtements.",
    type: "single",
    options: ["Oui", "Non"],
    personalitate: true,
    next: 194,
    categoriePersonalitate: "CATEGORIA D",
  },
  {
    id: 194,
    text: "J’accepte facilement les critiques.",
    type: "single",
    options: ["Oui", "Non"],
    personalitate: true,
    next: 195,
    categoriePersonalitate: "CATEGORIA F",
  },
  {
    id: 195,
    text: "Je m’adapte facilement à une situation.",
    type: "single",
    options: ["Oui", "Non"],
    personalitate: true,
    next: 196,
    categoriePersonalitate: "CATEGORIA F",
  },
  {
    id: 196,
    text: "L’arrivée dans un nouveau travail m’angoisse.",
    type: "single",
    options: ["Oui", "Non"],
    personalitate: true,
    next: 197,
    categoriePersonalitate: "CATEGORIA A",
  },
  {
    id: 197,
    text: "J’aime le contact de l’autre.",
    type: "single",
    options: ["Oui", "Non"],
    personalitate: true,
    next: 198,
    categoriePersonalitate: "CATEGORIA F",
  },
  {
    id: 198,
    text: "J’ai des difficultés à parler en public.",
    type: "single",
    options: ["Oui", "Non"],
    personalitate: true,
    next: 199,
  },
  {
    id: 199,
    text: "J’ai été victime d'un abus sexuel/maltraitance.",
    type: "single",
    options: ["Oui", "Non"],
    personalitate: true,
    categoriePersonalitate: "CATEGORIA B",
  },
];

export const questionsSet2 = [
  {
    id: 1,
    section: "Sexe",
    text: "Etes-vous:",
    options: [
      "Homme",
      "Femme",
      "Couple libertin",
      "Couple libre",
      "Non-binaire",
    ],
    type: "single", // Se poate selecta o singură opțiune
    next: 2, // Urmează întrebarea despre consimțământ
    consentAfter: true, // Afișează consimțământul după răspuns
    matchRequired: false, // Această întrebare este folosită pentru matching
    compatibility: true, // Această întrebare este folosită pentru matching
  },
  // {
  //   id: 2,
  //   text: "Acceptez-vous que cette information soit partagée avec les profils compatibles ?",
  //   options: ["Oui", "Non"],
  //   type: "single", // Consimțământ simplu
  //   consentFor: [1], // Se referă la întrebarea 1
  //   next: 3, // Urmează următoarea întrebare din secțiune
  // },
  {
    id: 3,
    text: "ATTENTION ! Toute utilisation commerciale du sexe est interdite sur cette plateforme, acceptez-vous cette condition ?",
    options: ["Oui", "Non"],
    type: "single", // Consimțământ simplu
    next: 4, // Urmează întrebarea despre consimțământ
  },
  {
    id: 4,
    section: "Sexe",
    text: "Langues parlées :",
    options: [
      "Français",
      "Anglais",
      "Espagnol",
      "Allemand",
      "Italien",
      "Chinois",
      "Japonais",
    ], // Listă predefinită de limbi
    type: "multiple", // Permite selecția multiplă
    allowsCustom: true, // Permite adăugarea unei limbi personalizate
    next: 5, // Urmează întrebarea despre necesitatea limbii comune
    consentAfter: true, // Afișează consimțământul după răspuns
    matchRequired: true, // Această întrebare este folosită pentru matching
    compatibility: true, // Această întrebare este folosită pentru matching
  },
  {
    id: 5,
    section: "Sexe",
    text: "Est-il nécessaire que votre rencontre coquine parle la même langue que vous ?",
    options: ["Oui", "Non"],
    type: "single", // Se poate selecta o singură opțiune
    next: 6, // Urmează întrebarea despre consimțământ
    matchRequired: false, // Această întrebare este folosită pentru matching
    compatibility: true, // Această întrebare este folosită pentru matching
  },
  // {
  //   id: 6,
  //   text: "Acceptez-vous que cette information soit partagée avec les profils compatibles ?",
  //   options: ["Oui", "Non"],
  //   type: "single", // Consimțământ simplu
  //   consentFor: [4, 5], // Se referă la întrebările despre limbi și necesitatea limbii comune
  //   next: 7, // Final de secțiune sau urmează o altă întrebare
  // },
  {
    id: 7,
    section: "Sexe",
    text: "Cherchez-vous:",
    options: ["Homme", "Femme", "Couple libertin", "Couple libre"],
    type: "single", // Se poate selecta o singură opțiune
    next: 8, // Urmează întrebarea despre consimțământ
    matchRequired: false, // Această întrebare este folosită pentru matching
    compatibility: true, // Această întrebare este folosită pentru matching
  },
  // {
  //   id: 8,
  //   text: "Acceptez-vous que cette information soit partagée avec les profils compatibles ?",
  //   options: ["Oui", "Non"],
  //   type: "single", // Consimțământ simplu
  //   consentFor: [7], // Se referă la întrebarea despre ce caută utilizatorul
  //   next: 9, // Final de secțiune sau urmează o altă întrebare
  // },
  {
    id: 9,
    section: "Sexe",
    text: "Votre orientation sexuelle est :",
    options: [
      "Hétérosexuel/le",
      "Bisexuel/le",
      "Homosexuel",
      "Transgenre",
      "En questionnement",
      "Aromantique",
      "Pansexuel",
      "Sapiosexuel",
    ],
    type: "single", // Se poate selecta o singură opțiune
    next: 10, // Urmează întrebarea despre consimțământ
    matchRequired: false, // Nu este folosită direct pentru matching
    compatibility: true, // Este folosită pentru compatibilitate
  },
  // {
  //   id: 10,
  //   text: "Acceptez-vous que cette information soit partagée avec les profils compatibles ?",
  //   options: ["Oui", "Non"],
  //   type: "single", // Consimțământ simplu
  //   consentFor: [9], // Se referă la întrebarea despre orientarea sexuală
  //   next: null, // Final de secțiune sau urmează o altă întrebare
  // },
  {
    id: 11,
    text: "Où habitez-vous ?",
    type: "input", // Input pentru cod poștal
    placeholder: "Code postal (Belgique)",
    api: {
      url: "https://api.zippopotam.us/",
      // url: "https://api.zippopotam.us/",
      params: { country: "be" }, // Specificație pentru Belgia
    },
    responseMapping: {
      postalCode: "post code", // Maparea codului poștal
      city: "places[0]['place name']", // Maparea orașului din API
    },
    next: 12, // Urmează întrebarea despre consimțământ
    consentAfter: true, // Afișează consimțământul după răspuns
  },
  // {
  //   id: 12,
  //   text: "Acceptez-vous que cette information soit partagée avec les profils compatibles ?",
  //   options: ["Oui", "Non"],
  //   type: "single", // Consimțământ simplu
  //   consentFor: [11], // Se referă la întrebarea despre orientarea sexuală
  //   next: null, // Final de secțiune sau urmează o altă întrebare
  // },
  {
    id: 13,
    text: "Quelle est votre date de naissance ?",
    type: "input", // Input pentru introducerea datei
    placeholder: "JJ/MM/AAAA",
    validation: {
      type: "date",
      format: "dd/MM/yyyy",
    },
    next: 14, // Urmează întrebarea despre vârsta partenerului ideal
    consentAfter: false,
    matchRequired: false, // Această întrebare este folosită pentru matching
    compatibility: true, // Această întrebare este folosită pentru matching
    compatibilityForOtherQuestion: true, // Această întrebare este folosită pentru matching
  },
  {
    id: 14,
    text: "Quel est la tranche d’âge idéale de votre amant ?",
    type: "range", // Selectarea unui interval de vârstă
    placeholder: { min: "De", max: "À" },
    validation: {
      type: "range",
      min: 18, // Limită minimă de vârstă
      max: 100, // Limită maximă de vârstă
    },
    next: 15, // Urmează următoarea întrebare
    matchWith: [13], // Se face matching între vârsta persoanei și intervalul dorit
    consentAfter: false,
    matchRequired: false, // Această întrebare este folosită pentru matching
    compatibility: true, // Această întrebare este folosită pentru matching
    compatibilityForOtherQuestion: true, // Această întrebare este folosită pentru matching
    qustionForCompatibility: [11],
  },
  {
    id: 15,
    text: "De quelle origine êtes-vous ?",
    options: [
      "Européenne",
      "Asiatique",
      "Arabe",
      "Indienne",
      "Africaine",
      "Latino-américaine",
    ],
    type: "single", // Se poate selecta o singură opțiune
    allowsCustom: true, // Permite adăugarea unei origini personalizate
    next: 16,
    consentAfter: false,
    matchRequired: true, // Această întrebare este folosită pentru matching
    compatibility: true, // Această întrebare este folosită pentru matching
    compatibilityForOtherQuestion: true, // Această întrebare este folosită pentru matching
  },
  {
    id: 17,
    text: "De quelle origine souhaiteriez-vous votre partenaire ?",
    options: [
      "Sans importance",
      "Européenne",
      "Asiatique",
      "Arabe",
      "Indienne",
      "Africaine",
      "Latino-américaine",
    ],
    type: "multiple", // Permite selecția multiplă
    allowsCustom: true, // Permite adăugarea unei origini personalizate
    next: 18, // Urmează următoarea întrebare
    matchWith: [16], // Se face matching între originea persoanei și dorințele exprimate
    consentAfter: false,
    matchRequired: true, // Această întrebare este folosită pentru matching
    compatibility: true, // Această întrebare este folosită pentru matching
    compatibilityForOtherQuestion: true, // Această întrebare este folosită pentru matching
    qustionForCompatibility: [11],
  },
  // {
  //   id: 18,
  //   text: "Acceptez-vous que cette information soit partagée avec les profils compatibles ?",
  //   options: ["Oui", "Non"],
  //   type: "single", // Consimțământ simplu
  //   consentFor: [13, 14, 15, 16, 17], // Se referă la întrebarea despre orientarea sexuală
  //   next: null, // Final de secțiune sau urmează o altă întrebare
  // },
  {
    id: 19,
    text: "Travaillez-vous :",
    options: [
      "De jour, horaire de bureau.",
      "En pause, y compris la nuit.",
      "Uniquement la nuit.",
      "Horaires variable, je peux travailler même le week-end.",
      "Horaires variable, mais jamais le week-end.",
    ],
    type: "multiple", // Permite selecția multiplă
    next: 20,
    compatibility: true, // Această întrebare este folosită pentru matching
    consentAfter: false,
  },
  {
    id: 20,
    text: "Habitez-vous :",
    options: [
      "Seul.",
      "Avec mes parents.",
      "Avec mes enfants tout le temps.",
      "Avec mes enfants une partie du temps.",
      "Colocation.",
      "C’est délicat.",
      "Sans domicile fixe.",
    ],
    type: "single", // Se poate selecta o singură opțiune
    next: 21,
    consentAfter: false,
  },
  {
    id: 21,
    text: "Quel est votre moyen de transport principal :",
    options: [
      "A pieds.",
      "En Vélo",
      "En Moto",
      "En Voiture",
      "En Transport en commun.",
    ],
    type: "single", // Se poate selecta o singură opțiune
    next: 22,
    consentAfter: false,
  },
  {
    id: 22,
    text: "Combien des Km êtes-vous prêt à faire pour aller voir (souvent) votre amant(e) ?",
    options: ["Moins de 10 km.", "Moins de 50 km.", "Moins de 100 km."],
    type: "single", // Se poate selecta o singură opțiune
    next: 22.1, // Urmează întrebarea despre consimțământ
    consentAfter: true,
  },
  {
    id: 22.1,
    text: "Acceptez-vous que ces informations soient partagées avec les profils compatibles ?",
    options: ["Oui", "Non"],
    type: "single", // Consimțământ simplu
    consentFor: [19, 20, 21, 22], // Se aplică pentru întrebările din acest calup
    next: 23,
  },
  {
    id: 23,
    text: "Quelle est votre taille(cm)?",
    type: "range", // Slider pentru selecție
    singleValue: true, // Specifică dacă este un slider cu o singură valoare
    validation: {
      min: 50,
      max: 250,
    },
    next: 24,
    matchRequired: false,
    compatibility: true,
    compatibilityForOtherQuestion: true, // Această întrebare este folosită pentru matching
  },

  {
    id: 24,
    text: "Quel est votre poids(kg)?",
    type: "range", // Schimbat din "input" în "range"
    singleValue: true, // Slider cu o singură valoare
    validation: {
      min: 30, // Greutatea minimă rezonabilă
      max: 300, // Greutatea maximă rezonabilă
    },
    next: 25,
    matchRequired: false,
    compatibility: true,
    compatibilityForOtherQuestion: true, // Această întrebare este folosită pentru matching
  },
  {
    id: 25,
    text: "Avez-vous une préférence concernant la taille et le poids de votre partenaire ?",
    options: ["Oui", "Non"],
    type: "single", // Selecție simplă
    conditionalNext: {
      Oui: 26, // Continuă cu preferințele pentru talie și greutate
      Non: 28, // Sare direct la întrebarea 28
    },
    next: 26,
  },
  {
    id: 26,
    text: "Taille minimum et maximum du partenaire :",
    type: "range", // Interval pentru talie
    placeholder: { min: "Min cm", max: "Max cm" },
    validation: {
      type: "range",
      min: 50,
      max: 250,
    },
    next: 27,
    matchWith: [23], // Match între talia utilizatorului și preferințe
    compatibility: true,
    compatibilityForOtherQuestion: true, // Această întrebare este folosită pentru matching
    qustionForCompatibility: [23],
  },
  {
    id: 27,
    text: "Poids minimum et maximum du partenaire :",
    type: "range", // Interval pentru greutate
    placeholder: { min: "Min kg", max: "Max kg" },
    validation: {
      type: "range",
      min: 30,
      max: 300,
    },
    next: 28,
    matchWith: [24], // Match între greutatea utilizatorului și preferințe
    compatibility: true,
    compatibilityForOtherQuestion: true, // Această întrebare este folosită pentru matching
    qustionForCompatibility: [24],
  },
  {
    id: 28,
    text: "Etes-vous satisfait de votre aspect physique ?",
    options: ["Oui !", "Non", "Je me sens beau/belle parfois, parfois moins."],
    type: "single", // Selecție simplă
    next: 29,
  },
  {
    id: 29,
    text: "Soignez-vous votre aspect physique :",
    options: [
      "Oui, je fais beaucoup d’attention à ça.",
      "Non, je suis comme je suis.",
      "Oui, dans la limite du temps à disposition.",
    ],
    type: "single", // Selecție simplă
    next: 30,
    compatibility: true,
  },
  {
    id: 30,
    section: "Hygiène",
    text: "Quel est votre état d’hygiène ?",
    options: [
      "Impeccable.",
      "Parfois je ne trouve pas le temps de me préparer comme je voudrai.",
      "Il m’a été déjà dit d’avoir une forte transpiration.",
    ],
    type: "single", // Se poate selecta o singură opțiune
    next: 31, // Urmează altă întrebare sau este finalul secțiunii
    matchRequired: false, // Nu este folosită pentru matching
    compatibility: true, // Nu este utilizată pentru compatibilitate
  },
  {
    id: 31,
    text: "Faites-vous du sport ?",
    type: "single",
    options: [
      "Oui, tous les jours",
      "Oui, entre 4 et 5 fois par semaine.",
      "Oui, entre 2 et 3 fois par semaine.",
      "Oui, 1 fois par semaine.",
      "Non",
    ],
    next: 32,
    compatibility: true, // Nu este utilizată pentru compatibilitate
  },
  {
    id: 32,
    text: "Avez-vous une maladie ou un handicap qui pourrait avoir un impact sur vos recontres ?",
    type: "single",
    options: ["Oui", "Non"],
    next: 33,
    compatibility: true,
  },
  {
    id: 33,
    text: "Acceptez-vous que ces informations soient partagées avec les profils compatibles ?",
    type: "single",
    options: ["Oui", "Non"],
    next: 34,
  },
  // Assuétudes
  {
    id: 34,
    section: "Habitudes",
    text: "Tabac :",
    options: ["Oui", "Non"],
    type: "single", // Se poate selecta o singură opțiune
    next: 35, // Dacă răspunsul este "Oui", continuă cu următoarea întrebare
    conditionalNext: {
      Oui: 35, // Continuă dacă utilizatorul fumează
      Non: 36, // Sare la următoarea întrebare dacă nu fumează
    },
  },
  {
    id: 35,
    section: "Habitudes",
    text: "Si Oui :",
    options: ["Tous les jours", "Occasionnellement", "Rarement"],
    type: "single", // Se poate selecta o singură opțiune
    next: 36, // Urmează întrebarea despre alcool
  },
  {
    id: 36,
    section: "Habitudes",
    text: "Alcool :",
    options: ["Oui", "Non"],
    type: "single", // Se poate selecta o singură opțiune
    next: 37,
    conditionalNext: {
      Oui: 37, // Continuă dacă utilizatorul consumă alcool
      Non: 40, // Sare la întrebarea despre cafea dacă nu consumă alcool
    },
  },
  {
    id: 37,
    section: "Habitudes",
    text: "Si Oui :",
    options: ["Tous les jours", "Occasionnellement", "Rarement"],
    type: "single",
    next: 38,
  },
  {
    id: 38,
    section: "Habitudes",
    text: "Quel type d’alcool consommez-vous le plus ?",
    options: ["Bière", "Vin", "Spiritueux et Cocktails"],
    type: "single",
    next: 40,
  },
  {
    id: 40,
    section: "Habitudes",
    text: "Café :",
    options: ["Oui", "Non"],
    type: "single",
    next: 41,
    conditionalNext: {
      Oui: 41, // Continuă dacă utilizatorul consumă cafea
      Non: 43, // Sare la întrebarea despre ceai dacă nu consumă cafea
    },
  },
  {
    id: 41,
    section: "Habitudes",
    text: "Si Oui :",
    options: ["Tous les jours", "Occasionnellement", "Rarement"],
    type: "single",
    next: 43,
  },
  {
    id: 43,
    section: "Habitudes",
    text: "Thé :",
    options: ["Oui", "Non"],
    type: "single",
    next: 44,
    conditionalNext: {
      Oui: 44,
      Non: 46,
    },
  },
  {
    id: 44,
    section: "Habitudes",
    text: "Si Oui :",
    options: ["Tous les jours", "Occasionnellement", "Rarement"],
    type: "single",
    next: 46,
  },
  {
    id: 46,
    section: "Habitudes",
    text: "Boissons sucrées :",
    options: ["Oui", "Non"],
    type: "single",
    next: 47,
    conditionalNext: {
      Oui: 47,
      Non: 49,
    },
  },
  {
    id: 47,
    section: "Habitudes",
    text: "Si Oui :",
    options: ["Tous les jours", "Occasionnellement", "Rarement"],
    type: "single",
    next: 49,
  },
  {
    id: 49,
    section: "Habitudes",
    text: "Boissons énergétiques :",
    options: ["Oui", "Non"],
    type: "single",
    next: 50,
    conditionalNext: {
      Oui: 50,
      Non: 52,
    },
  },
  {
    id: 50,
    section: "Habitudes",
    text: "Si Oui :",
    options: ["Tous les jours", "Occasionnellement", "Rarement"],
    type: "single",
    next: 52,
  },
  {
    id: 52,
    section: "Habitudes",
    text: "Acceptez-vous que ces informations soient partagées avec les profils compatibles ?",
    options: ["Oui", "Non"],
    type: "single",
    consentFor: [34, 36, 40, 43, 46, 49], // Se referă la întrebările despre obiceiuri
    next: 53, // Este ultima întrebare din acest calup
  },

  //Premier Rendez-vous//
  {
    id: 53,
    text: "Avez-vous besoin d’un échange avec l’autre avant de passer à l’acte (rencontre informelle) ?",
    options: ["Oui", "Non"],
    type: "single",
    next: 54,
    matchRequired: false,
    compatibility: true,
  },
  {
    id: 54,
    text: "Un profil intéressant vous propose de vous voir demain soir, mais votre soirée est déjà prise :",
    options: [
      "J’annule ma soirée et j’accepte le rendez-vous proposé.",
      "Je décline l’invitation.",
      "Je décline l’invitation en lui proposant un autre moment.",
    ],
    type: "single",
    next: 55,
    matchRequired: false,
    compatibility: true,
  },
  {
    id: 55,
    text: "Compte tenu de vos activités professionnelles/familiales/personnelles, combien de jours par semaine êtes-vous disponible pour un rendez-vous ?",
    options: [
      "Tous les jours.",
      "Moins que 5 jours par semaine.",
      "Moins que 3 jours par semaine.",
      "Moins qu’un jour par semaine.",
      "Uniquement les week-ends.",
      "Une fois chaque 2 semaines.",
      "En fonction de la garde parentale.",
    ],
    type: "single",
    next: 56,
    matchRequired: false,
    compatibility: true,
  },
  {
    id: 56,
    text: "Qui paye l’addition au premier rendez-vous, si applicable ?",
    options: [
      "Moi, mais j’apprécie que l’autre se propose.",
      "L’autre.",
      "On partage.",
      "On partage, mais j’apprécie la galanterie.",
    ],
    type: "single",
    next: 57,
    matchRequired: false,
    compatibility: false,
  },
  {
    id: 57,
    text: "Etes-vous ponctuel/le ?",
    options: ["Oui", "Non"],
    type: "single",
    next: 58,
    matchRequired: false,
    compatibility: true,
  },
  {
    id: 58,
    text: "Etes-vous plutôt à l’écoute des besoins de l’autre ?",
    options: ["Oui", "Non"],
    type: "single",
    next: 59,
    matchRequired: false,
    compatibility: true,
  },
  {
    id: 59,
    text: "Etes-vous de nature pudique ?",
    options: ["Oui", "Non"],
    type: "single",
    next: 60,
    matchRequired: false,
    compatibility: false,
  },
  {
    id: 60,
    text: "Le statut de l’autre personne pourrait-il vous impressionner ?",
    options: ["Oui", "Non"],
    type: "single",
    next: 61,
    matchRequired: false,
    compatibility: false,
  },
  {
    id: 61,
    text: "Le lieu d’intimité avec l’autre lors d’un premier rendez-vous pourrait être :",
    options: [
      "Chez moi.",
      "Chez l’autre.",
      "Dans la voiture.",
      "A l’Hôtel.",
      "Dans un lieu insolite.",
    ],
    type: "multiple",
    next: 62,
    matchRequired: false,
    compatibility: false,
  },
  {
    id: 62,
    text: "Après un premier rendez-vous, aimeriez-vous avoir un feedback de la part de l’autre sur son ressenti ?",
    options: ["Oui", "Non"],
    type: "single",
    next: 63,
    matchRequired: false,
    compatibility: true,
  },
  {
    id: 63,
    text: "Est-il important pour vous d’avoir un échange (sms/appel) entre le premier et le second rendez-vous ?",
    options: ["Oui", "Non"],
    type: "single",
    next: 64,
    matchRequired: false,
    compatibility: true,
  },
  {
    id: 64,
    text: "L’autre annule le rendez-vous à la dernière minute, comment vous vous comportez ?",
    options: [
      "Ça dépend de la raison.",
      "Au suivant.",
      "Je suis déçu et j’exprime mon ressenti.",
    ],
    type: "single",
    next: 65,
    matchRequired: false,
  },
  {
    id: 65,
    text: "Quelle serait la fréquence sexuelle adaptée à vous ?",
    options: [
      "Plusieurs fois par jour.",
      "Quotidienne.",
      "Plusieurs fois par semaine.",
      "Hebdomadaire.",
      "Quelques fois par mois.",
      "Je suis asexuel.",
    ],
    type: "single",
    next: 66,
    matchRequired: false,
    compatibility: true,
  },
  {
    id: 66,
    text: "Quelle est pour vous la place de la tendresse dans l’échange ?",
    options: [
      "Plus importante que le sexe.",
      "Aussi importante que le sexe.",
      "Importante, sans plus.",
      "Pas importante.",
    ],
    type: "single",
    next: 67,
    matchRequired: false,
    compatibility: true,
  },
  {
    id: 67,
    text: "Avez-vous déjà eu une relation sexuelle sans lendemain ?",
    options: ["Oui", "Non"],
    type: "single",
    next: 68,
    matchRequired: false,
  },
  {
    id: 68,
    text: "Avez-vous eu déjà des rapports sexuels avec plus d’une personne en même temps ?",
    options: ["Oui", "Non"],
    type: "single",
    next: 69,
    matchRequired: false,
  },
  {
    id: 69,
    text: "Avez-vous déjà eu un rapport sexuel avec une personne du même sexe que vous ?",
    options: ["Oui", "Non"],
    type: "single",
    next: 70,
    matchRequired: false,
  },
  {
    id: 70,
    text: "Faites-vous des dépistages sanguins concernant les maladies sexuellement transmissibles ?",
    options: ["Oui", "Non"],
    type: "single",
    next: 71,
    matchRequired: false,
  },
  {
    id: 71,
    text: "Déclarez-vous d’avoir une maladie sexuellement transmissible ou toute condition pouvant avoir un rapport avec les rencontres que vous allez faire ?",
    options: ["Oui", "Non"],
    type: "single",
    next: 72,
    matchRequired: false,
    compatibility: true,
  },
  {
    id: 72,
    text: "Utilisez-vous le préservatif à chaque rencontre coquine ?",
    options: ["Oui", "Non"],
    type: "single",
    next: 73,
    matchRequired: false,
    compatibility: true,
  },
  {
    id: 73,
    text: "Si votre partenaire vous demande l’utilisation du préservatif, acceptez-vous ?",
    options: ["Oui", "Non"],
    type: "single",
    conditionalNext: {
      Oui: 74,
      Non: 75,
    },
    next: 75,
    matchRequired: false,
    compatibility: true,
  },
  {
    id: 74,
    text: "Si Oui, pour quelle pratique ?",
    options: [
      "Linga masturbation",
      "Oral",
      "Vaginale",
      "Anal",
      "Je ne pratique pas",
    ],
    type: "multiple",
    next: 75,
    matchRequired: false,
  },
  {
    id: 75,
    text: "Etes-vous intéressé au plaisir de l’autre ?",
    options: ["Oui", "Non"],
    type: "single",
    next: 76,
    matchRequired: false,
    compatibility: true,
  },
  {
    id: 76,
    text: "Si absence d’orgasme, seriez-vous déçu ?",
    options: ["Oui", "Non"],
    type: "single",
    next: 77,
    matchRequired: false,
    compatibility: true,
  },
  {
    id: 77,
    text: "Sentez-vous de manquer d’expérience en matière sexuelle ?",
    options: ["Oui", "Non"],
    type: "single",
    next: 78,
    matchRequired: false,
    compatibility: false,
  },
  {
    id: 78,
    text: "Accepteriez-vous un partenaire qui manque d’expérience sexuelle ?",
    options: ["Oui", "Non"],
    type: "single",
    next: 79,
    matchRequired: false,
    compatibility: false,
  },
  {
    id: 79,
    text: "Acceptez-vous que ces informations soient partagées avec les profils compatibles ?",
    options: ["Oui", "Non"],
    type: "single",
    consentFor: [
      53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70,
      71, 72, 73, 74, 75, 76, 77, 78,
    ],
    next: 56,
  },

  {
    id: 56,
    text: "Lors de la rencontre pratiquez/utilisez-vous :",
    options: [
      "Préservatif",
      "Anneau pénien",
      "Boules de geisha",
      "Huiles comestibles",
      "Huiles de massage",
      "Chapelet thaï",
      "Électrostimulation érotique",
      "Fleshlight",
      "Fucking machine",
      "Gode ceinture",
      "Godemichet",
      "Œuf vibrant",
      "Orgasmotron",
      "Plug anal",
      "Pompe sexuelle",
      "Poppers",
      "Poupée moulée",
      "Poupée sexuelle",
      "Robot sexuel",
      "Siège d'amour",
      "Télédildonique",
      "Tenga (jouet sexuel)",
      "Vagin artificiel",
      "Vibromasseur",
      "Candaulisme",
      "Domination masculine",
      "Domination féminine",
      "Le voyeurisme",
      "Le triolisme",
      "Le côte-à-côtisme",
      "Libre.",
      "Bandage",
      "Sodomie",
      "Masochisme",
      "Fétichisme",
      "Femme fontaine",
      "Switch",
      "Kinky",
      "Sex-Vanille",
      "Masturbation",
      "Pénétration anale",
      "Pénétration vaginale",
      "Kamasutra",
      "Fellation",
      "Cunnilingus",
      "Anulingus",
    ],
    type: "multiple", // Permite selecția multiplă
    next: 57,
    matchRequired: false,
    compatibility: false,
  },

  //Asta e identic pe toate cele 3 subiecte//
  {
    personaliteStart: true,
    id: 57,
    text: "Je me sens tendu(e) ou énervé(e)",
    options: ["Oui", "Non"],
    personalitate: true,
    type: "single",
    next: 58,
    matchRequired: false,
    compatibility: false,
    categoriePersonalitate: "CATEGORIA A",
  },
  {
    id: 58,
    text: "J’ai une sensation de peur comme si quelque chose d’horrible allait m’arriver",
    options: ["Oui", "Non"],
    personalitate: true,
    type: "single",
    next: 59,
    matchRequired: false,
    compatibility: false,
    categoriePersonalitate: "CATEGORIA A",
  },
  {
    id: 59,
    text: "Je ris facilement et vois le bon côté des choses",
    options: ["Oui", "Non"],
    personalitate: true,
    type: "single",
    next: 60,
    matchRequired: false,
    compatibility: false,
    categoriePersonalitate: "CATEGORIA F",
  },
  {
    id: 60,
    text: "Je suis de bonne humeur",
    options: ["Oui", "Non"],
    personalitate: true,
    type: "single",
    next: 61,
    matchRequired: false,
    compatibility: false,
    categoriePersonalitate: "CATEGORIA F",
  },
  {
    id: 61,
    text: "Je peux rester tranquillement assis(e) à ne rien faire et me sentir décontracté(e)",
    options: ["Oui", "Non"],
    personalitate: true,
    type: "single",
    next: 62,
    matchRequired: false,
    compatibility: false,
    categoriePersonalitate: "CATEGORIA F",
  },
  {
    id: 62,
    text: "J’ai l’impression de fonctionner au ralenti",
    options: ["Oui", "Non"],
    personalitate: true,
    type: "single",
    next: 63,
    matchRequired: false,
    compatibility: false,
    categoriePersonalitate: "CATEGORIA B",
  },
  {
    id: 63,
    text: "J’éprouve des sensations de peur et j’ai l’estomac noué",
    options: ["Oui", "Non"],
    personalitate: true,
    type: "single",
    next: 64,
    matchRequired: false,
    compatibility: false,
    categoriePersonalitate: "CATEGORIA A",
  },
  {
    id: 64,
    text: "Je fais attention à mon apparence",
    options: ["Oui", "Non"],
    personalitate: true,
    type: "single",
    next: 65,
    matchRequired: false,
    compatibility: false,
    categoriePersonalitate: "CATEGORIA F",
  },
  {
    id: 65,
    text: "J’ai la bougeotte et n’arrive pas à tenir en place",
    options: ["Oui", "Non"],
    personalitate: true,
    type: "single",
    next: 66,
    matchRequired: false,
    compatibility: false,
    categoriePersonalitate: "CATEGORIA C",
  },
  {
    id: 66,
    text: "Je me réjouis d’avance à l’idée de faire certaines choses",
    options: ["Oui", "Non"],
    personalitate: true,
    type: "single",
    next: 67,
    matchRequired: false,
    compatibility: false,
    categoriePersonalitate: "CATEGORIA F",
  },
  {
    id: 67,
    text: "J’éprouve des sensations soudaines de panique",
    options: ["Oui", "Non"],
    personalitate: true,
    type: "single",
    next: 68,
    matchRequired: false,
    compatibility: false,
    categoriePersonalitate: "CATEGORIA A",
  },
  {
    id: 68,
    text: "Je fais/Je dis les choses sans y penser",
    options: ["Oui", "Non"],
    personalitate: true,
    type: "single",
    next: 69,
    matchRequired: false,
    compatibility: false,
    categoriePersonalitate: "CATEGORIA C",
  },
  {
    id: 69,
    text: "J'ai des idées qui fusent",
    options: ["Oui", "Non"],
    personalitate: true,
    type: "single",
    next: 70,
    matchRequired: false,
    compatibility: false,
    categoriePersonalitate: "CATEGORIA C",
  },
  {
    id: 70,
    text: "Je projette mes voyages longtemps à l'avance",
    options: ["Oui", "Non"],
    personalitate: true,
    type: "single",
    next: 71,
    matchRequired: false,
    compatibility: false,
    categoriePersonalitate: "CATEGORIA A",
  },
  {
    id: 71,
    text: "Je suis maître de moi",
    options: ["Oui", "Non"],
    personalitate: true,
    type: "single",
    next: 72,
    matchRequired: false,
    compatibility: false,
    categoriePersonalitate: "CATEGORIA F",
  },
  {
    id: 72,
    text: "Je me concentre facilement",
    options: ["Oui", "Non"],
    personalitate: true,
    type: "single",
    next: 73,
    matchRequired: false,
    compatibility: false,
    categoriePersonalitate: "CATEGORIA F",
  },
  {
    id: 73,
    text: "J'ai la bougeotte au spectacle ou aux conférences",
    options: ["Oui", "Non"],
    personalitate: true,
    type: "single",
    next: 74,
    matchRequired: false,
    compatibility: false,
    categoriePersonalitate: "CATEGORIA C",
  },
  {
    id: 74,
    text: "Je veille à ma sécurité d'emploi",
    options: ["Oui", "Non"],
    personalitate: true,
    type: "single",
    next: 75,
    matchRequired: false,
    compatibility: false,
    categoriePersonalitate: "CATEGORIA A",
  },
  {
    id: 75,
    text: "J'aime réfléchir à des problèmes complexes",
    options: ["Oui", "Non"],
    personalitate: true,
    type: "single",
    next: 76,
    matchRequired: false,
    compatibility: false,
    categoriePersonalitate: "CATEGORIA D",
  },
  {
    id: 76,
    text: "J'ai peur sans aucune raison",
    options: ["Oui", "Non"],
    personalitate: true,
    type: "single",
    next: null,
    matchRequired: false,
    compatibility: false,
    categoriePersonalitate: "CATEGORIA A",
  },

  {
    id: 77,
    text: 'J\'agis sur un "coup de tête"',
    options: ["Oui", "Non"],
    personalitate: true,
    type: "single",
    next: 78,
    matchRequired: false,
    compatibility: false,
  },
  {
    id: 78,
    text: "Je parle vite",
    options: ["Oui", "Non"],
    personalitate: true,
    type: "single",
    next: 79,
    matchRequired: false,
    compatibility: false,
    categoriePersonalitate: "CATEGORIA A",
  },
  {
    id: 79,
    text: "J’aime les rendez-vous romantiques traditionnels",
    options: ["Oui", "Non"],
    personalitate: true,
    type: "single",
    next: 80,
    matchRequired: false,
    compatibility: false,
    categoriePersonalitate: "CATEGORIA D",
  },
  {
    id: 80,
    text: "Je suis rapidement impatient(e) et irrité(e) si je ne trouve pas une solution à un problème",
    options: ["Oui", "Non"],
    personalitate: true,
    type: "single",
    next: 81,
    matchRequired: false,
    compatibility: false,
    categoriePersonalitate: "CATEGORIA D",
  },
  {
    id: 81,
    text: "Il m’a été déjà dit que j’ai une drôle d’allure ou de démarche",
    options: ["Oui", "Non"],
    personalitate: true,
    type: "single",
    next: 82,
    matchRequired: false,
    compatibility: false,
    categoriePersonalitate: "CATEGORIA D",
  },
  {
    id: 82,
    text: "Je trouve difficile d'apprendre des choses pour lesquelles je ne suis pas intéressé(e)",
    options: ["Oui", "Non"],
    personalitate: true,
    type: "single",
    next: 83,
    matchRequired: false,
    compatibility: false,
    categoriePersonalitate: "CATEGORIA D",
  },
  {
    id: 83,
    text: "J’ai des habitudes difficiles à interrompre",
    options: ["Oui", "Non"],
    personalitate: true,
    type: "single",
    next: 84,
    matchRequired: false,
    compatibility: false,
    categoriePersonalitate: "CATEGORIA D",
  },
  {
    id: 84,
    text: "Si je suis interrompu(e), je ne peux pas revenir rapidement à ce que je faisais avant",
    options: ["Oui", "Non"],
    personalitate: true,
    type: "single",
    next: 85,
    matchRequired: false,
    compatibility: false,
    categoriePersonalitate: "CATEGORIA D",
  },
  {
    id: 85,
    text: "Je trouve facile de décrire mes sentiments",
    options: ["Oui", "Non"],
    personalitate: true,
    type: "single",
    next: 86,
    matchRequired: false,
    compatibility: false,
    categoriePersonalitate: "CATEGORIA F",
  },
  {
    id: 86,
    text: "J’ai un besoin intense d'observer les habitudes des humains et/ ou des animaux",
    options: ["Oui", "Non"],
    personalitate: true,
    type: "single",
    next: 87,
    matchRequired: false,
    compatibility: false,
    categoriePersonalitate: "CATEGORIA D",
  },
  {
    id: 87,
    text: "J’ai la tendance à être tellement absorbé(e) par mes intérêts spécifiques que j’oublie tout le reste",
    options: ["Oui", "Non"],
    personalitate: true,
    type: "single",
    next: 88,
    matchRequired: false,
    compatibility: false,
    categoriePersonalitate: "CATEGORIA D",
  },
  {
    id: 88,
    text: "Je suis jaloux(se) en couple",
    options: ["Oui", "Non"],
    personalitate: true,
    type: "single",
    next: 89,
    matchRequired: false,
    compatibility: false,
    categoriePersonalitate: "CATEGORIA A",
  },
  {
    id: 89,
    text: "J’ai été accusé d’avoir un regard fixe ou de regarder fixement",
    options: ["Oui", "Non"],
    personalitate: true,
    type: "single",
    next: 90,
    matchRequired: false,
    compatibility: false,
    categoriePersonalitate: "CATEGORIA D",
  },
  {
    id: 90,
    text: "Je suis bon(ne) dans l'interprétation des expressions du visage",
    options: ["Oui", "Non"],
    personalitate: true,
    type: "single",
    next: 91,
    matchRequired: false,
    compatibility: false,
    categoriePersonalitate: "CATEGORIA F",
  },
  {
    id: 91,
    text: "Je suis fidèle",
    options: ["Oui", "Non"],
    personalitate: true,
    type: "single",
    next: 92,
    matchRequired: false,
    compatibility: false,
    categoriePersonalitate: "CATEGORIA F",
  },
  {
    id: 92,
    text: "J’ai besoin de beaucoup de motivation pour faire les choses",
    options: ["Oui", "Non"],
    personalitate: true,
    type: "single",
    next: 93,
    matchRequired: false,
    compatibility: false,
    categoriePersonalitate: "CATEGORIA B",
  },
  {
    id: 93,
    text: "J’aime les voyages",
    options: ["Oui", "Non"],
    personalitate: true,
    type: "single",
    next: 94,
    matchRequired: false,
    compatibility: false,
    categoriePersonalitate: "CATEGORIA F",
  },
  {
    id: 94,
    text: "J’ai tendance à interpréter les choses littéralement",
    options: ["Oui", "Non"],
    personalitate: true,
    type: "single",
    next: 95,
    matchRequired: false,
    compatibility: false,
    categoriePersonalitate: "CATEGORIA D",
  },
  {
    id: 95,
    text: "Je me sens souvent triste",
    options: ["Oui", "Non"],
    personalitate: true,
    type: "single",
    next: 96,
    matchRequired: false,
    compatibility: false,
    categoriePersonalitate: "CATEGORIA B",
  },
  {
    id: 96,
    text: "Je crois avoir connu plus d’échecs que le reste des gens",
    options: ["Oui", "Non"],
    personalitate: true,
    type: "single",
    next: null,
    matchRequired: false,
    compatibility: false,
    categoriePersonalitate: "CATEGORIA B",
  },
  {
    id: 97,
    text: "Mon sommeil est perturbé",
    options: ["Oui", "Non"],
    personalitate: true,
    type: "single",
    next: 98,
    matchRequired: false,
    compatibility: false,
    categoriePersonalitate: "CATEGORIA B",
  },
  {
    id: 98,
    text: "Je suis capable de me détendre.",
    options: ["Oui", "Non"],
    personalitate: true,
    type: "single",
    next: 99,
    matchRequired: false,
    compatibility: false,
    categoriePersonalitate: "CATEGORIA F",
  },
  {
    id: 99,
    text: "Je suis timide",
    options: ["Oui", "Non"],
    personalitate: true,
    type: "single",
    next: 100,
    matchRequired: false,
    compatibility: false,
    categoriePersonalitate: "CATEGORIA D",
  },
  {
    id: 100,
    text: "Je me sens à l'aise avec le travail d'équipe",
    options: ["Oui", "Non"],
    personalitate: true,
    type: "single",
    next: 101,
    matchRequired: false,
    compatibility: false,
    categoriePersonalitate: "CATEGORIA F",
  },
  {
    id: 101,
    text: "J’ai la tendance à me sentir coupable",
    options: ["Oui", "Non"],
    personalitate: true,
    type: "single",
    next: 102,
    matchRequired: false,
    compatibility: false,
    categoriePersonalitate: "CATEGORIA B",
  },
  {
    id: 102,
    text: "Je suis fier (fière) de moi-même",
    options: ["Oui", "Non"],
    personalitate: true,
    type: "single",
    next: 103,
    matchRequired: false,
    compatibility: false,
    categoriePersonalitate: "CATEGORIA F",
  },
  {
    id: 103,
    text: "Je me critique beaucoup",
    options: ["Oui", "Non"],
    personalitate: true,
    type: "single",
    next: 104,
    matchRequired: false,
    compatibility: false,
    categoriePersonalitate: "CATEGORIA B",
  },
  {
    id: 104,
    text: "Je me soucie de ce que les gens pensent de moi",
    options: ["Oui", "Non"],
    personalitate: true,
    type: "single",
    next: 105,
    matchRequired: false,
    compatibility: false,
    categoriePersonalitate: "CATEGORIA A",
  },
  {
    id: 105,
    text: "Je suis fier (fière) de mon apparence",
    options: ["Oui", "Non"],
    personalitate: true,
    type: "single",
    next: 106,
    matchRequired: false,
    compatibility: false,
    categoriePersonalitate: "CATEGORIA F",
  },
  {
    id: 106,
    text: "J’aime les grandes manifestations, même s'il y a foule",
    options: ["Oui", "Non"],
    personalitate: true,
    type: "single",
    next: 107,
    matchRequired: false,
    compatibility: false,
    categoriePersonalitate: "CATEGORIA F",
  },
  {
    id: 107,
    text: "J’ai des problèmes pour trouver mon chemin vers de nouveaux lieux",
    options: ["Oui", "Non"],
    personalitate: true,
    type: "single",
    next: 108,
    matchRequired: false,
    compatibility: false,
    categoriePersonalitate: "CATEGORIA D",
  },
  {
    id: 108,
    text: "J’ai déjà pensé à me tuer",
    options: ["Oui", "Non"],
    personalitate: true,
    type: "single",
    next: 109,
    matchRequired: false,
    compatibility: false,
    categoriePersonalitate: "CATEGORIA B",
  },
  {
    id: 109,
    text: "Je suis sensible lorsque je regarde les films",
    options: ["Oui", "Non"],
    personalitate: true,
    type: "single",
    next: 110,
    matchRequired: false,
    compatibility: false,
    categoriePersonalitate: "CATEGORIA D",
  },
  {
    id: 110,
    text: "J’ai un bon équilibre entre le travail, les loisirs et le repos",
    options: ["Oui", "Non"],
    personalitate: true,
    type: "single",
    next: 111,
    matchRequired: false,
    compatibility: false,
    categoriePersonalitate: "CATEGORIA F",
  },
  {
    id: 111,
    text: "J’ai déjà vécu des pressions importantes au travail",
    options: ["Oui", "Non"],
    personalitate: true,
    type: "single",
    next: 112,
    matchRequired: false,
    compatibility: false,
    categoriePersonalitate: "CATEGORIA B",
  },
  {
    id: 112,
    text: "Je pleure souvent",
    options: ["Oui", "Non"],
    personalitate: true,
    type: "single",
    next: 113,
    matchRequired: false,
    compatibility: false,
    categoriePersonalitate: "CATEGORIA B",
  },
  {
    id: 113,
    text: "Je suis irritable au volant",
    options: ["Oui", "Non"],
    personalitate: true,
    type: "single",
    next: 114,
    matchRequired: false,
    compatibility: false,
    categoriePersonalitate: "CATEGORIA B",
  },
  {
    id: 114,
    text: "J’ai du mal à reconnaitre mes responsabilités",
    options: ["Oui", "Non"],
    personalitate: true,
    type: "single",
    next: 115,
    matchRequired: false,
    compatibility: false,
    categoriePersonalitate: "CATEGORIA B",
  },
  {
    id: 115,
    text: "Je remets les décisions au lendemain (procrastination)",
    options: ["Oui", "Non"],
    personalitate: true,
    type: "single",
    next: 116,
    matchRequired: false,
    compatibility: false,
  },
  {
    id: 116,
    text: "Je me trouve attrayant(e)",
    options: ["Oui", "Non"],
    personalitate: true,
    type: "single",
    next: null,
    matchRequired: false,
    compatibility: false,
    categoriePersonalitate: "CATEGORIA F",
  },
  {
    id: 117,
    text: "J’ai des problèmes liés au temps dans les conversations",
    options: ["Oui", "Non"],
    personalitate: true,
    type: "single",
    next: 118,
    matchRequired: false,
    compatibility: false,
    categoriePersonalitate: "CATEGORIA D",
  },
  {
    id: 118,
    text: "Je collectionne des objets",
    options: ["Oui", "Non"],
    personalitate: true,
    type: "single",
    next: 119,
    matchRequired: false,
    compatibility: false,
    categoriePersonalitate: "CATEGORIA D",
  },
  {
    id: 119,
    text: "Mon travail me demande beaucoup d’effort",
    options: ["Oui", "Non"],
    personalitate: true,
    type: "single",
    next: 120,
    matchRequired: false,
    compatibility: false,
    categoriePersonalitate: "CATEGORIA B",
  },
  {
    id: 120,
    text: "Je me sens souvent fatigué(e)",
    options: ["Oui", "Non"],
    personalitate: true,
    type: "single",
    next: 121,
    matchRequired: false,
    compatibility: false,
    categoriePersonalitate: "CATEGORIA B",
  },
  {
    id: 121,
    text: "Si je suis irritable j’ai la tendance à manger moins",
    options: ["Oui", "Non"],
    personalitate: true,
    type: "single",
    next: 122,
    matchRequired: false,
    compatibility: false,
    categoriePersonalitate: "CATEGORIA G",
  },
  {
    id: 122,
    text: "Si je suis irritable j’ai la tendance à manger plus",
    options: ["Oui", "Non"],
    personalitate: true,
    type: "single",
    next: 123,
    matchRequired: false,
    compatibility: false,
    categoriePersonalitate: "CATEGORIA G",
  },
  {
    id: 123,
    text: "Je m’identifie à toutes les pathologies que je lis sur internet",
    options: ["Oui", "Non"],
    personalitate: true,
    type: "single",
    next: 124,
    matchRequired: false,
    compatibility: false,
  },
  {
    id: 124,
    text: "J’ai un humour noir",
    options: ["Oui", "Non"],
    personalitate: true,
    type: "single",
    next: 125,
    matchRequired: false,
    compatibility: false,
    categoriePersonalitate: "CATEGORIA F",
  },
  {
    id: 125,
    text: "Je suis mal à l’aise face à des personnes qui ont une communication ironique.",
    options: ["Oui", "Non"],
    personalitate: true,
    type: "single",
    next: 126,
    matchRequired: false,
    compatibility: false,
    categoriePersonalitate: "CATEGORIA D",
  },
  {
    id: 126,
    text: "Je suis gêné(e) par les étiquettes des vêtements",
    options: ["Oui", "Non"],
    personalitate: true,
    type: "single",
    next: 127,
    matchRequired: false,
    compatibility: false,
    categoriePersonalitate: "CATEGORIA D",
  },
  {
    id: 127,
    text: "J’accepte facilement les critiques",
    options: ["Oui", "Non"],
    personalitate: true,
    type: "single",
    next: 128,
    matchRequired: false,
    compatibility: false,
    categoriePersonalitate: "CATEGORIA F",
  },
  {
    id: 128,
    text: "Je m’adapte facilement à une situation",
    options: ["Oui", "Non"],
    personalitate: true,
    type: "single",
    next: 129,
    matchRequired: false,
    compatibility: false,
    categoriePersonalitate: "CATEGORIA F",
  },
  {
    id: 129,
    text: "L’arrivée dans un nouveau travail m’angoisse",
    options: ["Oui", "Non"],
    personalitate: true,
    type: "single",
    next: 130,
    matchRequired: false,
    compatibility: false,
    categoriePersonalitate: "CATEGORIA A",
  },
  {
    id: 130,
    text: "J’aime le contact de l’autre",
    options: ["Oui", "Non"],
    personalitate: true,
    type: "single",
    next: 131,
    matchRequired: false,
    compatibility: false,
    categoriePersonalitate: "CATEGORIA F",
  },
  {
    id: 131,
    text: "J’ai des difficultés à parler en public",
    options: ["Oui", "Non"],
    personalitate: true,
    type: "single",
    next: 132,
    matchRequired: false,
    compatibility: false,
  },
  {
    id: 132,
    text: "J’ai été victime d'un abus sexuel/maltraitance",
    options: ["Oui", "Non"],
    personalitate: true,
    type: "single",
    next: null,
    matchRequired: false,
    compatibility: false,
    categoriePersonalitate: "CATEGORIA B",
  },
];

export const questionsSet3 = [
  {
    id: 1,
    section: "Amitie",
    text: "Etes-vous:",
    options: ["Homme", "Femme", "Non-binaire"],
    type: "single", // Se poate selecta o singură opțiune
    next: 2, // Urmează întrebarea despre consimțământ
    consentAfter: true, // Afișează consimțământul după răspuns
    matchRequired: false, // Această întrebare este folosită pentru matching
    compatibility: true, // Această întrebare este folosită pentru matching
  },
  // {
  //   id: 2,
  //   text: "Acceptez-vous que cette information soit partagée avec les profils compatibles ?",
  //   options: ["Oui", "Non"],
  //   type: "single", // Consimțământ simplu
  //   consentFor: [1], // Se referă la întrebarea 1
  //   next: 3, // Urmează următoarea întrebare din secțiune
  // },
  {
    id: 3,
    text: "Langues parlées :",
    options: [
      "Français",
      "Anglais",
      "Espagnol",
      "Allemand",
      "Italien",
      "Chinois",
      "Japonais",
    ], // Listă predefinită de limbi
    type: "multiple", // Permite selecția multiplă
    allowsCustom: true, // Permite adăugarea unei limbi personalizate
    next: 4, // Urmează întrebarea despre consimțământ
    consentAfter: true, // Afișează consimțământul după răspuns
    matchRequired: false, // Această întrebare este folosită pentru matching
    compatibility: true, // Această întrebare este folosită pentru matching
  },
  // {
  //   id: 4,
  //   text: "Acceptez-vous que cette information soit partagée avec les profils compatibles ?",
  //   options: ["Oui", "Non"],
  //   type: "single", // Consimțământ simplu
  //   consentFor: [3], // Se referă la întrebarea 3
  //   next: 5, // Urmează următoarea întrebare din secțiune
  // },
  {
    id: 5,
    text: "Où habitez-vous ?",
    type: "input", // Input pentru cod poștal
    placeholder: "Code postal (Belgique)",
    api: {
      url: "https://api.zippopotam.us/",
      // url: "https://api.zippopotam.us/",
      params: { country: "be" }, // Specificație pentru Belgia
    },
    responseMapping: {
      postalCode: "post code", // Maparea codului poștal
      city: "places[0]['place name']", // Maparea orașului din API
    },
    next: 6, // Urmează întrebarea despre consimțământ
    consentAfter: true, // Afișează consimțământul după răspuns
  },
  {
    id: 6,
    text: "Quelle est votre date de naissance ?",
    type: "input", // Input pentru introducerea datei
    placeholder: "JJ/MM/AAAA",
    validation: { type: "date", format: "dd/MM/yyyy" }, // Validare pentru formatul datei
    next: 7, // Urmează întrebarea despre intervalul de vârstă
    consentAfter: false, // Nu este necesar consimțământul imediat
    matchRequired: false, // Această întrebare este folosită pentru matching
    compatibility: true, // Această întrebare este folosită pentru compatibilitate
    compatibilityForOtherQuestion: true, // Această întrebare este folosită pentru matching
  },
  {
    id: 7,
    text: "Dans quelle tranche d’âge pouvons-nous vous proposer des amis ?",
    type: "range", // Selecția unui interval
    placeholders: ["De …", "À …"], // Placeholder pentru câmpurile de interval
    validation: { min: 18, max: 100 }, // Validare pentru intervalul de vârstă
    next: 8, // Urmează întrebarea despre origine
    consentAfter: false, // Nu este necesar consimțământul imediat
    matchRequired: false, // Această întrebare este folosită pentru matching
    compatibility: true, // Această întrebare este folosită pentru compatibilitate
    compatibilityForOtherQuestion: true, // Această întrebare este folosită pentru matching
    qustionForCompatibility: [6],
  },
  {
    id: 8,
    text: "De quelle origine êtes-vous ?",
    options: [
      "Européenne",
      "Asiatique",
      "Arabe",
      "Indienne",
      "Africaine",
      "Latino-américaine",
    ], // Opțiuni predefinite
    type: "single", // Se poate selecta o singură opțiune
    allowsCustom: true, // Permite adăugarea unei origini personalizate
    next: 9, // Urmează întrebarea despre originea dorită
    consentAfter: false, // Nu este necesar consimțământul imediat
    matchRequired: false, // Această întrebare este folosită pentru matching
    compatibility: true, // Această întrebare este folosită pentru matching
    compatibilityForOtherQuestion: true, // Această întrebare este folosită pentru matching
  },
  {
    id: 9,
    text: "De quelle origine souhaiteriez-vous vos amis ?",
    options: [
      "Sans importance",
      "Européenne",
      "Asiatique",
      "Arabe",
      "Indienne",
      "Africaine",
      "Latino-américaine",
    ], // Opțiuni predefinite
    type: "multiple", // Permite selecția multiplă
    allowsCustom: true, // Permite adăugarea unei origini personalizate
    next: 10, // Urmează întrebarea despre consimțământ
    consentAfter: false, // Nu este necesar consimțământul imediat
    matchRequired: true, // Această întrebare este folosită pentru matching
    compatibility: true, // Această întrebare este folosită pentru compatibilitate
    compatibilityForOtherQuestion: true, // Această întrebare este folosită pentru matching
    qustionForCompatibility: [8],
  },
  // {
  //   id: 10,
  //   text: "Acceptez-vous que cette information soit partagée avec les profils compatibles ?",
  //   options: ["Oui", "Non"], // Opțiuni pentru consimțământ
  //   type: "single", // Consimțământ simplu
  //   consentFor: [6, 7, 8, 9], // Se referă la întrebările anterioare
  //   next: 11, // Final de secțiune sau urmează o altă întrebare
  // },

  {
    id: 11,
    text: "Travaillez-vous :",
    options: [
      "De jour, horaire de bureau.",
      "En pause, y compris la nuit.",
      "Uniquement la nuit.",
      "Horaires variable, je peux travailler même le week-end.",
      "Horaires variable, mais jamais le week-end.",
    ],
    type: "multiple", // Permite selecția multiplă
    next: 12, // Urmează întrebarea despre locuință
    matchRequired: false,
    compatibility: true,
  },
  {
    id: 12,
    text: "Habitez-vous :",
    options: [
      "Seul.",
      "Avec mes parents.",
      "Avec mes enfants tout le temps.",
      "Avec mes enfants une partie du temps.",
      "Colocation.",
      "C’est délicat.",
      "Sans domicile fixe.",
    ],
    type: "single", // Se poate selecta o singură opțiune
    next: 13, // Urmează întrebarea despre copii
    matchRequired: false,
  },
  {
    id: 13,
    text: "Combien d’enfants avez-vous ?",
    options: ["Je n’ai pas d’enfants.", "1", "2", "3", "4", "5+"],
    type: "single", // Se poate selecta o singură opțiune
    conditionalNext: {
      "Je n’ai pas d’enfants.": 16, // Sare la întrebarea despre animale dacă nu are copii
      default: 14, // Continuă cu întrebările despre vârsta copiilor
    },
    next: 14, // Urmează întrebarea despre copii
    matchRequired: false,
  },
  {
    id: 14,
    text: "Quel âge a le plus jeune de vos enfants ?",
    type: "input", // Input pentru vârstă
    placeholder: "Années",
    validation: { type: "number", min: 0, max: 100 }, // Validare pentru vârstă
    next: 15, // Urmează întrebarea despre copilul mai mare
  },
  {
    id: 15,
    text: "Quel âge a le plus âgé de vos enfants ?",
    type: "input", // Input pentru vârstă
    placeholder: "Années",
    validation: { type: "number", min: 0, max: 100 }, // Validare pentru vârstă
    next: 16, // Urmează întrebarea despre animale de companie
  },
  {
    id: 16,
    text: "Avez-vous des animaux de compagnie ?",
    options: ["Oui", "Non"],
    type: "single", // Se poate selecta o singură opțiune
    conditionalNext: {
      Oui: 17, // Continuă cu întrebarea despre tipul animalelor de companie
      Non: 18, // Sare la următoarea întrebare despre situația familială
    },
    compatibility: true, // Această întrebare este folosită pentru matching
  },
  {
    id: 17,
    text: "Si Oui, lesquels ?",
    options: [
      "Chien",
      "Chat",
      "Poisson",
      "Reptiles",
      "Hamster",
      "Lapin",
      "J’ai une ferme !!!",
    ],
    type: "multiple", // Permite selecția multiplă
    next: 18, // Urmează întrebarea despre situația familială
  },
  {
    id: 18,
    text: "Quelle est votre situation familiale personnelle ?",
    options: [
      "Je n’ai jamais été marié(e).",
      "Je suis marié(e).",
      "Je vis en couple.",
      "Je suis divorcé(e).",
      "Je suis séparé(e).",
      "Je suis veuf(ve).",
    ],
    type: "single", // Se poate selecta o singură opțiune
    next: 19, // Urmează întrebarea despre acceptarea animalelor de companie
  },
  {
    id: 19,
    text: "Accepteriez-vous que vos amis aient des animaux de compagnie ?",
    options: ["Oui", "Non"],
    type: "single", // Se poate selecta o singură opțiune
    next: 20, // Final de secțiune
  },

  {
    id: 20,
    text: "Quel est votre moyen de transport principal :",
    options: [
      "A pieds.",
      "En Vélo",
      "En Moto",
      "En Voiture",
      "En Transport en commun.",
    ],
    type: "single", // Se poate selecta o singură opțiune
    next: 21, // Urmează întrebarea despre distanța pe care utilizatorul o poate parcurge
    matchRequired: false,
    compatibility: true,
  },
  {
    id: 21,
    text: "Combien des Km êtes-vous prêt à faire pour aller voir (souvent) vos amis ?",
    options: ["Moins de 10 km.", "Moins de 50 km.", "Moins de 100 km."],
    type: "single", // Se poate selecta o singură opțiune
    next: 22, // Urmează întrebarea despre consimțământ
    matchRequired: false,
    compatibility: true,
  },
  // {
  //   id: 22,
  //   text: "Acceptez-vous que cette information soit partagée avec les profils compatibles ?",
  //   options: ["Oui", "Non"],
  //   type: "single", // Consimțământ simplu
  //   consentFor: [20, 21], // Se referă la întrebările despre mijlocul de transport și distanța acceptabilă
  //   next: 23, // Final de secțiune sau urmează altă întrebare
  // },
  // {
  //   id: 23,
  //   text: "Quel est votre moyen de transport principal :",
  //   options: [
  //     "A pieds.",
  //     "En Vélo",
  //     "En Moto",
  //     "En Voiture",
  //     "En Transport en commun.",
  //   ],
  //   type: "single", // Se poate selecta o singură opțiune
  //   next: 24, // Urmează întrebarea despre distanța parcursă
  //   matchRequired: false,
  // },
  // {
  //   id: 24,
  //   text: "Combien des Km êtes-vous prêt à faire pour aller voir (souvent) vos amis ?",
  //   options: ["Moins de 10 km.", "Moins de 50 km.", "Moins de 100 km."],
  //   type: "single", // Se poate selecta o singură opțiune
  //   next: 25, // Urmează întrebarea despre consimțământ
  //   matchRequired: false,
  // },
  // {
  //   id: 25,
  //   text: "Acceptez-vous que cette information soit partagée avec les profils compatibles ?",
  //   options: ["Oui", "Non"],
  //   type: "single", // Consimțământ simplu
  //   consentFor: [20, 21], // Se referă la întrebările despre transport și distanța parcursă
  //   next: 26, // Final de secțiune sau urmează altă întrebare
  // },
  {
    id: 26,
    text: "Alimentation : vous-êtes :",
    options: [
      "Omnivore",
      "Végétarien",
      "Végan",
      "Végétalien",
      "Régime particulier",
    ],
    type: "single", // Se poate selecta o singură opțiune
    next: 27, // Urmează întrebarea despre acceptarea altor obiceiuri alimentare
    matchRequired: false,
    compatibility: true,
  },
  {
    id: 27,
    text: "Accepteriez-vous que vos amis aient des habitudes alimentaires différentes des vôtres ?",
    options: ["Oui", "Non", "Oui, mais sans obligation de changement."],
    type: "single", // Se poate selecta o singură opțiune
    next: 28, // Urmează întrebarea despre consimțământ
    matchRequired: false,
    compatibility: true,
  },
  {
    id: 28,
    text: "Acceptez-vous que ces informations soient partagées avec les profils compatibles ?",
    options: ["Oui", "Non"],
    type: "single", // Consimțământ simplu
    consentFor: [23, 24], // Se referă la întrebările despre alimentație
    next: 29, // Final de secțiune sau urmează altă întrebare
  },
  {
    id: 29,
    text: "Soignez-vous votre aspect physique :",
    options: [
      "Oui, je fais beaucoup d’attention à ça.",
      "Non, je suis comme je suis.",
      "Oui, dans la limite du temps à disposition.",
    ],
    type: "single", // Se poate selecta o singură opțiune
    next: 30, // Urmează întrebarea despre igienă
  },
  {
    id: 30,
    text: "Quel est votre état d’hygiène ?",
    options: [
      "Impeccable.",
      "Parfois je ne trouve pas le temps de me préparer comme je voudrai.",
      "Il m’a été déjà dit d’avoir une forte transpiration.",
    ],
    type: "single", // Se poate selecta o singură opțiune
    next: 31, // Urmează întrebarea despre sport
    matchRequired: false,
    compatibility: true,
  },
  {
    id: 31,
    text: "Faites-vous du sport ?",
    options: [
      "Oui, tous les jours",
      "Oui, entre 4 et 5 fois par semaine.",
      "Oui, entre 2 et 3 fois par semaine.",
      "Oui, 1 fois par semaine.",
      "Non",
    ],
    type: "single", // Se poate selecta o singură opțiune
    next: 32, // Urmează întrebarea despre boală sau handicap
    matchRequired: false,
    compatibility: true,
  },
  {
    id: 32,
    text: "Avez-vous une maladie ou un handicap qui pourrait avoir un impact sur vos recontres?",
    options: ["Oui", "Non"],
    type: "single", // Se poate selecta o singură opțiune
    next: 33, // Urmează întrebarea despre consimțământ
    matchRequired: false,
    compatibility: true,
  },
  {
    id: 33,
    text: "Acceptez-vous que ces informations soient partagées avec les profils compatibles ?",
    options: ["Oui", "Non"],
    type: "single", // Consimțământ simplu
    consentFor: [26, 27, 28, 29], // Se referă la întrebările despre aspect fizic, igienă, sport și boală/handicap
    next: 34, // Final de secțiune sau urmează altă întrebare
  },
  // Assuétudes
  {
    id: 34,
    section: "Habitudes",
    text: "Tabac :",
    options: ["Oui", "Non"],
    type: "single", // Se poate selecta o singură opțiune
    next: 35, // Dacă răspunsul este "Oui", continuă cu următoarea întrebare
    conditionalNext: {
      Oui: 35, // Continuă dacă utilizatorul fumează
      Non: 36, // Sare la următoarea întrebare dacă nu fumează
    },
  },
  {
    id: 35,
    section: "Habitudes",
    text: "Si Oui :",
    options: ["Tous les jours", "Occasionnellement", "Rarement"],
    type: "single", // Se poate selecta o singură opțiune
    next: 36, // Urmează întrebarea despre alcool
  },
  {
    id: 36,
    section: "Habitudes",
    text: "Alcool :",
    options: ["Oui", "Non"],
    type: "single", // Se poate selecta o singură opțiune
    next: 37,
    conditionalNext: {
      Oui: 37, // Continuă dacă utilizatorul consumă alcool
      Non: 38, // Sare la întrebarea despre cafea dacă nu consumă alcool
    },
  },
  {
    id: 37,
    section: "Habitudes",
    text: "Si Oui :",
    options: ["Tous les jours", "Occasionnellement", "Rarement"],
    type: "single",
    next: 38,
  },
  {
    id: 38,
    section: "Habitudes",
    text: "Quel type d’alcool consommez-vous le plus ?",
    options: ["Bière", "Vin", "Spiritueux et Cocktails"],
    type: "single",
    next: 39,
  },
  {
    id: 39,
    section: "Habitudes",
    text: "Café :",
    options: ["Oui", "Non"],
    type: "single",
    next: 40,
    conditionalNext: {
      Oui: 40, // Continuă dacă utilizatorul consumă cafea
      Non: 41, // Sare la întrebarea despre ceai dacă nu consumă cafea
    },
  },
  {
    id: 40,
    section: "Habitudes",
    text: "Si Oui :",
    options: ["Tous les jours", "Occasionnellement", "Rarement"],
    type: "single",
    next: 41,
  },
  {
    id: 41,
    section: "Habitudes",
    text: "Thé :",
    options: ["Oui", "Non"],
    type: "single",
    next: 42,
    conditionalNext: {
      Oui: 42,
      Non: 43,
    },
  },
  {
    id: 42,
    section: "Habitudes",
    text: "Si Oui :",
    options: ["Tous les jours", "Occasionnellement", "Rarement"],
    type: "single",
    next: 43,
  },
  {
    id: 43,
    section: "Habitudes",
    text: "Boissons sucrées :",
    options: ["Oui", "Non"],
    type: "single",
    next: 44,
    conditionalNext: {
      Oui: 44,
      Non: 45,
    },
  },
  {
    id: 44,
    section: "Habitudes",
    text: "Si Oui :",
    options: ["Tous les jours", "Occasionnellement", "Rarement"],
    type: "single",
    next: 45,
  },
  {
    id: 45,
    section: "Habitudes",
    text: "Boissons énergétiques :",
    options: ["Oui", "Non"],
    type: "single",
    next: 46,
    conditionalNext: {
      Oui: 46,
      Non: 47,
    },
  },
  {
    id: 46,
    section: "Habitudes",
    text: "Si Oui :",
    options: ["Tous les jours", "Occasionnellement", "Rarement"],
    type: "single",
    next: 47,
  },
  {
    id: 47,
    section: "Habitudes",
    text: "Acceptez-vous que ces informations soient partagées avec les profils compatibles ?",
    options: ["Oui", "Non"],
    type: "single",
    consentFor: [31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44], // Se referă la întrebările despre obiceiuri
    next: 48, // Este ultima întrebare din acest calup
  },
  //Premier Rendez-vous//
  {
    id: 48,
    text: "Quelle activité choisiriez-vous pour un premier rendez-vous ?",
    type: "image-selection", // Tipul este bazat pe imagini
    options: [
      { image: "activityfour.png" },
      { image: "activitythree.png" },
      { image: "activitytwo.png" },
      { image: "activityone.png" },
    ],
    next: 49,
  },
  {
    id: 49,
    text: "Compte tenu de vos activités professionnelles/familiales/personnelles, combien de jours par semaine êtes-vous disponible pour des rencontres en amitié ?",
    options: [
      "Tous les jours.",
      "Moins que 5 jours par semaine.",
      "Moins que 3 jours par semaine.",
      "Moins qu’un jour par semaine.",
      "Uniquement les week-ends.",
      "Une fois chaque 2 semaines.",
      "En fonction de la garde parentale.",
      "Une fois par mois.",
      "Moins d’une fois par mois.",
    ],
    type: "single", // Se poate selecta o singură opțiune
    next: 50, // Urmează întrebarea despre punctualitate
    matchRequired: false,
    compatibility: true,
  },
  {
    id: 50,
    text: "Etes-vous ponctuel/le ?",
    options: ["Oui", "Non"],
    type: "single", // Se poate selecta o singură opțiune
    next: 51, // Urmează întrebarea despre feedback
    matchRequired: false,
    compatibility: true,
  },
  {
    id: 51,
    text: "Après un premier rendez-vous en amitié, aimeriez-vous avoir un feedback de la part de l’autre sur son ressenti ?",
    options: ["Oui", "Non"],
    type: "single", // Se poate selecta o singură opțiune
    next: 52, // Urmează întrebarea despre statutul social
    matchRequired: false,
    compatibility: true,
  },
  {
    id: 52,
    text: "Le statut de l’autre personne pourrait-il vous impressionner ?",
    options: ["Oui", "Non"],
    type: "single", // Se poate selecta o singură opțiune
    next: 53, // Urmează întrebarea despre anularea întâlnirii
  },
  {
    id: 53,
    text: "L’autre annule le rendez-vous à la dernière minute, comment vous vous comportez ?",
    options: [
      "Ça dépend de la raison.",
      "Au suivant.",
      "Je suis déçu et j’exprime mon ressenti.",
    ],
    type: "single", // Se poate selecta o singură opțiune
    next: 54, // Urmează întrebarea despre consimțământ
  },
  {
    id: 54,
    text: "Acceptez-vous que ces informations soient partagées avec les profils compatibles ?",
    options: ["Oui", "Non"],
    type: "single", // Consimțământ simplu
    consentFor: [46, 47, 48, 49, 50], // Se referă la întrebările despre disponibilitate, punctualitate, feedback, statut și comportament
    next: 55, // Final de secțiune sau urmează altă întrebare
  },
  {
    id: 55,
    text: "Quelles sont les activités que vous pourriez partager avec les personnes rencontrées via notre plateforme ?",
    options: [
      "Musique",
      "Sport équestre",
      "Randonnée",
      "Gastronomie",
      "Art et activité manuelles",
      "Théâtre/Danse/Opéra/Ballet",
      "Nature/Jardinage",
      "Sortie soirée",
      "Diner au restaurant",
      "Sport d’hiver",
      "Film/Cinéma",
      "Voyages",
      "Art",
      "Photographie",
      "Sport Nautique",
      "Littérature",
      "Chasse",
      "Pêche",
      "Escalade",
      "Sport collectif",
      "Prendre un verre ensemble",
      "Concert",
      "Balades",
      "Jouer de la musique",
      "Chanter",
      "Science et technologie",
      "Développement personnel",
      "Activité caritative",
      "Regarder du sport",
      "Cuisiner",
      "Natation",
      "Cyclisme",
      "Musée et Expo",
      "Jogging",
      "Jeux vidéo",
      "Jeux de société",
      "Beauté",
      "Bien-être",
      "Yoga",
      "Spa",
      "Animaux",
      "Parc d’attraction",
      "Activités avec enfants",
      "Echecs",
      "Histoire",
      "Jeux de cartes",
      "Thé Dansant",
      "Couture",
      "Pâtisserie",
      "Bricolage",
      "Voitures/Rally/Formula 1",
      "Tennis",
      "Tennis de Table",
      "Badminton",
      "Rugby",
      "Volley",
      "Basket",
      "Football",
      "Décoration",
      "Informatique",
      "Politique",
      "Mode",
    ],
    type: "multiple", // Permite selecția multiplă
    allowsCustom: false, // Nu permite adăugarea de opțiuni personalizate
    next: 56, // Urmează întrebarea despre consimțământ
    matchRequired: true, // Utilizat pentru matching
    compatibility: true, // Folosit pentru compatibilitate
  },
  {
    id: 56,
    text: "Acceptez-vous que ces informations soient partagées avec les profils compatibles ?",
    options: ["Oui", "Non"],
    type: "single", // Consimțământ simplu
    consentFor: [52], // Se referă la întrebarea despre activități
    next: 57, // Final de secțiune sau urmează altă întrebare
  },
  //Personnalité //

  {
    personaliteStart: true,
    id: 57,
    section: "Émotions et comportements",
    text: "Je me sens tendu(e) ou énervé(e)",
    options: ["Oui", "Non"],
    type: "single",
    next: 58,
    categoriePersonalitate: "CATEGORIA A",
    personalitate: true,
  },
  {
    id: 58,
    section: "Émotions et comportements",
    text: "J’ai une sensation de peur comme si quelque chose d’horrible allait m’arriver",
    options: ["Oui", "Non"],
    type: "single",
    next: 59,
    categoriePersonalitate: "CATEGORIA A",
    personalitate: true,
  },
  {
    id: 59,
    section: "Émotions et comportements",
    text: "Je ris facilement et vois le bon côté des choses",
    options: ["Oui", "Non"],
    type: "single",
    next: 60,
    categoriePersonalitate: "CATEGORIA F",
    personalitate: true,
  },
  {
    id: 60,
    section: "Émotions et comportements",
    text: "Je suis de bonne humeur",
    options: ["Oui", "Non"],
    type: "single",
    next: 61,
    categoriePersonalitate: "CATEGORIA F",
    personalitate: true,
  },
  {
    id: 61,
    section: "Émotions et comportements",
    text: "Je peux rester tranquillement assis(e) à ne rien faire et me sentir décontracté(e)",
    options: ["Oui", "Non"],
    type: "single",
    next: 62,
    categoriePersonalitate: "CATEGORIA F",
    personalitate: true,
  },
  {
    id: 62,
    section: "Émotions et comportements",
    text: "J’ai l’impression de fonctionner au ralenti",
    options: ["Oui", "Non"],
    type: "single",
    next: 63,
    personalitate: true,
  },
  {
    id: 63,
    section: "Émotions et comportements",
    text: "Je me réjouis d’avance à l’idée de faire certaines choses",
    options: ["Oui", "Non"],
    type: "single",
    next: 64,
    categoriePersonalitate: "CATEGORIA F",
    personalitate: true,
  },
  {
    id: 64,
    section: "Émotions et comportements",
    text: "J’éprouve des sensations soudaines de panique",
    options: ["Oui", "Non"],
    type: "single",
    next: 65,
    categoriePersonalitate: "CATEGORIA A",
    personalitate: true,
  },
  {
    id: 65,
    section: "Émotions et comportements",
    text: "Je fais/Je dis les choses sans y penser",
    options: ["Oui", "Non"],
    type: "single",
    next: 66,
    categoriePersonalitate: "CATEGORIA C",
    personalitate: true,
  },
  {
    id: 66,
    section: "Émotions et comportements",
    text: "J'ai des idées qui fusent",
    options: ["Oui", "Non"],
    type: "single",
    next: 67,
    categoriePersonalitate: "CATEGORIA C",
    personalitate: true,
  },
  {
    id: 67,
    section: "Émotions et comportements",
    text: "Je projette mes voyages longtemps à l'avance",
    options: ["Oui", "Non"],
    type: "single",
    next: 68,
    categoriePersonalitate: "CATEGORIA A",
    personalitate: true,
  },
  {
    id: 68,
    section: "Émotions et comportements",
    text: "Je suis maître de moi",
    options: ["Oui", "Non"],
    type: "single",
    next: 69,
    categoriePersonalitate: "CATEGORIA F",
    personalitate: true,
  },
  {
    id: 69,
    section: "Émotions et comportements",
    text: "Je me concentre facilement",
    options: ["Oui", "Non"],
    type: "single",
    next: 70,
    categoriePersonalitate: "CATEGORIA F",
    personalitate: true,
  },
  {
    id: 70,
    section: "Émotions et comportements",
    text: "J'ai la bougeotte au spectacle ou aux conférences",
    options: ["Oui", "Non"],
    type: "single",
    next: 71,
    categoriePersonalitate: "CATEGORIA C",
    personalitate: true,
  },
  {
    id: 71,
    section: "Émotions et comportements",
    text: "Je veille à ma sécurité d'emploi",
    options: ["Oui", "Non"],
    type: "single",
    next: 72,
    categoriePersonalitate: "CATEGORIA A",
    personalitate: true,
  },
  {
    id: 72,
    section: "Émotions et comportements",
    text: "J'aime réfléchir à des problèmes complexes",
    options: ["Oui", "Non"],
    type: "single",
    next: 73,
    categoriePersonalitate: "CATEGORIA D",
    personalitate: true,
  },
  {
    id: 73,
    section: "Émotions et comportements",
    text: "J'ai peur sans aucune raison",
    options: ["Oui", "Non"],
    type: "single",
    next: 74,
    categoriePersonalitate: "CATEGORIA A",
    personalitate: true,
  },
  {
    id: 74,
    section: "Émotions et comportements",
    text: "J'agis sur un coup de tête",
    options: ["Oui", "Non"],
    type: "single",
    next: 75,
    personalitate: true,
  },
  {
    id: 75,
    section: "Émotions et comportements",
    text: "Je parle vite",
    options: ["Oui", "Non"],
    type: "single",
    next: 76,
    categoriePersonalitate: "CATEGORIA A",
    personalitate: true,
  },
  {
    id: 76,
    section: "Émotions et comportements",
    text: "J’aime les rendez-vous romantiques traditionnels",
    options: ["Oui", "Non"],
    type: "single",
    next: 77,
    categoriePersonalitate: "CATEGORIA D",
    personalitate: true,
  },
  {
    id: 77,
    section: "Émotions et comportements",
    text: "Je suis rapidement impatient(e) et irrité(e) si je ne trouve pas une solution à un problème",
    options: ["Oui", "Non"],
    type: "single",
    next: 78,
    categoriePersonalitate: "CATEGORIA D",
    personalitate: true,
  },
  {
    id: 78,
    section: "Émotions et comportements",
    text: "Il m’a été déjà dit que j’ai une drôle d’allure ou de démarche",
    options: ["Oui", "Non"],
    type: "single",
    next: 79,
    categoriePersonalitate: "CATEGORIA D",
    personalitate: true,
  },
  {
    id: 79,
    section: "Émotions et comportements",
    text: "Je trouve difficile d'apprendre des choses pour lesquelles je ne suis pas intéressé(e)",
    options: ["Oui", "Non"],
    type: "single",
    next: 80,
    categoriePersonalitate: "CATEGORIA D",
    personalitate: true,
  },
  {
    id: 80,
    section: "Émotions et comportements",
    text: "J’ai des habitudes difficiles à interrompre",
    options: ["Oui", "Non"],
    type: "single",
    next: 81,
    categoriePersonalitate: "CATEGORIA D",
    personalitate: true,
  },
  {
    id: 81,
    section: "Émotions et comportements",
    text: "Si je suis interrompu(e), je ne peux pas revenir rapidement à ce que je faisais avant",
    options: ["Oui", "Non"],
    type: "single",
    next: 82,
    categoriePersonalitate: "CATEGORIA D",
    personalitate: true,
  },
  {
    id: 82,
    section: "Émotions et comportements",
    text: "Je trouve facile de décrire mes sentiments",
    options: ["Oui", "Non"],
    type: "single",
    next: 83,
    categoriePersonalitate: "CATEGORIA F",
    personalitate: true,
  },
  {
    id: 83,
    section: "Émotions et comportements",
    text: "J’ai un besoin intense d'observer les habitudes des humains et/ou des animaux",
    options: ["Oui", "Non"],
    type: "single",
    next: 84,
    personalitate: true,
  },
  {
    id: 84,
    section: "Émotions et comportements",
    text: "J’ai la tendance à être tellement absorbé(e) par mes intérêts spécifiques que j’oublie tout le reste",
    options: ["Oui", "Non"],
    type: "single",
    next: 85,
    categoriePersonalitate: "CATEGORIA D",
    personalitate: true,
  },
  {
    id: 85,
    section: "Émotions et comportements",
    text: "Je suis jaloux(se) en couple",
    options: ["Oui", "Non"],
    type: "single",
    next: 86,
    categoriePersonalitate: "CATEGORIA A",
    personalitate: true,
  },
  {
    id: 86,
    section: "Émotions et comportements",
    text: "J’ai été accusé d’avoir un regard fixe ou de regarder fixement",
    options: ["Oui", "Non"],
    type: "single",
    next: 87,
    categoriePersonalitate: "CATEGORIA D",
    personalitate: true,
  },
  {
    id: 87,
    section: "Émotions et comportements",
    text: "Je suis bon(ne) dans l'interprétation des expressions du visage",
    options: ["Oui", "Non"],
    type: "single",
    next: 88,
    categoriePersonalitate: "CATEGORIA F",
    personalitate: true,
  },
  {
    id: 88,
    section: "Émotions et comportements",
    text: "Je suis fidèle",
    options: ["Oui", "Non"],
    type: "single",
    next: 89,
    categoriePersonalitate: "CATEGORIA F",
    personalitate: true,
  },
  {
    id: 89,
    section: "Émotions et comportements",
    text: "J’ai besoin de beaucoup de motivation pour faire les choses",
    options: ["Oui", "Non"],
    type: "single",
    next: 90,
    categoriePersonalitate: "CATEGORIA B",
    personalitate: true,
  },
  {
    id: 90,
    section: "Émotions et comportements",
    text: "J’aime les voyages",
    options: ["Oui", "Non"],
    type: "single",
    next: 91,
    categoriePersonalitate: "CATEGORIA F",
    personalitate: true,
  },
  {
    id: 91,
    section: "Émotions et comportements",
    text: "J’ai tendance à interpréter les choses littéralement",
    options: ["Oui", "Non"],
    type: "single",
    next: 92,
    categoriePersonalitate: "CATEGORIA D",
    personalitate: true,
  },
  {
    id: 92,
    section: "Émotions et comportements",
    text: "Je me sens souvent triste",
    options: ["Oui", "Non"],
    type: "single",
    next: 93,
    categoriePersonalitate: "CATEGORIA B",
    personalitate: true,
  },
  {
    id: 93,
    section: "Émotions et comportements",
    text: "Je crois avoir connu plus d’échecs que le reste des gens",
    options: ["Oui", "Non"],
    type: "single",
    next: 94, // Ultima întrebare
    categoriePersonalitate: "CATEGORIA B",
    personalitate: true,
  },

  {
    id: 94,
    section: "Émotions et comportements",
    text: "Mon sommeil est perturbé",
    options: ["Oui", "Non"],
    type: "single",
    next: 95,
    categoriePersonalitate: "CATEGORIA B",
    personalitate: true,
  },
  {
    id: 95,
    section: "Émotions et comportements",
    text: "Je suis capable de me détendre.",
    options: ["Oui", "Non"],
    type: "single",
    next: 96,
    categoriePersonalitate: "CATEGORIA F",
    personalitate: true,
  },
  // {
  //   id: 96,
  //   section: "Émotions et comportements",
  //   text: "Je suis timide",
  //   options: ["Oui", "Non"],
  //   type: "single",
  //   next: 97,
  // },
  {
    id: 97,
    section: "Émotions et comportements",
    text: "Je me sens à l'aise avec le travail d'équipe",
    options: ["Oui", "Non"],
    type: "single",
    next: 98,
    categoriePersonalitate: "CATEGORIA F",
    personalitate: true,
  },
  {
    id: 98,
    section: "Émotions et comportements",
    text: "J’ai la tendance à me sentir coupable",
    options: ["Oui", "Non"],
    type: "single",
    next: 99,
    categoriePersonalitate: "CATEGORIA B",
    personalitate: true,
  },
  {
    id: 99,
    section: "Émotions et comportements",
    text: "Je suis fier (fière) de moi-même",
    options: ["Oui", "Non"],
    type: "single",
    next: 100,
    categoriePersonalitate: "CATEGORIA F",
    personalitate: true,
  },
  {
    id: 100,
    section: "Émotions et comportements",
    text: "Je me critique beaucoup",
    options: ["Oui", "Non"],
    type: "single",
    next: 101,
    categoriePersonalitate: "CATEGORIA B",
    personalitate: true,
  },
  {
    id: 101,
    section: "Émotions et comportements",
    text: "Je me soucie de ce que les gens pensent de moi",
    options: ["Oui", "Non"],
    type: "single",
    next: 102,
    categoriePersonalitate: "CATEGORIA A",
    personalitate: true,
  },
  {
    id: 102,
    section: "Émotions et comportements",
    text: "Je suis fier (fière) de mon apparence",
    options: ["Oui", "Non"],
    type: "single",
    next: 103,
    categoriePersonalitate: "CATEGORIA F",
    personalitate: true,
  },
  {
    id: 103,
    section: "Émotions et comportements",
    text: "J’aime les grandes manifestations, même s'il y a foule",
    options: ["Oui", "Non"],
    type: "single",
    next: 104,
    categoriePersonalitate: "CATEGORIA F",
    personalitate: true,
  },
  {
    id: 104,
    section: "Émotions et comportements",
    text: "J’ai des problèmes pour trouver mon chemin vers de nouveaux lieux",
    options: ["Oui", "Non"],
    type: "single",
    next: 105,
    categoriePersonalitate: "CATEGORIA D",
    personalitate: true,
  },
  {
    id: 105,
    section: "Émotions et comportements",
    text: "J’ai déjà pensé à me tuer",
    options: ["Oui", "Non"],
    type: "single",
    next: 106,
    categoriePersonalitate: "CATEGORIA B",
    personalitate: true,
  },
  {
    id: 106,
    section: "Émotions et comportements",
    text: "Je suis sensible lorsque je regarde les films",
    options: ["Oui", "Non"],
    type: "single",
    next: 107,
    categoriePersonalitate: "CATEGORIA D",
    personalitate: true,
  },
  {
    id: 107,
    section: "Émotions et comportements",
    text: "J’ai un bon équilibre entre le travail, les loisirs et le repos",
    options: ["Oui", "Non"],
    type: "single",
    next: 108,
    categoriePersonalitate: "CATEGORIA F",
    personalitate: true,
  },
  {
    id: 108,
    section: "Émotions et comportements",
    text: "J’ai déjà vécu des pressions importantes au travail",
    options: ["Oui", "Non"],
    type: "single",
    next: 109,
    categoriePersonalitate: "CATEGORIA B",
    personalitate: true,
  },
  {
    id: 109,
    section: "Émotions et comportements",
    text: "Je pleure souvent",
    options: ["Oui", "Non"],
    type: "single",
    next: 110,
    categoriePersonalitate: "CATEGORIA B",
    personalitate: true,
  },
  {
    id: 110,
    section: "Émotions et comportements",
    text: "Je suis irritable au volant",
    options: ["Oui", "Non"],
    type: "single",
    next: 111,
    categoriePersonalitate: "CATEGORIA B",
    personalitate: true,
  },
  {
    id: 111,
    section: "Émotions et comportements",
    text: "J’ai du mal à reconnaitre mes responsabilités",
    options: ["Oui", "Non"],
    type: "single",
    next: 112,
    categoriePersonalitate: "CATEGORIA B",
    personalitate: true,
  },
  {
    id: 112,
    section: "Émotions et comportements",
    text: "Je remets les décisions au lendemain (procrastination)",
    options: ["Oui", "Non"],
    type: "single",
    next: 113,
    personalitate: true,
  },
  {
    id: 113,
    section: "Émotions et comportements",
    text: "Je me trouve attrayant(e)",
    options: ["Oui", "Non"],
    type: "single",
    next: 114, // Ultima întrebare
    categoriePersonalitate: "CATEGORIA F",
    personalitate: true,
  },

  {
    id: 114,
    section: "Émotions et comportements",
    text: "J’ai des problèmes liés au temps dans les conversations",
    options: ["Oui", "Non"],
    type: "single",
    next: 115,
    categoriePersonalitate: "CATEGORIA D",
    personalitate: true,
  },
  {
    id: 115,
    section: "Émotions et comportements",
    text: "Je collectionne des objets",
    options: ["Oui", "Non"],
    type: "single",
    next: 116,
    categoriePersonalitate: "CATEGORIA D",
    personalitate: true,
  },
  {
    id: 116,
    section: "Émotions et comportements",
    text: "Mon travail me demande beaucoup d’effort",
    options: ["Oui", "Non"],
    type: "single",
    next: 117,
    categoriePersonalitate: "CATEGORIA B",
    personalitate: true,
  },
  {
    id: 117,
    section: "Émotions et comportements",
    text: "Je me sens souvent fatigué(e)",
    options: ["Oui", "Non"],
    type: "single",
    next: 118,
    categoriePersonalitate: "CATEGORIA B",
    personalitate: true,
  },
  {
    id: 118,
    section: "Émotions et comportements",
    text: "Si je suis irritable j’ai la tendance à manger moins",
    options: ["Oui", "Non"],
    type: "single",
    next: 119,
    categoriePersonalitate: "CATEGORIA G",
    personalitate: true,
  },
  {
    id: 119,
    section: "Émotions et comportements",
    text: "Si je suis irritable j’ai la tendance à manger plus",
    options: ["Oui", "Non"],
    type: "single",
    next: 120,
    categoriePersonalitate: "CATEGORIA G",
    personalitate: true,
  },
  {
    id: 120,
    section: "Émotions et comportements",
    text: "Je m’identifie à toutes les pathologies que je lis sur internet",
    options: ["Oui", "Non"],
    type: "single",
    next: 121,
    personalitate: true,
  },
  {
    id: 121,
    section: "Émotions et comportements",
    text: "J’ai un humour noir",
    options: ["Oui", "Non"],
    type: "single",
    next: 122,
    categoriePersonalitate: "CATEGORIA F",
    personalitate: true,
  },
  {
    id: 122,
    section: "Émotions et comportements",
    text: "Je suis mal à l’aise face à des personnes qui ont une communication ironique.",
    options: ["Oui", "Non"],
    type: "single",
    next: 123,
    categoriePersonalitate: "CATEGORIA D",
    personalitate: true,
  },
  {
    id: 123,
    section: "Émotions et comportements",
    text: "Je suis gêné(e) par les étiquettes des vêtements",
    options: ["Oui", "Non"],
    type: "single",
    next: 124,
    categoriePersonalitate: "CATEGORIA D",
    personalitate: true,
  },
  {
    id: 124,
    section: "Émotions et comportements",
    text: "J’accepte facilement les critiques",
    options: ["Oui", "Non"],
    type: "single",
    next: 125,
    categoriePersonalitate: "CATEGORIA F",
    personalitate: true,
  },
  {
    id: 125,
    section: "Émotions et comportements",
    text: "Je m’adapte facilement à une situation",
    options: ["Oui", "Non"],
    type: "single",
    next: 126,
    categoriePersonalitate: "CATEGORIA F",
    personalitate: true,
  },
  {
    id: 126,
    section: "Émotions et comportements",
    text: "L’arrivée dans un nouveau travail m’angoisse",
    options: ["Oui", "Non"],
    type: "single",
    next: 127,
    categoriePersonalitate: "CATEGORIA A",
    personalitate: true,
  },
  {
    id: 127,
    section: "Émotions et comportements",
    text: "J’aime le contact de l’autre",
    options: ["Oui", "Non"],
    type: "single",
    next: 128,
    categoriePersonalitate: "CATEGORIA F",
    personalitate: true,
  },
  {
    id: 128,
    section: "Émotions et comportements",
    text: "J’ai des difficultés à parler en public",
    options: ["Oui", "Non"],
    type: "single",
    next: 129,
    personalitate: true,
  },
  {
    id: 129,
    section: "Émotions et comportements",
    text: "J’ai été victime d'un abus sexuel/maltraitance",
    options: ["Oui", "Non"],
    type: "single",
    next: null, // Ultima întrebare
    categoriePersonalitate: "CATEGORIA B",
    personalitate: true,
  },
];
