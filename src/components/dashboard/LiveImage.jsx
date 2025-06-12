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
  const [imageLoaded, setImageLoaded] = useState(false);
  const [currentImageUrl, setCurrentImageUrl] = useState("");
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (imageUrl) {
      setCurrentImageUrl(imageUrl);
    } else {
      setCurrentImageUrl("");
      setImageLoaded(false);
      setError(false);
      setRetryCount(0);
    }
  }, [imageUrl]);

  const handleImageLoad = () => {
    onLoadingChange(false);
    setError(false);
    setRetryCount(0);
    setImageLoaded(true);
  };

  const handleImageError = () => {
    onLoadingChange(false);
    setError(true);
    setImageLoaded(false);
    console.error("Failed to load image from URL:", currentImageUrl);
    setTimeout(() => {
      setRetryCount((prev) => prev + 1);
    }, 1000);
  };

  useEffect(() => {
    setError(false);
    setRetryCount(0);
    setImageLoaded(false);
    if (!imageUrl) setCurrentImageUrl("");
  }, [selectedCamera]);

  // Unified placeholder logic
  const showPlaceholder = !currentImageUrl || !activeDetections[selectedCamera];

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-xl font-semibold">
            Camera: <span className="text-green-500">{selectedCamera}</span>
          </h1>
          <span className="text-gray-500 text-sm">
            Time: {currentTime.toLocaleTimeString()}
          </span>
        </div>
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
              ? "Stop"
              : "View statistics"}
          </button>
        </div>
      </div>
      <div className="flex-1 relative overflow-hidden bg-gray-100 rounded-lg">
        {showPlaceholder ? (
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
        ) : (
          <img
            key={`${currentImageUrl}-${retryCount}`}
            src={`${currentImageUrl}&t=${Date.now()}`}
            alt="Live Detection"
            className={`object-contain w-full h-full transition-opacity duration-300 ${
              imageLoaded ? "opacity-100" : "opacity-0"
            }`}
            onLoad={handleImageLoad}
            onError={handleImageError}
          />
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
