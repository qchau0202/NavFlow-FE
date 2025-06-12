import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useRef, useState } from "react";
import { Spin } from "antd";
import TrafficSummary from "../statistics/TrafficSummary";
import { aggregateTrafficStats, getDensityLevel } from "../../utils/statistics";
import {
  FiTrendingUp,
  FiTrendingDown,
  FiMenu,
  FiChevronLeft,
} from "react-icons/fi";
import {
  MdOutlineDirectionsCar,
  MdTwoWheeler,
  MdLocalShipping,
  MdPedalBike,
  MdBusAlert,
} from "react-icons/md";

// Custom camera icon
const createCameraIcon = () => {
  const svg = `
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="2" y="7" width="15" height="10" rx="2" fill="#e53e3e"/>
      <path d="M19 9L22 7V17L19 15V9Z" fill="#e53e3e"/>
      <rect x="4" y="9" width="11" height="6" rx="1" fill="white" fill-opacity="0.2"/>
    </svg>
  `;
  return L.divIcon({
    className: "custom-camera-icon",
    html: svg,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });
};

// Highlighted camera icon for highest congestion
const createHighlightedCameraIcon = () => {
  const svg = `
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="2" y="9" width="22" height="14" rx="3" fill="#f59e42" stroke="#d97706" stroke-width="2"/>
      <path d="M27 12L31 9V23L27 20V12Z" fill="#f59e42" stroke="#d97706" stroke-width="2"/>
      <rect x="5" y="12" width="16" height="8" rx="2" fill="white" fill-opacity="0.3"/>
      <circle cx="13" cy="16" r="3" fill="#d97706" />
    </svg>
  `;
  return L.divIcon({
    className: "custom-camera-icon highlighted",
    html: svg,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  });
};

// Helper to get the camera with the highest congestion rate (fullness)
const getHighestCongestionCamera = (detectionResults) => {
  if (!detectionResults || typeof detectionResults !== "object") return null;
  let maxFullness = -1;
  let maxCameraId = null;
  Object.entries(detectionResults).forEach(([id, s]) => {
    if (
      s &&
      typeof s.fullness === "number" &&
      !isNaN(s.fullness) &&
      s.fullness > maxFullness
    ) {
      maxFullness = s.fullness;
      maxCameraId = id;
    }
  });
  return maxCameraId;
};

// Helper to get vehicle icon by type
const getVehicleIcon = (type) => {
  switch ((type || "").toLowerCase()) {
    case "car":
      return (
        <MdOutlineDirectionsCar className="inline text-lg align-text-bottom" />
      );
    case "motorbike":
      return <MdTwoWheeler className="inline text-lg align-text-bottom" />;
    default:
      return (
        <MdOutlineDirectionsCar className="inline text-gray-400 text-lg align-text-bottom" />
      );
  }
};

