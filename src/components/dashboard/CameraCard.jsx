import React from "react";
import { FiCamera, FiPlay, FiSquare } from "react-icons/fi";

const CameraCard = ({ camera, isSelected, isActive, onToggleDetection }) => {
  return (
    <div
      className={`p-3 rounded-lg border transition-all ${
        isSelected
          ? "border-blue-500 bg-blue-50"
          : "border-gray-200 hover:border-gray-300"
      }`}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-3 min-w-0">
          <div className="p-2 bg-gray-100 rounded-lg flex-shrink-0">
            <FiCamera className="text-lg text-gray-600" />
          </div>
          <div className="min-w-0">
            <h3 className="font-medium text-gray-900 truncate">{camera}</h3>
            <p className="text-sm text-gray-500 truncate">
              {isActive ? "Detection Active" : "Detection Inactive"}
            </p>
          </div>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleDetection();
          }}
          className={`p-2 rounded-lg transition-colors flex-shrink-0 ${
            isActive
              ? "bg-red-100 text-red-600 hover:bg-red-200"
              : "bg-green-100 text-green-600 hover:bg-green-200"
          }`}
        >
          {isActive ? (
            <FiSquare className="text-lg" />
          ) : (
            <FiPlay className="text-lg" />
          )}
        </button>
      </div>
    </div>
  );
};

export default CameraCard;
