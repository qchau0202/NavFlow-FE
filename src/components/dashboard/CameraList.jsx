import React from "react";
import CameraCard from "./CameraCard";

const CameraList = ({
  cameras,
  activeDetections,
  selectedCamera,
  setSelectedCamera,
  startDetection,
  stopDetection,
}) => (
  <div className="bg-white rounded-xl shadow-sm p-4 flex flex-col h-full max-h-[800px]">
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-xl font-semibold">Cameras</h2>
      <span className="text-sm text-gray-500">{cameras.length} cameras</span>
    </div>
    <div className="space-y-3 overflow-y-auto flex-1 pr-2">
      {cameras.map((cameraId) => (
        <div
          key={cameraId}
          onClick={() =>
            setSelectedCamera(selectedCamera === cameraId ? null : cameraId)
          }
          className="cursor-pointer"
        >
          <CameraCard
            camera={cameraId}
            isSelected={selectedCamera === cameraId}
            isActive={activeDetections[cameraId]}
            onToggleDetection={() =>
              activeDetections[cameraId]
                ? stopDetection(cameraId)
                : startDetection(cameraId)
            }
          />
        </div>
      ))}
    </div>
  </div>
);

export default CameraList;
