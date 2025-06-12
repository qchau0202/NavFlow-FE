import api from "./api.service";
import API_CONFIG from "../config/api.config";

class TrafficService {
  async startAllDetections() {
    const response = await api.post(
      API_CONFIG.ENDPOINTS.TRAFFIC.DETECTION.START_ALL
    );
    return response.data;
  }
  async stopAllDetections() {
    const response = await api.post(
      API_CONFIG.ENDPOINTS.TRAFFIC.DETECTION.STOP_ALL
    );
    return response.data;
  }
  async startDetection(cameraId) {
    const response = await api.post(
      API_CONFIG.ENDPOINTS.TRAFFIC.DETECTION.START(cameraId)
    );
    return response.data;
  }
  async stopDetection(cameraId) {
    const response = await api.post(
      API_CONFIG.ENDPOINTS.TRAFFIC.DETECTION.STOP(cameraId)
    );
    return response.data;
  }
  async getAllStats() {
    const response = await api.get(API_CONFIG.ENDPOINTS.TRAFFIC.STATS);
    return response.data;
  }
  async getStats(cameraId) {
    const response = await api.get(
      API_CONFIG.ENDPOINTS.TRAFFIC.DETECTION.STATS(cameraId)
    );
    return response.data;
  }
  getStreamUrl(cameraId) {
    return `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.TRAFFIC.STREAM(
      cameraId
    )}`;
  }
}

export default new TrafficService();
