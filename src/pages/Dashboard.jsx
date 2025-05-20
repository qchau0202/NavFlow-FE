import React, { useState, useEffect } from "react";
import { trafficService } from "../services/trafficService";

const Dashboard = () => {
  const [cameras, setCameras] = useState([]);
  const [selectedCamera, setSelectedCamera] = useState(null);
  const [detectionImage, setDetectionImage] = useState(null);
  const [stats, setStats] = useState(null);
  const [error, setError] = useState(null);

  // Fetch cameras on component mount
  useEffect(() => {
    const fetchCameras = async () => {
      try {
        const cameraList = await trafficService.getCameras();
        setCameras(cameraList);
        if (cameraList.length > 0) {
          setSelectedCamera(cameraList[0]);
        }
      } catch (_) {
        setError("Failed to fetch cameras");
      }
    };
    fetchCameras();
  }, []);

  // Fetch detection image and stats when camera is selected
  useEffect(() => {
    if (!selectedCamera) return;

    const fetchData = async () => {
      try {
        // Fetch detection image
        const { imageUrl } = await trafficService.getDetectionImage(
          selectedCamera
        );
        setDetectionImage(imageUrl);

        // Fetch stats
        const statsData = await trafficService.getTrafficStats(selectedCamera);
        setStats(statsData);
      } catch (_) {
        setError("Failed to fetch detection data");
      }
    };

    fetchData();
    // Update every 5 seconds
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, [selectedCamera]);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Traffic Detection Dashboard</h1>

      {/* Camera Selection */}
      <div className="mb-4">
        <label className="block mb-2">Select Camera:</label>
        <select
          value={selectedCamera || ""}
          onChange={(e) => setSelectedCamera(e.target.value)}
          className="border p-2 rounded"
        >
          {cameras.map((camera) => (
            <option key={camera} value={camera}>
              {camera}
            </option>
          ))}
        </select>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Detection Results */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Detection Image */}
        <div className="border rounded p-4">
          <h2 className="text-xl font-semibold mb-2">Live Detection</h2>
          {detectionImage && (
            <img
              src={detectionImage}
              alt="Traffic Detection"
              className="w-full rounded"
            />
          )}
        </div>

        {/* Statistics */}
        <div className="border rounded p-4">
          <h2 className="text-xl font-semibold mb-2">Traffic Statistics</h2>
          {stats && (
            <div>
              <p>Road Fullness: {stats.fullness.toFixed(2)}%</p>
              <p>Total Vehicles: {stats.total_vehicles}</p>
              <h3 className="font-semibold mt-2">Detections:</h3>
              <ul>
                {stats.detections.map((det, index) => (
                  <li key={index}>
                    {det.label}: {det.confidence.toFixed(2)}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
