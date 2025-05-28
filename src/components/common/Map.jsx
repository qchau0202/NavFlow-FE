import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useState, useEffect } from "react";
import { trafficService } from "../../services/trafficService";

// Fix for default marker icons in React Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const Map = () => {
  const [selectedDestinations, setSelectedDestinations] = useState([]);
  const [cameras, setCameras] = useState([]);
  // If you implement routing, you can use these:
  // const [polylines, setPolylines] = useState([]);
  // const [routeCosts, setRouteCosts] = useState([]);

  // Fetch cameras from backend
  useEffect(() => {
    trafficService
      .getCameras()
      .then((data) => {
        console.log("Fetched cameras:", data);
        setCameras(data);
      })
      .catch((err) => {
        setCameras([]);
        console.error("Failed to fetch cameras:", err);
      });
  }, []);

  const DEFAULT_CENTER = [10.7828, 106.6849]; // District 3, HCMC
  const center = cameras.length > 0 ? cameras[0].coordinates : DEFAULT_CENTER;
  const zoom = 15;

  // Handle selection of start/end
  const handleDestinationSelect = (camera) => {
    setSelectedDestinations((prev) => {
      if (prev.find((dest) => dest.id === camera.id)) {
        return prev.filter((dest) => dest.id !== camera.id);
      }
      if (prev.length >= 2) {
        // Only allow two selections at a time
        return [prev[1], camera];
      }
      return [...prev, camera];
    });
  };

  return (
    <div className="h-full w-full relative">
      {/* Side Panel */}
      <div className="absolute left-4 top-4 z-[1000] bg-white rounded-lg shadow-lg p-4 w-64">
        <h3 className="text-lg font-semibold mb-4">Select Destinations</h3>
        <div className="space-y-2 max-h-[calc(100vh-200px)] overflow-y-auto">
          {cameras.map((camera) => (
            <div
              key={camera.id}
              className={`p-2 rounded cursor-pointer transition-colors ${
                selectedDestinations.find((dest) => dest.id === camera.id)
                  ? "bg-blue-100 border border-blue-500"
                  : "hover:bg-gray-100 border border-transparent"
              }`}
              onClick={() => handleDestinationSelect(camera)}
            >
              <p className="font-medium">{camera.name}</p>
              <p className="text-sm text-gray-600">Status: {camera.status}</p>
            </div>
          ))}
        </div>
        {/* If you implement routing, you can show routeCosts here */}
      </div>

      <MapContainer
        center={center}
        zoom={zoom}
        style={{ height: "100%", width: "100%" }}
        scrollWheelZoom={true}
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />

        {cameras.map((camera) => (
          <Marker
            key={camera.id}
            position={camera.coordinates}
            eventHandlers={{
              click: () => handleDestinationSelect(camera),
            }}
          >
            <Popup>
              <div>
                <h4>{camera.name}</h4>
                <p>Status: {camera.status}</p>
                <p>Coordinates: {camera.coordinates.join(", ")}</p>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* If you implement routing, you can render polylines here */}
        {/* {polylines.map((coords, idx) => (
          <Polyline
            key={idx}
            positions={coords}
            color={idx === 0 ? "#3388ff" : "#aaa"}
            weight={idx === 0 ? 5 : 3}
            opacity={idx === 0 ? 0.9 : 0.5}
          />
        ))} */}
      </MapContainer>
    </div>
  );
};

export default Map;
