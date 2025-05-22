const API_URL = import.meta.env.VITE_API_URL;

export const trafficService = {
  // Get real-time detection image
  getDetectionImage: async (cameraId) => {
    const response = await fetch(`${API_URL}/traffic/detect/${cameraId}`);
    if (!response.ok) {
      throw new Error("Failed to fetch detection image");
    }
    const blob = await response.blob();
    const results = response.headers.get("X-Detection-Results");
    return {
      imageUrl: URL.createObjectURL(blob),
      results: results ? JSON.parse(results) : null,
    };
  },

  // Get traffic statistics
  getTrafficStats: async (cameraId) => {
    const response = await fetch(`${API_URL}/traffic/stats/${cameraId}`);
    if (!response.ok) {
      throw new Error("Failed to fetch traffic stats");
    }
    return await response.json();
  },

  // Get list of cameras
  getCameras: async () => {
    const response = await fetch(`${API_URL}/cameras`);
    if (!response.ok) {
      throw new Error("Failed to fetch cameras");
    }
    return await response.json();
  },
};
