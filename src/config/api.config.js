const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL,
  ENDPOINTS: {
    CAMERAS: {
      BASE: "/api/v1/cameras/",
      LIST: "/api/v1/cameras/",
      ADD: "/api/v1/cameras/",
      REMOVE: (id) => `/api/v1/cameras/${id}/`,
    },
    TRAFFIC: {
      BASE: "/api/v1/traffic/",
      DETECTION: {
        START: (id) => `/api/v1/traffic/detection/start/${id}/`,
        STOP: (id) => `/api/v1/traffic/detection/stop/${id}/`,
        START_ALL: "/api/v1/traffic/detection/start-all/",
        STOP_ALL: "/api/v1/traffic/detection/stop-all/",
        STATS: (id) => `/api/v1/traffic/detection/stats/${id}/`,
      },
      STATS: "/api/v1/traffic/stats/",
      STREAM: (id) => `/api/v1/traffic/detection/stream/${id}/`,
    },
  },
  TIMEOUT: 30000,
  RETRY_ATTEMPTS: 3,
};

export default API_CONFIG;
