const Insights = ({ mostCommonVehicle, peakHour, highestDensity }) => {
    return (
      <div className="w-full h-full bg-gray-50 rounded-lg p-4 shadow-sm">
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
    );
}
export default Insights;
