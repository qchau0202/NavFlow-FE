import { FiActivity } from "react-icons/fi";

const DetectionQuality = ({ average_confidence, detection_accuracy, frames_processed }) => {
    return (
      <div className="w-full h-full bg-gray-50 rounded-lg p-4 shadow-sm">
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
    );
}
export default DetectionQuality;
