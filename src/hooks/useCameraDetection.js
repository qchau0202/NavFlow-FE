import { useState, useCallback, useRef, useEffect } from "react";
import axios from "axios";

const API_BASE_URL = "http://localhost:8000/api/v1";
const IMAGE_UPDATE_INTERVAL = 10000; // 10 seconds
const STATS_UPDATE_INTERVAL = 5000; // 5 seconds

export const useCameraDetection = () => {
  const [cameras, setCameras] = useState([]);
  const [activeDetections, setActiveDetections] = useState({});
  const [detectionResults, setDetectionResults] = useState({});
  const [selectedCamera, setSelectedCamera] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [isImageLoading, setIsImageLoading] = useState(false);
  const [statsError, setStatsError] = useState(null);
  const intervalsRef = useRef({});

  // Fetch cameras on mount
  useEffect(() => {
    const fetchCameras = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/traffic/cameras`);
        setCameras(response.data);
      } catch (error) {
        console.error("Error fetching cameras:", error);
      }
    };
    fetchCameras();
  }, []);

  const stopDetection = useCallback(async (cameraId) => {
    try {
      await axios.post(`${API_BASE_URL}/traffic/detection/stop/${cameraId}`);
      setActiveDetections((prev) => {
        const newState = { ...prev };
        delete newState[cameraId];
        return newState;
      });

      if (intervalsRef.current[cameraId]) {
        clearInterval(intervalsRef.current[cameraId]);
        delete intervalsRef.current[cameraId];
      }

      setDetectionResults((prev) => {
        const newResults = { ...prev };
        delete newResults[cameraId];
        return newResults;
      });
      setStatsError(null);
    } catch (error) {
      console.error("Error stopping detection:", error);
      setStatsError("Failed to stop detection");
    }
  }, []);

  // Stop detection when no camera is selected
  useEffect(() => {
    if (!selectedCamera && Object.keys(activeDetections).length > 0) {
      const activeCamera = Object.keys(activeDetections)[0];
      stopDetection(activeCamera);
    }
  }, [selectedCamera, activeDetections, stopDetection]);

  const updateImage = useCallback(async () => {
    if (!selectedCamera) return;

    try {
      setIsImageLoading(true);
      const response = await fetch(
        `${API_BASE_URL}/traffic/detection/stream/${selectedCamera}?t=${Date.now()}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch image");
      }
      setImageUrl(
        `${API_BASE_URL}/traffic/detection/stream/${selectedCamera}?t=${Date.now()}`
      );
    } catch (error) {
      console.error("Error fetching image:", error);
      setIsImageLoading(false);
    }
  }, [selectedCamera]);

  // Update image for selected camera
  useEffect(() => {
    let imageInterval;

    if (selectedCamera && activeDetections[selectedCamera]) {
      updateImage();
      imageInterval = setInterval(updateImage, IMAGE_UPDATE_INTERVAL);
    } else {
      setImageUrl("");
      setIsImageLoading(false);
    }

    return () => {
      if (imageInterval) {
        clearInterval(imageInterval);
      }
    };
  }, [selectedCamera, activeDetections, updateImage]);

  const startDetection = async (cameraId) => {
    try {
      if (Object.keys(activeDetections).length > 0) {
        const currentCamera = Object.keys(activeDetections)[0];
        await stopDetection(currentCamera);
      }

      await axios.post(`${API_BASE_URL}/traffic/detection/start/${cameraId}`);
      setActiveDetections({ [cameraId]: true });
      setStatsError(null);

      // Clear any existing intervals
      if (intervalsRef.current[cameraId]) {
        clearInterval(intervalsRef.current[cameraId]);
      }

      // Start polling for stats
      intervalsRef.current[cameraId] = setInterval(async () => {
        try {
          const response = await axios.get(
            `${API_BASE_URL}/traffic/detection/stats/${cameraId}`
          );
          const stats = response.data;

          // Process and enhance the stats data
          const processedStats = {
            ...stats,
            timestamp: new Date().toISOString(),
            vehicle_types: stats.detections.reduce((acc, det) => {
              acc[det.label] = (acc[det.label] || 0) + 1;
              return acc;
            }, {}),
            average_confidence:
              stats.detections.reduce((acc, det) => acc + det.confidence, 0) /
              (stats.detections.length || 1),
          };

          setDetectionResults((prev) => ({
            ...prev,
            [cameraId]: processedStats,
          }));
          setStatsError(null);
        } catch (error) {
          console.error("Error fetching results:", error);
          setStatsError("Failed to fetch traffic statistics");
        }
      }, STATS_UPDATE_INTERVAL);
    } catch (error) {
      console.error("Error starting detection:", error);
      setStatsError("Failed to start detection");
    }
  };

  // Cleanup intervals on unmount
  useEffect(() => {
    return () => {
      Object.values(intervalsRef.current).forEach(clearInterval);
    };
  }, []);

  return {
    cameras,
    activeDetections,
    detectionResults,
    selectedCamera,
    setSelectedCamera,
    imageUrl,
    isImageLoading,
    setIsImageLoading,
    startDetection,
    stopDetection,
    updateImage,
    statsError,
  };
};
