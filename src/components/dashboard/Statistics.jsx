import React from "react";
import { FiAlertCircle, FiTrendingUp, FiTrendingDown } from "react-icons/fi";
import { useCameraStatistics } from "../../hooks/useCameraStatistics";
import TrafficOverview from "../statistics/TrafficOverview";
import VehicleCount from "../statistics/VehicleCount";
import TimeAnalysis from "../statistics/TimeAnalysis";
import RecentDetections from "../statistics/RecentDetections";
import DetectionQuality from "../statistics/DetectionQuality";
import Insights from "../statistics/Insights";

const Statistics = ({ data, error }) => {
  const { statistics } = useCameraStatistics(data);

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

  if (!statistics) {
    return (
      <div className="h-full flex flex-col items-center justify-center">
        <h1 className="text-3xl md:text-4xl font-semibold mb-4">
          Traffic Statistics
        </h1>
        <p className="text-gray-500 text-lg md:text-xl">No data available</p>
      </div>
    );
  }

  const trendIcon =
    statistics.vehicleChange > 0 ? (
      <FiTrendingUp className="text-red-500" />
    ) : (
      <FiTrendingDown className="text-green-500" />
    );

  return (
    <div className="h-full flex flex-col overflow-y-auto ">
      <h3 className="text-lg font-semibold mb-4">Traffic Statistics</h3>
      <div className="flex-1 overflow-y-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Traffic Overview */}
          <div className="col-span-1">
            <TrafficOverview
              densityLevel={statistics.densityLevel}
              fullness={statistics.fullness}
              flow_rate={statistics.flow_rate}
              vehicleChange={statistics.vehicleChange}
              trendIcon={trendIcon}
            />
          </div>

          {/* Vehicle Count */}
          <div className="col-span-1">
            <VehicleCount
              total_vehicles={statistics.total_vehicles}
              vehicle_types={statistics.vehicle_types}
              mostCommonVehicle={statistics.mostCommonVehicle}
            />
          </div>
          {/* Time Analysis */}
          <div className="col-span-1 ">
            <TimeAnalysis
              timestamp={statistics.timestamp}
              peak_hours={statistics.peak_hours}
            />
          </div>
          {/* Detection Quality */}
          <div className="col-span-1 ">
            <DetectionQuality
              average_confidence={statistics.average_confidence}
              detection_accuracy={statistics.detection_accuracy}
              frames_processed={statistics.frames_processed}
            />
          </div>
          {/* Recent Detections */}
          <div className="col-span-1 ">
            <RecentDetections detections={statistics.detections} />
          </div>
          {/* Insights */}
          <div className="col-span-1 ">
            <Insights
              mostCommonVehicle={statistics.mostCommonVehicle}
              peakHour={statistics.peakHour}
              highestDensity={statistics.highestDensity}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Statistics;
