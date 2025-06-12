import { useState, useCallback, useEffect } from "react";
import cameraService from "../services/camera.service";
import trafficService from "../services/traffic.service";

const UPDATE_INTERVAL = 5000;
export const useCameraDetection = () => {
  const [cameras, setCameras] = useState([]);
  const [activeDetections, setActiveDetections] = useState({});
  const [detectionResults, setDetectionResults] = useState({});
  const [selectedCamera, setSelectedCamera] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [isImageLoading, setIsImageLoading] = useState(false);
  const [statsError, setStatsError] = useState(null);

  // Fetch cameras on mount
  useEffect(() => {
    const fetchCameras = async () => {
      try {
        const data = await cameraService.getCameras();
        setCameras(data);
      } catch (error) {
        console.error("Error fetching cameras:", error);
      }
    };
    fetchCameras();
  }, []);

  const stopDetection = useCallback(async (cameraId) => {
    try {
      await trafficService.stopDetection(cameraId);
      setActiveDetections((prev) => {
        const newState = { ...prev };
        delete newState[cameraId];
        return newState;
      });
      setDetectionResults((prev) => {
        const newResults = { ...prev };
        delete newResults[cameraId];
        return newResults;
      });
      setStatsError(null);
      setImageUrl("");
      setIsImageLoading(false);
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

  // Unified update for image and stats
  const updateImageAndStats = useCallback(async () => {
    if (!selectedCamera) return;
    try {
      setIsImageLoading(true);
      setImageUrl(
        trafficService.getStreamUrl(selectedCamera) + `?t=${Date.now()}`
      );
      // Fetch stats at the same time
      const stats = await trafficService.getStats(selectedCamera);
      const processedStats = {
        ...stats,
        timestamp: stats.timestamp || new Date().toISOString(),
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
        [selectedCamera]: processedStats,
      }));
      setStatsError(null);
    } catch (error) {
      console.error("Error updating image and stats:", error);
      setIsImageLoading(false);
      setStatsError("Failed to fetch image or statistics");
    }
  }, [selectedCamera]);

  // Single interval for both image and stats
  useEffect(() => {
    let interval;
    if (selectedCamera && activeDetections[selectedCamera]) {
      updateImageAndStats();
      interval = setInterval(updateImageAndStats, UPDATE_INTERVAL);
    } else {
      setImageUrl("");
      setIsImageLoading(false);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [selectedCamera, activeDetections, updateImageAndStats]);

  const startDetection = async (cameraId) => {
    try {
      if (Object.keys(activeDetections).length > 0) {
        const currentCamera = Object.keys(activeDetections)[0];
        await stopDetection(currentCamera);
      }
      await trafficService.startDetection(cameraId);
      setActiveDetections({ [cameraId]: true });
      setStatsError(null);
      // No need to start a separate interval for stats, handled by unified effect
    } catch (error) {
      console.error("Error starting detection:", error);
      setStatsError("Failed to start detection");
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      setImageUrl("");
      setIsImageLoading(false);
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
    updateImageAndStats,
    statsError,
  };
};
