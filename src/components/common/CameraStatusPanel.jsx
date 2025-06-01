import React from "react";
import { Spin, Button } from "antd";
import Statistics from "../dashboard/Statistics";

const CameraStatusPanel = ({
  selectedCamera,
  cameraStats,
  loading,
  onViewStatus,
  onStopStatus,
  detectionActive,
  statsError,
}) => {
  return (
    <div className="absolute right-4 top-4 z-[1000] bg-white rounded-lg shadow-lg p-4 w-96 min-h-[200px] flex flex-col">
      {!selectedCamera ? (
        <div className="flex-1 flex flex-col items-center justify-center">
          <h3 className="text-lg font-semibold mb-2">Camera Status</h3>
          <p className="text-gray-500">
            Select a camera on the map to view its status.
          </p>
        </div>
      ) : (
        <>
          <h3 className="text-lg font-semibold mb-2">{selectedCamera.name}</h3>
          <p className="text-sm text-gray-600 mb-2">
            Status: {selectedCamera.status}
          </p>
          <p className="text-sm text-gray-600 mb-2">
            Coordinates: {selectedCamera.coordinates?.join(", ")}
          </p>
          {loading ? (
            <div className="flex items-center gap-2 text-xs text-gray-700">
              <Spin size="small" /> Loading...
            </div>
          ) : cameraStats ? (
            <div className="h-full flex flex-col justify-between">
              <Statistics data={cameraStats} error={statsError} />
              {detectionActive && (
                <Button className="mt-4" danger onClick={onStopStatus}>
                  Stop Status
                </Button>
              )}
            </div>
          ) : (
            <Button type="primary" onClick={onViewStatus}>
              View Status
            </Button>
          )}
        </>
      )}
    </div>
  );
};

export default CameraStatusPanel;
