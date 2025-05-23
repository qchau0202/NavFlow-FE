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
  <div className="h-full max-h-full bg-white rounded-xl shadow-sm p-4 overflow-y-scroll [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-xl font-semibold">Cameras</h2>
      <span className="text-sm text-gray-500">{cameras.length} cameras</span>
    </div>
    <div className="space-y-3 flex-1">
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
