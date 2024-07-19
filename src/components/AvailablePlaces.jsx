import { useState, useEffect } from "react";
import Places from "./Places.jsx";
import Error from "./Error.jsx";
import { sortPlacesByDistance } from "../loc.js";
import { fetchAvailablePlaces } from "../http.js";

export default function AvailablePlaces({ onSelectPlace }) {
  const [isFetching, setIsFetching] = useState(false);
  const [availablePlaces, setAvailablePlaces] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchPlaces() {
      setIsFetching(true);

      try {
        const placesHttp = await fetchAvailablePlaces();

        navigator.geolocation.getCurrentPosition((position) => {
          const sortedPlaces = sortPlacesByDistance(
            placesHttp,
            position.coords.latitude,
            position.coords.longitude
          );
          setAvailablePlaces(sortedPlaces);
          setIsFetching(false);
        });
      } catch (error) {
        setError({ message: error.message || "Could note fetch places" });
        setIsFetching(false);
      }
    }
    fetchPlaces();
  }, []);

  if (error) {
    return <Error title="An error occurred" message={error.message} />;
  }
  return (
    <Places
      title="Available Places"
      places={availablePlaces}
      isLoading={isFetching}
      loadingText="Fetching data"
      fallbackText="No places available."
      onSelectPlace={onSelectPlace}
    />
  );
}
