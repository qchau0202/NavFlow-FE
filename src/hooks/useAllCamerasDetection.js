import { useState, useEffect, useRef } from "react";
import cameraService from "../services/camera.service";
import trafficService from "../services/traffic.service";

export const useAllCamerasDetection = () => {
  const [cameras, setCameras] = useState([]);
  const [detectionResults, setDetectionResults] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isDetecting, setIsDetecting] = useState(false);
  const intervalRef = useRef(null);
  const mountedRef = useRef(true);
  const detectionStartedRef = useRef(false);

  // Fetch all cameras
  useEffect(() => {
    cameraService
      .getCameras()
      .then(setCameras)
      .catch(() => setError("Failed to fetch cameras"));
  }, []);

  // Start detection and polling
  useEffect(() => {
    mountedRef.current = true;
    detectionStartedRef.current = false;

    const startDetection = async () => {
      if (!mountedRef.current || detectionStartedRef.current) return;

      setIsLoading(true);
      try {
        await trafficService.startAllDetections();
        if (!mountedRef.current) {
          // If component unmounted during start, stop detection immediately
          await trafficService.stopAllDetections();
          return;
        }

        detectionStartedRef.current = true;
        setIsDetecting(true);

        // Initial stats fetch
        const stats = await trafficService.getAllStats();
        if (mountedRef.current) {
          setDetectionResults(stats || {});
        }

        // Set up polling interval
        intervalRef.current = setInterval(async () => {
          if (!mountedRef.current || !detectionStartedRef.current) return;

          try {
            const stats = await trafficService.getAllStats();
            if (mountedRef.current) {
              setDetectionResults(stats || {});
            }
          } catch {
            if (mountedRef.current) {
              setError("Failed to fetch stats");
              detectionStartedRef.current = false;
              setIsDetecting(false);
              // Stop detection on error
              try {
                await trafficService.stopAllDetections();
              } catch (err) {
                console.error("Failed to stop detection on error:", err);
              }
            }
          }
        }, 5000);
      } catch {
        if (mountedRef.current) {
          setError("Failed to start detections");
          setIsDetecting(false);
        }
      } finally {
        if (mountedRef.current) {
          setIsLoading(false);
        }
      }
    };

    startDetection();

    // Cleanup function - only called on unmount
    return async () => {
      // First, stop the polling
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }

      // Then stop the detection
      if (detectionStartedRef.current) {
        try {
          await trafficService.stopAllDetections();
        } catch {
          console.error("[useAllCamerasDetection] Failed to stop detection");
        }
      }

      // Finally, update state
      mountedRef.current = false;
      detectionStartedRef.current = false;
      setIsDetecting(false);
      setDetectionResults({});
    };
  }, []); // Empty dependency array - only run on mount/unmount


  return {
    cameras,
    detectionResults,
    isLoading,
    error,
    isDetecting,
  };
};
