import React from "react";
import {
  FiClock,
  FiTruck,
  FiAlertCircle,
  FiActivity,
  FiTrendingUp,
  FiTrendingDown,
} from "react-icons/fi";
import {
  getDensityLevel,
  getVehicleChange,
  getMostCommonVehicle,
  getPeakHour,
  getHighestDensity,
} from "../../utils/statistics";

const Statistics = ({ data, error }) => {
  if (error) {
    return (
      <div className="h-full flex flex-col items-center justify-center">
        <div className="flex items-center gap-2 text-red-500 mb-4">
          <FiAlertCircle className="text-xl" />
          <h1 className="text-3xl md:text-4xl font-semibold">Error</h1>
        </div>
        <p className="text-red-500 text-lg md:text-xl">{error}</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="h-full flex flex-col items-center justify-center">
        <h1 className="text-3xl md:text-4xl font-semibold mb-4">
          Traffic Statistics
        </h1>
        <p className="text-gray-500 text-lg md:text-xl">No data available</p>
      </div>
    );
  }

  const {
    total_vehicles = 0,
    fullness = 0,
    timestamp,
    vehicle_types = {},
    average_confidence = 0,
    detections = [],
    previous_period_count = 0,
    flow_rate = 0,
    peak_hours = [],
    detection_accuracy = 0,
    frames_processed = 0,
  } = data;

  const densityLevel = getDensityLevel(fullness);
  const vehicleChange = getVehicleChange(total_vehicles, previous_period_count);
  const trendIcon =
    vehicleChange > 0 ? (
      <FiTrendingUp className="text-red-500" />
    ) : (
      <FiTrendingDown className="text-green-500" />
    );
  const mostCommonVehicle = getMostCommonVehicle(vehicle_types);
  const highestDensity = getHighestDensity(fullness);
  const peakHour = getPeakHour(peak_hours);

  return (
    <div className="h-full flex flex-col overflow-y-auto">
      <h3 className="text-lg font-semibold mb-4">Traffic Statistics</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                <span className={`font-medium ${densityLevel.color}`}>
                  {densityLevel.level}
                </span>
                {trendIcon}
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Road Capacity:</span>
              <span className="font-medium">{fullness.toFixed(1)}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Flow Rate:</span>
              <span className="font-medium">
                {flow_rate.toFixed(1)} vehicles/min
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Change from Previous:</span>
              <span
                className={`font-medium ${
                  vehicleChange > 0 ? "text-red-500" : "text-green-500"
                }`}
              >
                {vehicleChange.toFixed(1)}%
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
          <p className="text-2xl font-bold">{total_vehicles}</p>
          <div className="mt-2 space-y-1">
            {Object.entries(vehicle_types).map(([type, count]) => (
              <div key={type} className="flex justify-between">
                <span className="text-gray-600">{type}:</span>
                <span className="font-medium">
                  {count} ({((count / total_vehicles) * 100).toFixed(1)}%)
                </span>
              </div>
            ))}
            <div className="pt-2 border-t border-gray-200">
              <div className="flex justify-between ">
                <span className="text-gray-600">Most Common:</span>
                <span className="font-medium">
                  {mostCommonVehicle[0]} ({mostCommonVehicle[1]})
                </span>
              </div>
            </div>
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
                {new Date(timestamp).toLocaleTimeString()}
              </span>
            </div>
            {peak_hours.length > 0 && (
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Peak Hours:</span>
                <span className="font-medium">{peak_hours.join(", ")}</span>
              </div>
            )}
          </div>
        </div>

        {/* Detection Quality */}
        <div className="bg-gray-50 rounded-lg p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <FiActivity className="text-blue-500 text-xl" />
            <h1 className="font-medium">Detection Quality</h1>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Average Confidence:</span>
              <span className="font-medium">
                {(average_confidence * 100).toFixed(1)}%
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Detection Accuracy:</span>
              <span className="font-medium">
                {(detection_accuracy * 100).toFixed(1)}%
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Frames Processed:</span>
              <span className="font-medium">{frames_processed}</span>
            </div>
          </div>
        </div>

        {/* Recent Detections */}
        <div className="bg-gray-50 rounded-lg p-4 shadow-sm">
          <h4 className="font-medium mb-2">Recent Detections</h4>
          <div className="space-y-2 overflow-y-auto max-h-48">
            {detections.length > 0 ? (
              detections.map((detection, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center p-2 bg-white rounded"
                >
                  <span className="font-medium">{detection.label}</span>
                  <span className="text-gray-500">
                    {(detection.confidence * 100).toFixed(1)}%
                  </span>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No recent detections</p>
            )}
          </div>
        </div>

        {/* Insights */}
        <div className="bg-gray-50 rounded-lg p-4 shadow-sm">
          <h4 className="font-medium mb-2">Insights</h4>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Most Common Vehicle:</span>{" "}
              <span className="font-medium">
                {mostCommonVehicle[0]} ({mostCommonVehicle[1]})
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Peak Hour:</span>{" "}
              <span className="font-medium">{peakHour}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Highest Density Today:</span>{" "}
              <span className="font-medium">{highestDensity.toFixed(1)}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Statistics;
