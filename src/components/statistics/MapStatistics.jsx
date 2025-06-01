import React from "react";
import { FiActivity, FiTruck, FiClock } from "react-icons/fi";
import { useCameraStatistics } from "../../hooks/useCameraStatistics";

const MapStatistics = ({ data, error }) => {
  const { statistics } = useCameraStatistics(data);

  if (error) {
    return (
      <div className="h-full flex flex-col items-center justify-center">
        <div className="flex items-center gap-2 text-red-500 mb-4">
          <FiActivity className="text-xl" />
          <h1 className="text-xl font-semibold">Error</h1>
        </div>
        <p className="text-red-500 text-sm">{error}</p>
      </div>
    );
  }

  if (!statistics) {
    return (
      <div className="h-full flex flex-col items-center justify-center">
        <h1 className="text-xl font-semibold mb-4">Traffic Statistics</h1>
        <p className="text-gray-500 text-sm">No data available</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Traffic Overview */}
      <div className="bg-gray-50 rounded-lg p-4 shadow-sm">
        <div className="flex items-center gap-2 mb-2">
          <FiActivity className="text-blue-500 text-xl" />
          <h4 className="font-medium">Traffic Overview</h4>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Density Level:</span>
            <div className="flex items-center gap-2">
              <span className={`font-medium ${statistics.densityLevel.color}`}>
                {statistics.densityLevel.level}
              </span>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Road Capacity:</span>
            <span className="font-medium">
              {statistics.fullness.toFixed(1)}%
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Flow Rate:</span>
            <span className="font-medium">
              {statistics.flow_rate.toFixed(1)} vehicles/min
            </span>
          </div>
        </div>
      </div>

      {/* Vehicle Count */}
      <div className="bg-gray-50 rounded-lg p-4 shadow-sm">
        <div className="flex items-center gap-2 mb-2">
          <FiTruck className="text-blue-500 text-xl" />
          <h4 className="font-medium">Vehicle Count</h4>
        </div>
        <p className="text-2xl font-bold">{statistics.total_vehicles}</p>
        <div className="mt-2 space-y-1">
          {Object.entries(statistics.vehicle_types).map(([type, count]) => (
            <div key={type} className="flex justify-between">
              <span className="text-gray-600">{type}:</span>
              <span className="font-medium">
                {count} (
                {((count / statistics.total_vehicles) * 100).toFixed(1)}%)
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Time Analysis */}
      <div className="bg-gray-50 rounded-lg p-4 shadow-sm">
        <div className="flex items-center gap-2 mb-2">
          <FiClock className="text-blue-500 text-xl" />
          <h4 className="font-medium">Time Analysis</h4>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Last Update:</span>
            <span className="font-medium">
              {new Date(statistics.timestamp).toLocaleTimeString()}
            </span>
          </div>
          {statistics.peak_hours.length > 0 && (
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Peak Hours:</span>
              <span className="font-medium">
                {statistics.peak_hours.join(", ")}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MapStatistics;
