import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useRef } from "react";
import { Spin } from "antd";
import { FiTrendingUp, FiTrendingDown } from "react-icons/fi";
import TrafficSummary from "../statistics/TrafficSummary";
import VehicleCount from "../statistics/VehicleCount";
import TimeAnalysis from "../statistics/TimeAnalysis";
import DetectionQuality from "../statistics/DetectionQuality";
import RecentDetections from "../statistics/RecentDetections";
import Insights from "../statistics/Insights";
import { useAggregatedStats } from "../../hooks/useAllCamerasDetection";
import { useCameras } from "../../hooks/useCameras";

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

const Map = () => {
  const mapRef = useRef(null);
  const DEFAULT_CENTER = [10.7828, 106.6849]; // District 3, HCMC
  const zoom = 15;

  // Use backend-aggregated stats
  const {
    stats: aggregatedStats,
    isLoading: statsLoading,
    error: statsError,
  } = useAggregatedStats();
  const {
    cameras,
    isLoading: camerasLoading,
    error: camerasError,
  } = useCameras();

  // Add a useMapEvents for left-click (if needed for future features)
  const MapLeftClickHandler = () => {
    useMapEvents({ click: () => {} });
    return null;
  };

  const getDensityLevel = (fullness) => {
    if (fullness >= 80) {
      return { level: "High", color: "text-red-500" };
    } else if (fullness >= 50) {
      return { level: "Medium", color: "text-yellow-500" };
    } else {
      return { level: "Low", color: "text-green-500" };
    }
  };

  const getTrendIcon = (vehicleChange) => {
    return vehicleChange > 0 ? (
      <FiTrendingUp className="text-red-500" />
    ) : (
      <FiTrendingDown className="text-green-500" />
    );
  };

  return (
    <div className="h-full w-full relative">
      {/* Side Panel */}
      <div className="absolute left-4 top-4 z-[1000] w-96 flex flex-col gap-4">
        <div className="bg-white rounded-lg shadow-lg p-4">
          <h3 className="text-lg font-semibold mb-4">
            Traffic Status Overview
          </h3>

          {statsLoading ? (
            <div className="flex justify-center items-center py-8">
              <Spin size="large" />
            </div>
          ) : statsError ? (
            <div className="text-red-500 text-center py-4">{statsError}</div>
          ) : !aggregatedStats || Object.keys(aggregatedStats).length === 0 ? (
            <div className="text-gray-500 text-center py-4">
              No traffic data available
            </div>
          ) : (
            <TrafficSummary stats={aggregatedStats} />
          )}
        </div>
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
        {camerasLoading ? (
          <></>
        ) : camerasError ? (
          <Popup position={DEFAULT_CENTER}>
            <span>{camerasError}</span>
          </Popup>
        ) : (
          cameras.map((camera) => (
            <Marker
              key={camera.id}
              position={camera.coordinates}
              icon={createCameraIcon()}
            >
              <Popup>
                <div>
                  <h4 className="font-semibold">{camera.name}</h4>
                  <p className="text-sm text-gray-600">
                    Status: {camera.status}
                  </p>
                  <p className="text-sm text-gray-600">
                    Coordinates: {camera.coordinates.join(", ")}
                  </p>
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
