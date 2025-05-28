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
