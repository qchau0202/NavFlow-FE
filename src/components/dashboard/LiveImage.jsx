import React, { useState, useEffect } from "react";

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
  const [retryCount, setRetryCount] = useState(0);

  const handleImageLoad = () => {
    onLoadingChange(false);
    setError(false);
    setRetryCount(0);
  };

  const handleImageError = () => {
    onLoadingChange(false);
    setError(true);
    // Retry loading the image after a short delay
    setTimeout(() => {
      setRetryCount((prev) => prev + 1);
    }, 1000);
  };

  // Reset error state when camera changes
  useEffect(() => {
    setError(false);
    setRetryCount(0);
  }, [selectedCamera]);

  return (
    <div className="h-full flex flex-col">
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
      <div className="flex-1 relative overflow-hidden bg-gray-100 rounded-lg">
        {imageUrl && !error ? (
          <img
            key={`${imageUrl}-${retryCount}`}
            src={`${imageUrl}&t=${Date.now()}`}
            alt="Live Detection"
            className="object-contain w-full h-full"
            onLoad={handleImageLoad}
            onError={handleImageError}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center">
              <p className="text-gray-500 mb-2">
                {error ? "Failed to load image" : "No image available"}
              </p>
              {error && (
                <button
                  onClick={() => setRetryCount((prev) => prev + 1)}
                  className="text-blue-500 hover:text-blue-600"
                >
                  Retry
                </button>
              )}
            </div>
          </div>
        )}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
          </div>
        )}
      </div>
    </div>
  );
};

export default LiveImage;
