import React from "react";
import { FiTrendingUp, FiTrendingDown } from "react-icons/fi";

const getCongestionLevel = (fullness) => {
  if (fullness >= 80) return { label: "High", color: "text-red-500" };
  if (fullness >= 50) return { label: "Medium", color: "text-yellow-500" };
  return { label: "Low", color: "text-green-500" };
};

const TrafficSummary = ({ stats }) => {
  if (!stats) return <div>No traffic data available</div>;

  const congestion = getCongestionLevel(stats.fullness || 0);
  const mostCommonVehicle =
    stats.vehicle_types &&
    Object.entries(stats.vehicle_types).sort((a, b) => b[1] - a[1])[0]?.[0];

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <span className={`font-bold ${congestion.color}`}>
          {congestion.label} Congestion
        </span>
        {stats.fullness >= 50 ? (
          <FiTrendingUp className="text-red-500" />
        ) : (
          <FiTrendingDown className="text-green-500" />
        )}
      </div>
      <div>
        <span className="font-semibold">Total Vehicles: </span>
        {stats.total_vehicles ?? 0}
      </div>
      <div>
        <span className="font-semibold">Most Common Vehicle: </span>
        {mostCommonVehicle || "N/A"}
      </div>
      <div>
        <span className="font-semibold">Detection Quality: </span>
        {stats.average_confidence
          ? `${(stats.average_confidence * 100).toFixed(1)}%`
          : "N/A"}
      </div>
      {stats.timestamp && (
        <div className="text-xs text-gray-500">
          Last updated: {new Date(stats.timestamp).toLocaleTimeString()}
        </div>
      )}
    </div>
  );
};

export default TrafficSummary;
