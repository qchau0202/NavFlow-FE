import api from "./api";

export const trafficService = {
  // Get real-time detection image
  getDetectionImage: async (cameraId) => {
    const response = await api.get(`/traffic/detection/stream/${cameraId}`, {
      responseType: "blob",
    });
    if (!response.ok) {
      throw new Error("Failed to fetch detection image");
    }
    const blob = response.data;
    return {
      imageUrl: URL.createObjectURL(blob),
      results: response.headers.get("X-Detection-Results")
        ? JSON.parse(response.headers.get("X-Detection-Results"))
        : null,
    };
  },

  // Get traffic statistics
  getTrafficStats: async (cameraId) => {
    try {
      console.log("TrafficService: Fetching stats for camera", cameraId);
      const response = await api.get(`/traffic/detection/stats/${cameraId}`);
      console.log("TrafficService: Raw API response:", response);
      return response.data;
    } catch (error) {
      console.error("TrafficService: Error fetching traffic stats:", error);
      return null;
    }
  },

  // Get list of cameras
  getCameras: async () => {
    try {
      console.log("TrafficService: Fetching cameras");
      const response = await api.get("/traffic/cameras");
      console.log("TrafficService: Cameras response:", response);
      return response.data;
    } catch (error) {
      console.error("TrafficService: Error fetching cameras:", error);
      return [];
    }
  },

  startDetection: async (cameraId) => {
    try {
      console.log("TrafficService: Starting detection for camera", cameraId);
      const response = await api.post(`/traffic/detection/start/${cameraId}`);
      console.log("TrafficService: Start detection response:", response);
      return response.data;
    } catch (error) {
      console.error("TrafficService: Error starting detection:", error);
      return null;
    }
  },

  stopDetection: async (cameraId) => {
    try {
      console.log("TrafficService: Stopping detection for camera", cameraId);
      const response = await api.post(`/traffic/detection/stop/${cameraId}`);
      console.log("TrafficService: Stop detection response:", response);
      return response.data;
    } catch (error) {
      console.error("TrafficService: Error stopping detection:", error);
      return null;
    }
  },
};
