import CameraList from "../components/dashboard/CameraList";
import LiveImage from "../components/dashboard/LiveImage";
import Statistics from "../components/dashboard/Statistics";
import { useCameraDetection } from "../hooks/useCameraDetection";

const Dashboard = () => {
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
  } = useCameraDetection();

  return (
    <div className="h-full overflow-y-scroll [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
      <div className="grid grid-cols-12 p-6 gap-4">
        {/* Camera List Sidebar */}
        <div className="col-span-2">
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
        {selectedCamera ? (
          <>
            <div className="col-span-8">
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
            <div className="col-span-2">
              <Statistics data={detectionResults[selectedCamera]} />
            </div>
          </>
        ) : (
          <div className="col-span-10 flex items-center justify-center">
            <p className="text-gray-500 text-3xl md:text-4xl sm:text-2xl font-bold">
              Select a camera to view detection results
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
