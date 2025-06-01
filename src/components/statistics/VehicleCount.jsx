import { FiTruck } from "react-icons/fi";

const VehicleCount = ({ total_vehicles, vehicle_types, mostCommonVehicle }) => {
    return (
      <div className="w-full h-full bg-gray-50 rounded-lg p-4 shadow-sm">
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
    );
}
export default VehicleCount;
