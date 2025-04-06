import React, { useRef, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";


// Icons for trains that are moving or stopped
const markerIconMoving = L.icon({
    iconUrl: '/mapMarkerMoving.png',
    iconSize: [25, 30],
    iconAnchor: [15, 35],
    popupAnchor: [-2, -35],
});

const markerIconStopped = L.icon({
    iconUrl: '/mapMarkerStopped.png',
    iconSize: [45, 45],
    iconAnchor: [15, 40],
    popupAnchor: [7, -32],
});

const TrainLocation = ({ trains, metadata, fetchMetadata, selectedTrain, setSelectedTrain }) => {
    const mapRef = useRef(); // A ref to access the instance of the map
    const markerRefMap = useRef({}); // for stroing the references of the train marker
    const [searchInput, setSearchInput] = useState(""); // State for managing search input

    // Searches for a train and it updates the state of the selectedTrain
    const handleSearch = async () => {
        const train = trains.find(t => t.trainNumber.toString() === searchInput);
        if (train) {
            const trainMeta = await fetchMetadata(train.trainNumber);
            setSelectedTrain(trainMeta || train);

            const marker = markerRefMap.current[train.trainNumber];
            if (marker) {
                marker.openPopup();
            }

            setSearchInput(""); // Clear the search bar
        } 
        else {
            alert("Train not found!");
            setSearchInput("")
        }
    };

    const trainMarkers = () => {
        return trains.map((train, index) => {
            const { trainNumber, latitude, longitude, speed } = train;
            if (!latitude || !longitude) return null; //Omits the coordinates that are not valid

            const trainMeta = metadata[trainNumber];
            const markerIcon = speed > 0 ? markerIconMoving : markerIconStopped;

            return (
                <Marker
                    key={`${trainNumber}-${index}`}
                    position={[latitude, longitude]}
                    icon={markerIcon}
                    eventHandlers={{
                        click: async () => {
                            const trainMeta = await fetchMetadata(trainNumber);
                            setSelectedTrain(trainMeta || { trainNumber, speed });
                        }
                    }}
                    ref={(marker) => markerRefMap.current[trainNumber] = marker}
                >
                    <Popup>
                        <strong>Train Number:</strong> {trainNumber} <br />
                        <strong>Speed:</strong> {speed} km/h <br />
                        <strong>Category:</strong> {trainMeta?.trainCategory || 'Loading...'} <br />
                        <strong>Type:</strong> {trainMeta?.trainType || 'Loading...'}
                    </Popup>
                </Marker>
            );
        });
    };

    return (
        <div className="train-location-container">
            <div className="sidebar">
                <div className="search-container">
                    <input
                        type="text"
                        placeholder="Search Train Number"
                        className="search-input"
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                handleSearch();
                            }
                        }}
                    />
                    <button
                        className="search-button"
                        onClick={handleSearch}
                    >
                        Search
                    </button>
                </div>
                {selectedTrain ? (
                    <div className="train-details">
                        <h2 className="train-details-title">Train Details</h2>
                        <p><strong>Train Number:</strong> {selectedTrain.trainNumber}</p>
                        <p><strong>Speed:</strong> {selectedTrain.speed} km/h</p>
                        <p><strong>Category:</strong> {selectedTrain.trainCategory || 'Loading...'}</p>
                        <p><strong>Type:</strong> {selectedTrain.trainType || 'Loading...'}</p>
                        <h2 className="train-details-title">More Information</h2>
                        <div className="train-info">
                            <strong>Departure:</strong>
                            <div className="train-info-details">
                                <p><strong>Station:</strong> {selectedTrain.departureStation || 'Loading...'}</p>
                                <p><strong>Time:</strong> {selectedTrain.departureTime || 'Loading...'}</p>
                                <p><strong>Track:</strong> {selectedTrain.departureTrack || 'Loading...'}</p>
                            </div>
                        </div>
                        <div className="train-info">
                            <strong>Destination:</strong>
                            <div className="train-info-details">
                                <p><strong>Station:</strong> {selectedTrain.destinationStation || 'Loading...'}</p>
                                <p><strong>Time:</strong> {selectedTrain.destinationTime || 'Loading...'}</p>
                                <p><strong>Track:</strong> {selectedTrain.destinationTrack || 'Loading...'}</p>
                            </div>
                        </div>
                    </div>
                ) : (
                    <p className="select-train-message">Select a train to see more details</p>
                )}
            </div>
            <div className="map-container">
                <MapContainer
                    center={[64.2426, 26.7473]}
                    zoom={5}
                    style={{ height: '100%', width: '100%' }}
                    whenCreated={(mapInstance) => mapRef.current = mapInstance}
                >
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution="&copy; OpenStreetMap contributors"
                    />
                    {trainMarkers()}
                </MapContainer>
            </div>
        </div>
    );
};

export default TrainLocation;