import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import cameraLocations from "../../mock-data/camera_locations";
import { useState, useEffect } from "react";
import { routingService } from "../../services";
import { Polyline } from "react-leaflet";

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
  const [polylines, setPolylines] = useState([]);
  const [routeCosts, setRouteCosts] = useState([]);
  const center = cameraLocations[0].coordinates;
  const zoom = 15;

  // Map camera id to coordinates
  const idToCoord = Object.fromEntries(
    cameraLocations.map((cam) => [cam.id.toString(), cam.coordinates])
  );

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

  // Fetch routes when two destinations are selected
  useEffect(() => {
    const fetchRoutes = async () => {
      if (selectedDestinations.length === 2) {
        try {
          const data = await routingService.getRoutes(
            selectedDestinations[0].id.toString(),
            selectedDestinations[1].id.toString(),
            3
          );
          const polylines = data.paths.map((path) =>
            path.map((id) => idToCoord[id])
          );
          console.log("API data:", data);
          console.log("Polylines to set:", polylines);
          setPolylines(polylines);
          setRouteCosts(data.costs);
        } catch (err) {
          console.error(err);
          setPolylines([]);
          setRouteCosts([]);
        }
      } else {
        setPolylines([]);
        setRouteCosts([]);
      }
    };
    fetchRoutes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDestinations]);

  return (
    <div className="h-full w-full relative">
      {/* Side Panel */}
      <div className="absolute left-4 top-4 z-[1000] bg-white rounded-lg shadow-lg p-4 w-64">
        <h3 className="text-lg font-semibold mb-4">Select Destinations</h3>
        <div className="space-y-2 max-h-[calc(100vh-200px)] overflow-y-auto">
          {cameraLocations.map((camera) => (
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
        {routeCosts.length > 0 && (
          <div className="mt-4">
            <h4 className="font-semibold mb-2">Route Options:</h4>
            {routeCosts.map((cost, idx) => (
              <div key={idx} className="text-sm text-gray-700">
                Path {idx + 1}: {cost.toFixed(2)} km
              </div>
            ))}
          </div>
        )}
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

        {cameraLocations.map((camera) => (
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

        {/* Draw polylines for each route */}
        {console.log("Polylines:", polylines)}
        {polylines.map((coords, idx) => (
          <Polyline
            key={idx}
            positions={coords}
            color={idx === 0 ? "#3388ff" : "#aaa"}
            weight={idx === 0 ? 5 : 3}
            opacity={idx === 0 ? 0.9 : 0.5}
          />
        ))}
      </MapContainer>
    </div>
  );
};

export default Map;
