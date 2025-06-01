import { FiClock } from "react-icons/fi";

const TimeAnalysis = ({ timestamp, peak_hours }) => {
    return (
      <div className="w-full h-full bg-gray-50 rounded-lg p-4 shadow-sm">
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
    );
}
export default TimeAnalysis;
