import { useState, useEffect } from "react";
import axios from "axios";

const API_BASE_URL = "http://localhost:8000/api/v1/traffic";

export const useCameras = () => {
  const [cameras, setCameras] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/cameras`)
      .then((res) => {
        setCameras(res.data);
        setIsLoading(false);
      })
      .catch((err) => {
        setError("Failed to fetch cameras");
        setIsLoading(false);
      });
  }, []);

  return { cameras, isLoading, error };
};
