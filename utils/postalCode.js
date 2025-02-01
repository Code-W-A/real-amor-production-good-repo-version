export const fetchPostalCodeData = async (postalCode) => {
  try {
    setLoading(true);
    const response = await fetch(
      `http://api.zippopotam.us/${currentQuestion.api.params.country}/${postalCode}`
    );
    if (!response.ok) {
      throw new Error("Cod poștal invalid.");
    }
    const data = await response.json();

    // Maparea răspunsului conform specificațiilor
    const mappedResponse = {
      postalCode: data[currentQuestion.api.responseMapping.postalCode],
      city: eval(currentQuestion.api.responseMapping.city), // Extragem orașul
    };

    setApiResponse(mappedResponse);
    setSelectedOptions((prev) => ({
      ...prev,
      [currentQuestion.id]: mappedResponse,
    }));
    console.log("Răspuns API:", mappedResponse);
  } catch (error) {
    console.error("Eroare API:", error.message);
    alert("Cod poștal invalid. Vă rugăm să încercați din nou.");
  } finally {
    setLoading(false);
  }
};
