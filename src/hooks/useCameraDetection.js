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
  const intervalsRef = useRef({});

  // Fetch cameras on mount
  useEffect(() => {
    const fetchCameras = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/cameras/`);
        setCameras(response.data);
      } catch (error) {
        console.error("Error fetching cameras:", error);
      }
    };
    fetchCameras();
  }, []);

  const stopDetection = useCallback(async (cameraId) => {
    try {
      await axios.post(`${API_BASE_URL}/traffic/stop/${cameraId}`);
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
    } catch (error) {
      console.error("Error stopping detection:", error);
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
        `${API_BASE_URL}/traffic/stream/${selectedCamera}?t=${Date.now()}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch image");
      }
      setImageUrl(
        `${API_BASE_URL}/traffic/stream/${selectedCamera}?t=${Date.now()}`
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

      await axios.post(`${API_BASE_URL}/traffic/start/${cameraId}`);
      setActiveDetections({ [cameraId]: true });

      // Clear any existing intervals
      if (intervalsRef.current[cameraId]) {
        clearInterval(intervalsRef.current[cameraId]);
      }

      // Start polling for stats
      intervalsRef.current[cameraId] = setInterval(async () => {
        try {
          const response = await axios.get(
            `${API_BASE_URL}/traffic/stats/${cameraId}`
          );
          setDetectionResults((prev) => ({
            ...prev,
            [cameraId]: response.data,
          }));
        } catch (error) {
          console.error("Error fetching results:", error);
        }
      }, STATS_UPDATE_INTERVAL);
    } catch (error) {
      console.error("Error starting detection:", error);
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
  };
};
