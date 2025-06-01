const RecentDetections = ({ detections }) => {
    return (
      <div className="w-full h-full bg-gray-50 rounded-lg p-4 shadow-sm">
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
    );
}
export default RecentDetections;
