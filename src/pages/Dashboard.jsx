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
    statsError,
  } = useCameraDetection();

  return (
    <div className="h-full grid grid-cols-12 p-6 gap-4 sm:grid-cols-1 md:grid-cols-12">
      {/* Camera List Sidebar */}
      <div className="col-span-2 md:col-span-2 sm:col-span-1 h-full overflow-y-auto flex flex-col bg-white rounded-lg shadow-lg p-4 border border-gray-200">
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
          <div className="col-span-6 md:col-span-6 sm:col-span-1 h-full">
            <div className="h-full bg-white rounded-lg shadow-lg p-4 border border-gray-200 flex flex-col">
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
          </div>
          <div className="col-span-4 md:col-span-4 sm:col-span-1 h-full">
            <div className="h-full bg-white rounded-lg shadow-lg p-4 border border-gray-200 flex flex-col">
              <Statistics
                data={detectionResults[selectedCamera]}
                error={statsError}
              />
            </div>
          </div>
        </>
      ) : (
        <div className="col-span-10 md:col-span-10 sm:col-span-1 h-full flex items-center justify-center">
          <p className="text-gray-500 text-3xl md:text-4xl sm:text-2xl font-bold">
            Select a camera to view detection results
          </p>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
