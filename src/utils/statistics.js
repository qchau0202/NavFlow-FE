// Utility functions for traffic statistics

export function getDensityLevel(fullness) {
  if (fullness <= 0) return { level: "Empty", color: "text-gray-500" };
  if (fullness <= 20) return { level: "Low", color: "text-green-500" };
  if (fullness <= 40) return { level: "Medium", color: "text-yellow-500" };
  if (fullness <= 60) return { level: "High", color: "text-orange-500" };
  if (fullness <= 80) return { level: "Very High", color: "text-red-500" };
  return { level: "Severe", color: "text-red-700" };
}

export function getVehicleChange(current, previous) {
  return previous ? ((current - previous) / previous) * 100 : 0;
}

export function getMostCommonVehicle(vehicleTypes) {
  return Object.entries(vehicleTypes).reduce(
    (a, b) => (a[1] > b[1] ? a : b),
    ["", 0]
  );
}

export function getPeakHour(peakHours) {
  return Array.isArray(peakHours) && peakHours.length > 0
    ? peakHours[0]
    : "N/A";
}

export function getHighestDensity(fullness) {
  return fullness;
}

// Aggregate stats from detectionResults (object keyed by camera ID)
export function aggregateTrafficStats(detectionResults) {
  if (!detectionResults || typeof detectionResults !== "object") return null;
  const detectionArray = Object.values(detectionResults);
  if (detectionArray.length === 0) return null;
  let totalVehicles = 0;
  let totalFullness = 0;
  let vehicleTypes = {};
  let timestamps = [];
  let cameraCount = detectionArray.length;
  detectionArray.forEach((stats) => {
    if (!stats) return;
    totalVehicles += stats.total_vehicles || 0;
    totalFullness += stats.fullness || 0;
    timestamps.push(stats.timestamp);
    if (stats.vehicle_types) {
      for (const [type, count] of Object.entries(stats.vehicle_types)) {
        vehicleTypes[type] = (vehicleTypes[type] || 0) + count;
      }
    }
  });
  return {
    total_vehicles: totalVehicles,
    fullness: cameraCount ? totalFullness / cameraCount : 0,
    vehicle_types: vehicleTypes,
    timestamp: timestamps.length ? timestamps.sort().reverse()[0] : null,
  };
}

export function getCongestionPrediction(fullness) {
  if (fullness >= 70) {
    return {
      label: "High risk of congestion",
      bg: "bg-purple-50",
      color: "text-purple-500",
      icon: "alert",
    };
  } else if (fullness >= 40) {
    return {
      label: "Possible congestion soon",
      bg: "bg-purple-100",
      color: "text-purple-500",
      icon: "alert",
    };
  } else {
    return {
      label: "No congestion expected soon",
      bg: "bg-purple-50",
      color: "text-purple-500",
      icon: "check",
    };
  }
}
