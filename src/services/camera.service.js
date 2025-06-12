import api from "./api.service";
import API_CONFIG from "../config/api.config";

class CameraService {
  // Camera CRUD
  async getCameras() {
    const response = await api.get(API_CONFIG.ENDPOINTS.CAMERAS.LIST);
    return response.data;
  }
  async addCamera(camera) {
    const response = await api.post(API_CONFIG.ENDPOINTS.CAMERAS.ADD, camera);
    return response.data;
  }
  async removeCamera(cameraId) {
    const response = await api.delete(
      API_CONFIG.ENDPOINTS.CAMERAS.REMOVE(cameraId)
    );
    return response.data;
  }

  async getStreamUrl(cameraId) {
    return `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.TRAFFIC.STREAM(
      cameraId
    )}`;
  }
}

export default new CameraService();
