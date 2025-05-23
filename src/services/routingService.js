const API_URL = import.meta.env.VITE_API_URL;
console.log("VITE_API_URL:", import.meta.env.VITE_API_URL);

export const routingService = {
  getRoutes: async (startId, endId, numPaths = 3) => {
    const res = await fetch(`${API_URL}/api/v1/route`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        start_id: startId,
        end_id: endId,
        num_paths: numPaths,
      }),
    });
    if (!res.ok) throw new Error("Failed to fetch routes");
    const data = await res.json();
    console.log("Routing API data:", data);
    return data;
  },
};
