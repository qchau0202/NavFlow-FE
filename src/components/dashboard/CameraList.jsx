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
  <div className="h-full overflow-y-auto flex flex-col">
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-xl font-semibold">Cameras</h2>
      <span className="text-sm text-gray-500">{cameras.length} cameras</span>
    </div>
    <div className="flex-1 overflow-y-auto space-y-3">
      {cameras.map((camera) => (
        <div
          key={camera.id}
          onClick={() =>
            setSelectedCamera(selectedCamera === camera.id ? null : camera.id)
          }
          className="cursor-pointer"
        >
          <CameraCard
            camera={camera}
            isSelected={selectedCamera === camera.id}
            isActive={activeDetections[camera.id]}
            onToggleDetection={() =>
              activeDetections[camera.id]
                ? stopDetection(camera.id)
                : startDetection(camera.id)
            }
          />
        </div>
      ))}
    </div>
  </div>
);

export default CameraList;
