import React from "react";
import {
  FiTrendingUp,
  FiTrendingDown,
  FiClock,
  FiCheckCircle,
  FiLayers,
  FiAlertTriangle,
} from "react-icons/fi";
import { MdOutlineDirectionsCar } from "react-icons/md";
import {
  getDensityLevel,
  getCongestionPrediction,
} from "../../utils/statistics";

const getCongestionLevel = (fullness) => {
  if (fullness >= 80)
    return {
      label: "High",
      color: "text-red-500",
      bg: "bg-red-50",
      icon: <FiTrendingUp className="text-red-500" size={28} />,
    };
  if (fullness >= 50)
    return {
      label: "Medium",
      color: "text-yellow-500",
      bg: "bg-yellow-50",
      icon: <FiTrendingUp className="text-yellow-500" size={28} />,
    };
  return {
    label: "Low",
    color: "text-green-500",
    bg: "bg-green-50",
    icon: <FiTrendingDown className="text-green-500" size={28} />,
  };
};

const getLatestTimestamp = (stats) => {
  if (!stats) return new Date();
  if (typeof stats === "object" && !Array.isArray(stats)) {
    let latest = null;
    Object.values(stats).forEach((s) => {
      if (s && s.timestamp) {
        const ts = new Date(s.timestamp);
        if (!latest || ts > latest) latest = ts;
      }
    });
    return latest || new Date();
  } else if (stats.timestamp) {
    return new Date(stats.timestamp);
  }
  return new Date();
};

const getHighestCongestionCamera = (stats) => {
  if (!stats || typeof stats !== "object") return null;
  let maxFullness = -1;
  let maxCamera = null;
  Object.entries(stats).forEach(([id, s]) => {
    if (
      s &&
      typeof s.fullness === "number" &&
      !isNaN(s.fullness) &&
      s.fullness > maxFullness
    ) {
      maxFullness = s.fullness;
      maxCamera = { id, ...s };
    }
  });
  return maxCamera;
};

const TrafficSummary = ({ stats, perCameraStats }) => {
  const isPerCameraStats =
    stats &&
    typeof stats === "object" &&
    !Array.isArray(stats) &&
    Object.values(stats).some(
      (s) => typeof s.fullness === "number" && !isNaN(s.fullness)
    );

  const summaryStats = !isPerCameraStats && stats ? stats : null;

  const latestTimestamp = getLatestTimestamp(stats);
  const highestCongestionCamera = getHighestCongestionCamera(perCameraStats);

  if (!summaryStats)
    return <div className="p-4 text-gray-500">No traffic data available</div>;

  const congestion = getCongestionLevel(summaryStats.fullness || 0);
  const mostCommonVehicle =
    summaryStats.vehicle_types &&
    Object.entries(summaryStats.vehicle_types).sort(
      (a, b) => b[1] - a[1]
    )[0]?.[0];

  return (
    <div className="p-2 space-y-4">
      <div
        className={`flex flex-col items-center gap-2 mb-2 rounded-lg p-2 ${congestion.bg}`}
      >
        <div className="flex items-center gap-2">
          <span className={`font-extrabold text-xl ${congestion.color}`}>
            {congestion.label} Congestion Overall
          </span>
          {congestion.icon}
        </div>
        <span className="flex items-center gap-1 text-gray-400 text-xs italic">
          <FiClock />
          Last updated:{" "}
          {latestTimestamp ? latestTimestamp.toLocaleTimeString() : "-"}
        </span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="col-span-1 flex flex-col items-center justify-center bg-blue-50 rounded-lg p-3">
          <FiLayers className="text-blue-500 mb-1" size={24} />
          <span className="font-semibold text-xs text-blue-700">
            Total Vehicles
          </span>
          <span className="font-bold text-lg text-gray-800">
            {summaryStats.total_vehicles ?? 0}
          </span>
        </div>
        <div className="col-span-1 flex flex-col items-center justify-center bg-yellow-50 rounded-lg p-3">
          <MdOutlineDirectionsCar className="text-yellow-600 mb-1" size={24} />
          <span className="font-semibold text-xs text-yellow-700">
            Most Common Vehicle
          </span>
          <span className="font-bold text-lg text-gray-700">
            {mostCommonVehicle || "N/A"}
          </span>
        </div>
        {(() => {
          const prediction = getCongestionPrediction(
            summaryStats.fullness || 0
          );
          return (
            <div
              className={`col-span-1 flex flex-col items-center justify-center rounded-lg p-3 ${prediction.bg}`}
            >
              {prediction.icon === "alert" ? (
                <FiAlertCircle
                  className={`${prediction.color} mb-1`}
                  size={24}
                />
              ) : (
                <FiCheckCircle
                  className={`${prediction.color} mb-1`}
                  size={24}
                />
              )}
              <span className={`font-semibold text-xs text-purple-500`}>
                Congestion Prediction
              </span>
              <span className={`font-bold text-md text-black text-center`}>
                {prediction.label}
              </span>
            </div>
          );
        })()}
        {perCameraStats ? (
          highestCongestionCamera && (
            <div className="col-span-1 flex flex-col items-center justify-center bg-orange-50 rounded-lg p-3">
              {(() => {
                const density = getDensityLevel(
                  highestCongestionCamera.fullness
                );
                return (
                  <div className="flex flex-col items-center justify-center ">
                    <FiAlertTriangle
                      className={`mb-1 text-orange-600`}
                      size={24}
                    />
                    <span
                      className={`font-semibold text-xs text-orange-700 text-center`}
                    >
                      Camera with highest congestion rate
                    </span>
                    <span
                      className="font-bold text-lg text-orange-900 truncate max-w-[120px]"
                      title={
                        highestCongestionCamera.name ||
                        highestCongestionCamera.id
                      }
                    >
                      {highestCongestionCamera.name ||
                        highestCongestionCamera.id}
                    </span>
                    <span className="text-xs text-gray-600">
                      {highestCongestionCamera.fullness.toFixed(1)}% (
                      {density.level})
                    </span>
                  </div>
                );
              })()}
            </div>
          )
        ) : (
          <div className="flex flex-col items-center justify-center bg-orange-50 rounded-lg p-3">
            <span className="text-xs text-gray-400">
              No congestion data available
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrafficSummary;