const Map = ({ cameras, detectionResults, isLoading, error }) => {
  const mapRef = useRef(null);
  const DEFAULT_CENTER = [10.7828, 106.6849]; // District 3, HCMC
  const zoom = 15;
  const summaryStats = aggregateTrafficStats(detectionResults);
  const [panelMinimized, setPanelMinimized] = useState(false);
  // Add a useMapEvents for left-click (if needed for future features)
  const MapLeftClickHandler = () => {
    useMapEvents({ click: () => {} });
    return null;
  };

  // Find the camera ID with the highest congestion
  const highestCongestionCameraId =
    getHighestCongestionCamera(detectionResults);

  return (
    <div className="h-full w-full relative">
      {/* Side Panel */}
      <div className="absolute left-4 top-4 z-[1000] flex flex-col gap-4">
        {panelMinimized ? (
          <button
            className="bg-white rounded-full shadow-lg p-3 flex items-center justify-center hover:bg-gray-100 transition"
            onClick={() => setPanelMinimized(false)}
            title="Show traffic panel"
          >
            <FiMenu className="text-2xl text-gray-700" />
          </button>
        ) : (
          <div className="bg-white rounded-lg shadow-lg p-4 w-96 relative">
            <button
              className="absolute top-2 right-2 p-1 rounded-full hover:bg-gray-200 transition"
              onClick={() => setPanelMinimized(true)}
              title="Minimize"
            >
              <FiChevronLeft className="text-xl text-gray-500" />
            </button>
            <h3 className="text-lg font-semibold mb-2">
              Traffic Status Overview
            </h3>
            {isLoading ? (
              <div className="flex justify-center items-center py-8">
                <Spin size="large" />
              </div>
            ) : error ? (
              <div className="text-red-500 text-center py-4">{error}</div>
            ) : !summaryStats ? (
              <div className="text-gray-500 text-center py-4">
                No traffic data available
              </div>
            ) : (
              <TrafficSummary
                stats={summaryStats}
                perCameraStats={detectionResults}
              />
            )}
          </div>
        )}
      </div>

      <MapContainer
        center={DEFAULT_CENTER}
        zoom={zoom}
        style={{ height: "100%", width: "100%" }}
        scrollWheelZoom={true}
        zoomControl={false}
        whenCreated={(mapInstance) => {
          mapRef.current = mapInstance;
        }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />
        <MapLeftClickHandler />
        {/* Display cameras */}
        {isLoading ? (
          <></>
        ) : error ? (
          <Popup position={DEFAULT_CENTER}>
            <span>{error}</span>
          </Popup>
        ) : (
          cameras.map((camera) => (
            <Marker
              key={camera.id}
              position={camera.coordinates}
              icon={
                camera.id === highestCongestionCameraId
                  ? createHighlightedCameraIcon()
                  : createCameraIcon()
              }
            >
              <Popup>
                <div className="p-2 flex flex-col gap-4">
                  <div
                    className="font-extrabold text-xl text-gray-900 mb-1 truncate"
                    title={camera.name}
                  >
                    {camera.name}
                  </div>
                  <div className="flex flex-wrap gap-2 mb-1">
                    {/* Status tag */}
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-bold uppercase tracking-wide ${
                        camera.status === "active"
                          ? "bg-green-100 text-green-700 border border-green-300"
                          : "bg-gray-200 text-gray-500 border border-gray-300"
                      }`}
                    >
                      {camera.status}
                    </span>

                    {/* Most common vehicle tag with icon and label */}
                    {detectionResults?.[camera.id] &&
                      (() => {
                        const types =
                          detectionResults[camera.id].vehicle_types || {};
                        const mostCommon = Object.entries(types).sort(
                          (a, b) => b[1] - a[1]
                        )[0]?.[0];
                        return mostCommon ? (
                          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-700 border border-blue-200 flex items-center gap-1">
                            {getVehicleIcon(mostCommon)}
                            <span className="ml-1">
                              {mostCommon.charAt(0).toUpperCase() +
                                mostCommon.slice(1)}
                            </span>
                          </span>
                        ) : null;
                      })()}
                    {/* Congestion tag */}
                    {detectionResults?.[camera.id] &&
                      (() => {
                        const { fullness } = detectionResults[camera.id];
                        const congestion = getDensityLevel(fullness || 0);
                        return (
                          <span
                            className={`px-2 py-0.5 rounded-full text-xs font-bold flex items-center gap-1 border ${congestion.color} bg-gray-100 border-gray-200`}
                          >
                            <span className={congestion.color}>
                              {congestion.level}
                            </span>
                            {congestion.level === "Low" ? (
                              <FiTrendingDown className={congestion.color} />
                            ) : (
                              <FiTrendingUp className={congestion.color} />
                            )}
                          </span>
                        );
                      })()}
                  </div>
                  <div className="flex flex-col gap-1 text-base text-gray-700">
                    <div className="flex flex-col">
                      <span className="font-semibold">Coordinates:</span>{" "}
                      <span className="font-mono">
                        {camera.coordinates.join(", ")}
                      </span>
                    </div>
                    {detectionResults?.[camera.id] && (
                      <div className="flex justify-between items-center">
                        <div>
                          <span className="font-semibold">Vehicles:</span>{" "}
                          <span className="font-extrabold text-gray-900">
                            {detectionResults[camera.id].total_vehicles}
                          </span>
                        </div>
                        <div>
                          <span className="font-semibold">Fullness:</span>{" "}
                          <span className="font-extrabold text-gray-900">
                            {detectionResults[camera.id].fullness?.toFixed(1) ??
                              "N/A"}
                            %
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </Popup>
            </Marker>
          ))
        )}
      </MapContainer>
    </div>
  );
};

export default Map;
