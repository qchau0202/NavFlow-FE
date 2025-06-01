import { FiActivity } from "react-icons/fi";

const TrafficOverview = ({ densityLevel, fullness, flow_rate, vehicleChange, trendIcon }) => {
    return (
      <div className="w-full h-full bg-gray-50 rounded-lg p-4 shadow-sm">
        <div className="flex items-center gap-2 mb-2 ">
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
    );
}
export default TrafficOverview;
