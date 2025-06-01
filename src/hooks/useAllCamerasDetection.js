import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import axios from "axios";

const API_BASE_URL = "http://localhost:8000/api/v1/traffic";

export const useAllCamerasDetection = () => {
  const [cameras, setCameras] = useState([]);
  const [detectionResults, setDetectionResults] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const pollingInterval = useRef(null);

  // Fetch all cameras
  const fetchCameras = useCallback(async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/cameras`);
      setCameras(response.data);
    } catch (err) {
      console.error("Error fetching cameras:", err);
      setError("Failed to fetch cameras");
    }
  }, []);

  // Start detection for all cameras
  const startAllDetections = useCallback(async () => {
    if (cameras.length === 0) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Start detection for each camera
      const startPromises = cameras.map((camera) =>
        axios.post(`${API_BASE_URL}/detection/start/${camera.id}`)
      );
      await Promise.all(startPromises);

      // Start polling for results
      pollingInterval.current = setInterval(async () => {
        try {
          const results = {};
          for (const camera of cameras) {
            const response = await axios.get(
              `${API_BASE_URL}/detection/stats/${camera.id}`
            );
            results[camera.id] = response.data;
          }
          setDetectionResults(results);
        } catch (err) {
          console.error("Error polling detection results:", err);
        }
      }, 10000); // Poll every 10 seconds
    } catch (err) {
      setError("Failed to start detections");
    } finally {
      setIsLoading(false);
    }
  }, [cameras]);

  // Stop detection for all cameras
  const stopAllDetections = useCallback(async () => {
    if (cameras.length === 0) {
      return;
    }

    try {
      // Stop detection for each camera
      const stopPromises = cameras.map((camera) =>
        axios.post(`${API_BASE_URL}/detection/stop/${camera.id}`)
      );
      await Promise.all(stopPromises);

      // Clear polling interval
      if (pollingInterval.current) {
        clearInterval(pollingInterval.current);
        pollingInterval.current = null;
      }

      // Reset detection results
      setDetectionResults({});
    } catch (err) {
      console.error("Error stopping detections:", err);
      setError("Failed to stop detections");
    }
  }, [cameras]);

  // Aggregated statistics (useMemo)
  const aggregatedStats = useMemo(() => {
    if (Object.keys(detectionResults).length === 0) {
      return null;
    }

    const stats = {
      totalFullness: 0,
      totalFlowRate: 0,
      totalVehicles: 0,
      vehicleTypes: {},
      detections: [],
      timestamps: [],
      confidenceScores: [],
    };

    Object.values(detectionResults).forEach((result) => {
      stats.totalFullness += result.fullness || 0;
      stats.totalFlowRate += result.flow_rate || 0;
      stats.totalVehicles += result.total_vehicles || 0;
      stats.timestamps.push(result.timestamp);

      // Calculate vehicle types and confidence from detections
      if (result.detections) {
        result.detections.forEach((det) => {
          const label = det.label || "Unknown";
          stats.vehicleTypes[label] = (stats.vehicleTypes[label] || 0) + 1;
          if (det.confidence !== undefined) {
            stats.confidenceScores.push(det.confidence);
          }
        });
        stats.detections.push(...result.detections);
      }
    });

    const cameraCount = Object.keys(detectionResults).length;
    const avgConfidence =
      stats.confidenceScores.length > 0
        ? stats.confidenceScores.reduce((a, b) => a + b, 0) /
          stats.confidenceScores.length
        : 0;

    const aggregated = {
      fullness: stats.totalFullness / cameraCount,
      flow_rate: stats.totalFlowRate / cameraCount,
      total_vehicles: stats.totalVehicles,
      vehicle_types: stats.vehicleTypes,
      average_confidence: avgConfidence,
      timestamp: new Date(
        Math.max(...stats.timestamps.map((t) => new Date(t)))
      ),
      detections: stats.detections.slice(0, 10), // Keep only 10 most recent detections
      camera_count: cameraCount,
    };

    return aggregated;
  }, [detectionResults]);

  // Initialize cameras on mount
  useEffect(() => {
    fetchCameras();
    return () => {
      if (pollingInterval.current) {
        clearInterval(pollingInterval.current);
      }
    };
  }, [fetchCameras]);

  return {
    cameras,
    detectionResults,
    isLoading,
    error,
    startAllDetections,
    stopAllDetections,
    aggregatedStats,
  };
};

export const useAggregatedStats = () => {
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let interval = setInterval(async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/aggregated-stats`);
        setStats(res.data);
        setIsLoading(false);
      } catch (err) {
        console.error("Failed to fetch stats:", err);
        setError("Failed to fetch stats");
        setIsLoading(false);
      }
    }, 10000); // poll every 10s

    // Fetch immediately on mount
    (async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/aggregated-stats`);
        setStats(res.data);
        setIsLoading(false);
      } catch (err) {
        console.error("Failed to fetch stats:", err);
        setError("Failed to fetch stats");
        setIsLoading(false);
      }
    })();

    return () => clearInterval(interval);
  }, []);

  return { stats, isLoading, error };
};
