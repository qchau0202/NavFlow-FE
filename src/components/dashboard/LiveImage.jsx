import React, { useState } from "react";

const LiveImage = ({
  imageUrl,
  isLoading,
  onLoadingChange,
  selectedCamera,
  activeDetections,
  stopDetection,
  startDetection,
}) => {
  const [error, setError] = useState(false);

  const handleImageLoad = () => {
    onLoadingChange(false);
    setError(false);
  };

  const handleImageError = () => {
    onLoadingChange(false);
    setError(true);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">
          Camera: <span className="text-green-500">{selectedCamera}</span>
        </h2>
        <div className="flex gap-2">
          <button
            onClick={() =>
              activeDetections[selectedCamera]
                ? stopDetection(selectedCamera)
                : startDetection(selectedCamera)
            }
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeDetections[selectedCamera]
                ? "bg-red-500 hover:bg-red-600 hover:scale-105 text-white"
                : "bg-green-500 hover:bg-green-600 hover:scale-105 text-white"
            }`}
          >
            {activeDetections[selectedCamera]
              ? "Stop Detection"
              : "Start Detection"}
          </button>
        </div>
      </div>
      <div className="relative w-full overflow-hidden">
        {imageUrl && !error ? (
          <img
            src={imageUrl}
            alt="Live Detection"
            className="object-contain w-full h-full"
            onLoad={handleImageLoad}
            onError={handleImageError}
          />
        ) : (
          <img
            src="https://placehold.co/600x300"
            alt="No image available"
            className="object-contain w-full h-full opacity-60"
          />
        )}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
          </div>
        )}
        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75">
            <p className="text-red-500">Failed to load image</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LiveImage;
