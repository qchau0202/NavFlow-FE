import React from "react";
import { FiClock, FiTruck } from "react-icons/fi";

const Statistics = ({ data }) => {
  // Use fallback values if no data
  const totalVehicles = data?.total_vehicles ?? 0;
  const fullness = data?.fullness ?? 0;
  const timestamp = data?.timestamp
    ? new Date(data.timestamp * 1000).toLocaleTimeString()
    : "N/A";
  const detections = data?.detections ?? [];

  // Summarize detection details
  const summary = detections.reduce((acc, det) => {
    acc[det.label] = (acc[det.label] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="bg-white rounded-xl shadow-sm p-4 max-h-full overflow-y-auto">
      <h3 className="text-lg font-semibold mb-4">Traffic Statistics</h3>
      <div className="space-y-4">
        {/* Info Cards Row */}
        <div className="flex flex-col gap-4">
          <div className="bg-gray-50 rounded-lg p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <FiTruck className="text-blue-500 text-xl" />
              <h4 className="font-medium">Total Vehicles</h4>
            </div>
            <p className="text-2xl font-bold">{totalVehicles}</p>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <div className="relative w-6 h-6">
                <div
                  className="absolute inset-0 rounded-full"
                  style={{
                    background: `conic-gradient(#3B82F6 ${fullness}%, #E5E7EB 0)`,
                  }}
                />
                <div className="absolute inset-1 bg-white rounded-full" />
              </div>
              <h4 className="font-medium">Road Capacity</h4>
            </div>
            <p className="text-2xl font-bold">{fullness.toFixed(1)}%</p>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <FiClock className="text-blue-500 text-xl" />
              <h4 className="font-medium">Last Update</h4>
            </div>
            <p className="text-lg">{timestamp}</p>
          </div>
        </div>

        {/* Detection Details */}
        <div className="bg-gray-50 rounded-lg p-4 shadow-sm">
          <h4 className="font-medium mb-2">Detection Details</h4>
          <div className="flex flex-wrap gap-4 mb-2 text-sm text-gray-700 font-medium">
            {Object.keys(summary).length > 0 ? (
              Object.entries(summary).map(([label, count]) => (
                <span key={label}>
                  {label}: {count}
                </span>
              ))
            ) : (
              <span>No detections</span>
            )}
          </div>
          <div className="space-y-2 overflow-y-auto max-h-72">
            {detections.length > 0 ? (
              detections.map((detection, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center p-2 bg-white rounded"
                >
                  <span className="font-medium">{detection.label}</span>
                  <span className="text-gray-500">
                    Confidence: {(detection.confidence * 100).toFixed(1)}%
                  </span>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No detections yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Statistics;
