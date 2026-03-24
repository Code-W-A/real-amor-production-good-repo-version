import {
  handleGetSubcollections,
  handleQueryFirestoreSubcollection,
  handleQueryFirestoreSubcollectionCinciParam,
  handleQueryFirestoreSubcollectionPatruParam,
  handleQueryFirestoreSubcollectionSaseParam,
  handleQueryFirestoreSubcollectionTripleParam,
} from "./firestoreUtils";

export const toUrlSlug = (string) => {
  console.log("test tourlstring....", string);
  return string
    .toLowerCase()
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/[^\w\-]+/g, "") // Remove all non-word chars
    .replace(/\-\-+/g, "-"); // Replace multiple - with single -
};

export function validateEmail(email) {
  const re =
    /^(([^<>()\]\\.,;:\s@"]+(\.[^<>()\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

export function generateRandomGradient() {
  // Alege un unghi aleator pentru direcția gradientului
  const angle = Math.floor(Math.random() * 360);

  // Generează o culoare de bază aleatorie
  const baseHue = Math.floor(Math.random() * 360);

  // Utilizează o culoare complementară sau o culoare apropiată pe roata culorilor pentru un efect armonios
  const complementaryHue = (baseHue + 30) % 360; // Ajustează acest număr pentru a schimba variația de culori

  // Ajustează saturația și luminozitatea pentru a obține un aspect mai sofisticat și mai puțin saturat
  const saturation = 70; // Procent de saturație (mai mic pentru culori mai subtile)
  const lightness1 = 65; // Luminozitate mai mare pentru prima culoare
  const lightness2 = 50; // Luminozitate mai mică pentru a doua culoare, pentru contrast

  // Creează șirurile de culoare HSL pentru ambele culori ale gradientului
  const color1 = `hsl(${baseHue}, ${saturation}%, ${lightness1}%)`;
  const color2 = `hsl(${complementaryHue}, ${saturation}%, ${lightness2}%)`;

  // Construiește și returnează șirul de gradient liniar
  return `linear-gradient(${angle}deg, ${color1}, ${color2})`;
}

export function updateSelectBackground(selectElement) {
  const selectedOption = selectElement.options[selectElement.selectedIndex];
  selectElement.style.backgroundImage = selectedOption.style.backgroundImage;
}

export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  console.log(lat1);
  console.log(lon1);
  console.log(lat2);
  console.log(lon2);
  const R = 6371e3; // Raza Pământului în metri
  const φ1 = (lat1 * Math.PI) / 180; // φ, λ în radiani
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Distanța în metri
};

// Funcția pentru a închide modalul
export const closeSignupModal = (modalId) => {
  const modalElement = document.getElementById(modalId); // Înlocuiește cu ID-ul real al modalului tău
  const modalInstance = bootstrap.Modal.getInstance(modalElement);
  modalInstance.hide();
};

export const filtrareClinici = (parteneriFiltrati, searchQueryParteneri) => {
  // Împărțim query-ul de căutare în cuvinte individuale
  const normalizeText = (text) =>
    text
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();

  // Împărțim query-ul de căutare în cuvinte individuale, eliminăm diacriticele și transformăm în litere mici
  const searchTerms = searchQueryParteneri.split(/\s+/).map(normalizeText);

  // Funcție care verifică dacă toate cuvintele de căutare apar în text
  const matchesSearch = (text) => {
    const normalizedText = normalizeText(text);
    return searchTerms.every((term) => normalizedText.includes(term));
  };

  // Filtrăm partenerii pe baza denumirii brandului, categoriilor, adresei, descrierii, telefonului și emailului
  const parteneriFiltratiGasiti = parteneriFiltrati.filter(
    (partener) =>
      matchesSearch(partener.clinica.denumireBrand) ||
      matchesSearch(partener.titulatura) ||
      matchesSearch(partener.adresaSediu) ||
      matchesSearch(partener.clinica.adresaSediu) ||
      matchesSearch(partener.descriereOferta) ||
      matchesSearch(partener.cerintePost) ||
      matchesSearch(partener.titluOferta) ||
      matchesSearch(partener.clinica.telefonContact) ||
      matchesSearch(partener.clinica.email) ||
      matchesSearch(partener.specialitate || "")
  );
  console.log("with search query.......", parteneriFiltratiGasiti);

  return parteneriFiltratiGasiti;
};
export const filtrareCadreMedicale = (
  parteneriFiltrati,
  searchQueryParteneri
) => {
  try {
    console.log(
      "filtrareCadreMedicale...pe search query...cu...",
      searchQueryParteneri
    );
    console.log(
      "filtrareCadreMedicale...pe search query...cu...",
      parteneriFiltrati
    );

    const normalizeText = (text) =>
      text
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase();

    console.log("test-----------1");

    const searchTerms = searchQueryParteneri.split(/\s+/).map(normalizeText);

    console.log("test-----------2");

    const matchesSearch = (text, filedCautat) => {
      console.log(filedCautat, text);
      const normalizedText = normalizeText(text);
      return searchTerms.every((term) => normalizedText.includes(term));
    };

    console.log("test-----------3");

    const parteneriFiltratiGasiti = parteneriFiltrati.filter(
      (partener) =>
        matchesSearch(
          partener?.cadruMedical?.numeUtilizator || "",
          "partener.cadruMedical.numeUtilizator"
        ) ||
        matchesSearch(partener?.titulatura || "", "partener.titulatura") ||
        matchesSearch(partener?.adresaSediu || "", "partener.adresaSediu") ||
        matchesSearch(
          partener?.cadruMedical?.adresaSediu || "",
          "partener.cadruMedical.adresaSediu"
        ) ||
        matchesSearch(
          partener?.cadruMedical?.telefonContact || "",
          "partener.cadruMedical.telefonContact"
        ) ||
        matchesSearch(
          partener?.cadruMedical?.email || "",
          "partener.cadruMedical.email"
        ) ||
        matchesSearch(
          partener?.descriereOferta || "",
          "partener.descriereOferta"
        ) ||
        matchesSearch(partener?.specialitate || "", "partener.specialitate")
    );

    console.log("test-----------4");
    return parteneriFiltratiGasiti;
  } catch (error) {
    console.error("Error in filtrareCadreMedicale: ", error);
    return []; // Return an empty array or handle the error as needed
  }
};

export const filtrareGenerala = (parteneriFiltrati, searchQueryParteneri) => {
  try {
    // Împărțim query-ul de căutare în cuvinte individuale
    console.log("filtrare...generala...", searchQueryParteneri);

    const normalizeText = (text) =>
      text
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase();

    // Împărțim query-ul de căutare în cuvinte individuale, eliminăm diacriticele și transformăm în litere mici
    const searchTerms = searchQueryParteneri.split(/\s+/).map(normalizeText);

    // Funcție care verifică dacă toate cuvintele de căutare apar în text
    const matchesSearch = (text) => {
      // Verificăm dacă textul este definit înainte de a încerca să-l normalizăm
      if (typeof text !== "string") {
        return false;
      }

      const normalizedText = normalizeText(text);
      return searchTerms.every((term) => normalizedText.includes(term));
    };

    // Filtrăm partenerii pe baza denumirii brandului, categoriilor, adresei, descrierii, telefonului și emailului
    const parteneriFiltratiGasiti = parteneriFiltrati.filter(
      (partener) =>
        matchesSearch(partener?.cadruMedical?.numeUtilizator) ||
        matchesSearch(partener?.titulatura) ||
        matchesSearch(partener?.adresaSediu) ||
        matchesSearch(partener?.cadruMedical?.adresaSediu) ||
        matchesSearch(partener?.descriere) ||
        matchesSearch(partener?.cadruMedical?.telefonContact) ||
        matchesSearch(partener?.cadruMedical?.email) ||
        matchesSearch(partener?.descriereOferta) ||
        matchesSearch(partener?.specialitate || "") ||
        matchesSearch(partener?.clinica?.denumireBrand) ||
        matchesSearch(partener?.titulatura) ||
        matchesSearch(partener?.adresaSediu) ||
        matchesSearch(partener?.clinica?.adresaSediu) ||
        matchesSearch(partener?.descriereOferta) ||
        matchesSearch(partener?.cerintePost) ||
        matchesSearch(partener?.titluOferta) ||
        matchesSearch(partener?.clinica?.telefonContact) ||
        matchesSearch(partener?.clinica?.email) ||
        matchesSearch(partener?.specialitate || "")
    );

    return parteneriFiltratiGasiti;
  } catch (error) {
    console.error("Eroare în timpul filtrării generale:", error);
    // Poți decide ce să returnezi în caz de eroare, de exemplu, un array gol sau un mesaj de eroare
    return [];
  }
};

export const filtrareOferte = (oferte, searchQueryParteneri) => {
  // Împărțim query-ul de căutare în cuvinte individuale
  const searchTerms = searchQueryParteneri
    .split(/\s+/)
    .map((term) => term.toLowerCase());

  // Funcție care verifică dacă toate cuvintele de căutare apar în text
  const matchesSearch = (text) => {
    const lowercasedText = text.toLowerCase();
    return searchTerms.every((term) => lowercasedText.includes(term));
  };

  // Filtrăm partenerii pe baza denumirii brandului, categoriilor, adresei, descrierii, telefonului și emailului
  const oferteGasiti = oferte.filter(
    (partener) =>
      matchesSearch(partener.titluOferta) ||
      matchesSearch(partener.descriereOferta) ||
      matchesSearch(partener.cerintePost)
    // matchesSearch(partener.descriere) ||
    // matchesSearch(partener.telefonContact) ||
    // matchesSearch(partener.email)
  );

  return oferteGasiti;
};

export const verifyCurrentUser = async (partenerId, userData, loading) => {
  if (partenerId) {
    console.log("is partener id...");
    if (
      (!loading && userData?.userType != "Partener") ||
      (!loading && userData.user_uid != partenerId)
    ) {
      console.log("not first...");
      return false;
    } else {
      console.log("is first...");
      return true;
    }
  } else {
    if (!loading && userData?.userType != "Partener") {
      console.log("not second...");
      return false;
    } else {
      console.log("is second...");
      return true;
    }
  }
};

// Function to get all offers from partners with distance
export async function getAllAnunturiClinici(latitude, longitude, localitate) {
  let allOffers = [];

  // Iterate through each partner

  // Fetch offers for the current partner
  let oferte = await handleQueryFirestoreSubcollection(
    "Anunturi",
    "localitate",
    localitate,
    "tipAnunt",
    "Clinica"
  );

  // Calculate distance from the user to the partner
  const distanta = calculateDistance(
    latitude,
    longitude,
    partener.coordonate.lat,
    partener.coordonate.lng
  );

  // Add distance to each offer
  oferte = oferte.map((oferta) => ({
    ...oferta,
    distanta: Math.floor(distanta),
    partener,
  }));

  // Add the fetched offers to the allOffers array
  allOffers = allOffers.concat(oferte);

  // Sort all offers by distance
  allOffers.sort((a, b) => a.distanta - b.distanta);

  return allOffers;
}

// Function to get all offers from partners with distance
export async function getAllAnunturiCadre(latitude, longitude, parteneri) {
  let allOffers = [];

  // Iterate through each partner
  for (let partener of parteneri) {
    // Fetch offers for the current partner
    let oferte = await handleQueryFirestoreSubcollection(
      "Anunturi",
      "collectionId",
      partener.user_uid,
      "tipAnunt",
      "CadruMedical"
    );

    // Calculate distance from the user to the partner
    const distanta = calculateDistance(
      latitude,
      longitude,
      partener.coordonate.lat,
      partener.coordonate.lng
    );

    // Add distance to each offer
    oferte = oferte.map((oferta) => ({
      ...oferta,
      distanta: Math.floor(distanta),
      partener,
    }));

    // Add the fetched offers to the allOffers array
    allOffers = allOffers.concat(oferte);
  }

  // Sort all offers by distance
  allOffers.sort((a, b) => a.distanta - b.distanta);

  return allOffers;
}

// Function to get all offers from partners withOUT distance
export async function getAllOffersWithoutDistance(parteneri) {
  let allOffers = [];

  // Iterate through each partner
  for (let partener of parteneri) {
    // Fetch offers for the current partner
    let oferte = await handleQueryFirestoreSubcollection(
      "Oferte",
      "collectionId",
      partener.user_uid
    );

    // Add distance to each offer
    oferte = oferte.map((oferta) => ({
      ...oferta,
      partener,
    }));

    // Add the fetched offers to the allOffers array
    allOffers = allOffers.concat(oferte);
  }

  // Sort all offers by distance
  allOffers.sort((a, b) => a.distanta - b.distanta);

  return allOffers;
}

const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

export const processParams = (params) => {
  return params.map((param) => {
    // Decodificarea parametrului URI pentru a converti %20 în spații, etc.
    const decodedParam = decodeURIComponent(param);

    // Opțional: Split pe baza unui separator dacă ai nevoie să separi diferite părți
    // Aici folosesc '-' ca exemplu de separator
    return decodedParam.split("-").map((part) => part.trim());
  });
};

// ANUNTURI PAGE QUERY

export const handleGetAnunturiArray = async (t, s, j, l, tA, tP) => {
  let anunturi = [];
  const titulatura = t ?? "";
  const specialitate = s ?? "";
  const judet = j ?? "";
  let localitate = l ?? "";
  const tipAnunt = tA ?? "";
  const tipProgram = tP ?? "";
  let localitateQuery = "localitate";

  if (judet === "Bucuresti") {
    console.log("judet...is...bucuresti and...localitate is....", localitate);
    localitateQuery = "sector";
  }

  console.log("---------------in handleGetAnunturiArray...----------");
  console.log("in handleGetAnunturiArray...", titulatura);
  console.log("in handleGetAnunturiArray...", specialitate);
  console.log("in handleGetAnunturiArray...", judet);
  console.log("in handleGetAnunturiArray...", localitate);
  console.log("in handleGetAnunturiArray...", localitateQuery);
  console.log("in handleGetAnunturiArray...", tipAnunt);
  if (titulatura && judet) {
    if (titulatura === "anunturi") {
      anunturi = await handleQueryFirestoreSubcollection(
        "Anunturi",
        "judet",
        judet
      );
    } else {
      anunturi = await handleQueryFirestoreSubcollection(
        "Anunturi",
        "judet",
        judet,
        "titulatura",
        titulatura
      );
    }
  } else if (titulatura && !judet) {
    if (titulatura === "anunturi") {
      anunturi = await handleGetSubcollections("Anunturi");
    } else {
      anunturi = await handleQueryFirestoreSubcollection(
        "Anunturi",
        "titulatura",
        titulatura
      );
    }
  } else if (!titulatura && judet) {
    anunturi = await handleQueryFirestoreSubcollection(
      "Anunturi",
      "judet",
      judet
    );
  } else {
    anunturi = await handleGetSubcollections("Anunturi");
  }
  console.log("before filter....", anunturi);
  // Filtrarea array-ului `anunturi` pe baza proprietăților doar dacă sunt definite și nu sunt șiruri goale
  anunturi = anunturi.filter((anunt, i) => {
    console.log(`-----------filtrare----------${i}--------`);
    const matchesTipProgram =
      tipProgram && tipProgram !== "" ? anunt.tipProgram === tipProgram : true;
    const matchesTipAnunt =
      tipAnunt && tipAnunt !== "" ? anunt.tipAnunt === tipAnunt : true;
    const matchesLocalitate =
      localitate && localitate !== ""
        ? anunt[localitateQuery] && anunt[localitateQuery] === localitate
        : true;
    const matchesSpecialitate =
      specialitate && specialitate !== ""
        ? anunt.specialitate && anunt.specialitate === specialitate
        : true;
    if (i === 0) {
      console.log(
        "filtrare.tipProgram:",
        anunt.tipProgram,
        "tipProgram:",
        tipProgram,
        "matchesTipProgram:",
        matchesTipProgram
      );
      console.log(
        "filtrare.tipAnunt:",
        anunt.tipAnunt,
        "tipAnunt:",
        tipAnunt,
        "matchesTipAnunt:",
        matchesTipAnunt
      );
      console.log(
        "filtrare.[localitateQuery]:",
        anunt[localitateQuery],
        "localitate:",
        localitate,
        "matchesLocalitate:",
        matchesLocalitate
      );
      console.log(
        "filtrare.specialitate:",
        anunt.specialitate,
        "specialitate:",
        specialitate,
        "matchesSpecialitate:",
        matchesSpecialitate
      );
    }
    return (
      matchesTipProgram &&
      matchesTipAnunt &&
      matchesLocalitate &&
      matchesSpecialitate
    );
  });
  console.log("after filter....", anunturi);
  return anunturi;
};

export const isSameOrAfter = (date1, date2) => {
  return date1.setHours(0, 0, 0, 0) >= date2.setHours(0, 0, 0, 0);
};

export const isSameOrBefore = (date1, date2) => {
  return date1.setHours(0, 0, 0, 0) <= date2.setHours(0, 0, 0, 0);
};

export function calculeazaSiOrdoneazaParteneriDupaDistanta(
  parteneri,
  latitude,
  longitude
) {
  // Adaugă distanța ca o proprietate pentru fiecare partener
  const parteneriCuDistanta = parteneri.map((partener) => {
    const distanta = calculateDistance(
      latitude,
      longitude,
      partener.coordonate.lat,
      partener.coordonate.lng
    );

    return { ...partener, distanta: Math.floor(distanta) };
  });

  // Sortează partenerii după distanță
  const parteneriOrdonati = parteneriCuDistanta.sort(
    (a, b) => a.distanta - b.distanta
  );

  return parteneriOrdonati;
}

const getSubscriptionType = (priceId) => {
  const subscriptionTypes = {
    price_1QD2TFClBW08h64j34gJYL7y: "Basic",
    price_1QD2fzClBW08h64j81fZSAOU: "Pro",
    // Adaugă alte price_id-uri pentru alte planuri
  };

  return subscriptionTypes[priceId] || "Unknown";
};
