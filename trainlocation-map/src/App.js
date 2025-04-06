import React, { useState, useEffect, useCallback } from "react";
import "./App.css";
import TrainLocation from "./components/TrainLocation";

const App = () => {
  const [trains, setTrains] = useState([]);
  const [trainMetadataMap, setTrainMetadataMap] = useState({});
  const [selectedTrain, setSelectedTrain] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Fetches the train location data from the Digitraffic API
  const fetchTrainData = useCallback(async () => {
    try {
      const res = await fetch(
        "https://rata.digitraffic.fi/api/v1/train-locations.geojson/latest/"
      );
      const data = await res.json();
      //Transforms the response of the API into a format that is easier to use
      const trainLocations = (data.features || []).map((feature) => ({
        trainNumber: feature.properties.trainNumber,
        latitude: feature.geometry.coordinates[1],
        longitude: feature.geometry.coordinates[0],
        speed: feature.properties.speed,
      }));

      setTrains(trainLocations);
      setIsLoaded(true);
    } 
    catch (error) {
    }
  }, []);

  useEffect(() => {
    fetchTrainData(); // Initial fetch
    const interval = setInterval(fetchTrainData, 10000); // Auto updates every 10 seconds to avoid fetching more than the possible amount for the api (max 50 per 5 mins)
    return () => clearInterval(interval); // Clean up on unmount
  }, [fetchTrainData]);

  //This keeps the details updated of the selected train with livde data
  useEffect(() => {
    if (selectedTrain) {
      const updated = trains.find(
        (t) => t.trainNumber === selectedTrain.trainNumber
      );
      if (updated && selectedTrain.speed !== updated.speed) {
        setSelectedTrain((prev) => ({
          ...prev,
          speed: updated.speed,
        }));
      }
    }
  }, [selectedTrain, trains]);

  //Fetch additional metadata for a given train
  const fetchTrainMetaData = useCallback(
    async (trainNumber) => {
      if (trainMetadataMap[trainNumber]) {
        return trainMetadataMap[trainNumber];
      }

      try {
        const res = await fetch(
          `https://rata.digitraffic.fi/api/v1/trains/latest/${trainNumber}`
        );
        const metaArray = await res.json();

        if (metaArray.length > 0) {
          const meta = metaArray[0];
          const timeTableRows = meta.timeTableRows || [];

          const departure = timeTableRows[0] || {};
          const destination = timeTableRows[timeTableRows.length - 1] || {};

          const convertToLocalTime = (utcTime) => {
            const date = new Date(utcTime);
            return date.toLocaleString("en-GB", {
              day: "numeric",
              month: "numeric",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
              hour23: true,
            });
          };

          const extendedMeta = {
            ...meta,
            departureStation: departure.stationShortCode,
            departureTime: convertToLocalTime(departure.scheduledTime),
            departureTrack: departure.commercialTrack,
            destinationStation: destination.stationShortCode,
            destinationTime: convertToLocalTime(destination.scheduledTime),
            destinationTrack: destination.commercialTrack,
          };

          setTrainMetadataMap((prev) => ({
            ...prev,
            [trainNumber]: extendedMeta,
          }));

          return extendedMeta;
        }
      } 
      catch (error) {
      }

      return null;
    },
    [trainMetadataMap]
  );

  const handleSelectTrain = async (train) => {
    const meta = await fetchTrainMetaData(train.trainNumber);
    const liveData = trains.find((t) => t.trainNumber === train.trainNumber);
    setSelectedTrain({
      ...meta,
      ...liveData,
    });
  };

  if (!isLoaded) {
    return (
      <div>
        <h1>Retrieving data...</h1>
      </div>
    );
  }

  return (
    <div className="App">
      <h1>Live Train Location</h1>
      <TrainLocation
        trains={trains}
        metadata={trainMetadataMap}
        fetchMetadata={fetchTrainMetaData}
        selectedTrain={selectedTrain}
        setSelectedTrain={handleSelectTrain}
      />
    </div>
  );
};

export default App;