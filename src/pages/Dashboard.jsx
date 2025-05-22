import React, { useState } from "react";
import {
  FiMaximize2,
  FiMinimize2,
  FiRefreshCw,
  FiSettings,
} from "react-icons/fi";
import { AnimatePresence } from "framer-motion";
import CameraList from "../components/dashboard/CameraList";
import LiveImage from "../components/dashboard/LiveImage";
import Statistics from "../components/dashboard/Statistics";
import { useCameraDetection } from "../hooks/useCameraDetection";

const Dashboard = () => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const {
    cameras,
    activeDetections,
    detectionResults,
    selectedCamera,
    setSelectedCamera,
    imageUrl,
    isImageLoading,
    setIsImageLoading,
    startDetection,
    stopDetection,
    updateImage,
  } = useCameraDetection();

  const handleRefresh = async () => {
    if (selectedCamera) {
      await updateImage();
    }
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  return (
    <div className="h-sreen bg-gray-50 p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-gray-900">
          Traffic Detection Dashboard
        </h1>
        <div className="flex gap-3">
          <button
            onClick={handleRefresh}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            <FiRefreshCw className="text-lg" />
            Refresh
          </button>
          <button
            onClick={toggleFullscreen}
            className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
          >
            {isFullscreen ? (
              <FiMinimize2 className="text-lg" />
            ) : (
              <FiMaximize2 className="text-lg" />
            )}
            {isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-4">
        {/* Camera List Sidebar */}
        <div className={`${isFullscreen ? "hidden" : "col-span-2 max-h-full"}`}>
          <CameraList
            cameras={cameras}
            activeDetections={activeDetections}
            selectedCamera={selectedCamera}
            setSelectedCamera={setSelectedCamera}
            startDetection={startDetection}
            stopDetection={stopDetection}
          />
        </div>
        {/* Main Content Area */}
        <div className={`${isFullscreen ? "col-span-12" : "col-span-10"}`}>
          <AnimatePresence>
            {selectedCamera ? (
              <div className="grid grid-cols-4 gap-4">
                <div className="col-span-3">
                  <LiveImage
                    imageUrl={imageUrl}
                    isLoading={isImageLoading}
                    onLoadingChange={setIsImageLoading}
                    selectedCamera={selectedCamera}
                    activeDetections={activeDetections}
                    stopDetection={stopDetection}
                    startDetection={startDetection}
                  />
                </div>
                <Statistics data={detectionResults[selectedCamera]} />
              </div>
            ) : (
              <div className="col-span-1 flex items-center justify-center h-[800px]">
                <p className="text-gray-500 text-lg">
                  Select a camera to view detection results
                </p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
