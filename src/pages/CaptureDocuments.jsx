import React, { useRef, useState, useEffect } from "react";
import Webcam from "react-webcam";
import "../App.css";

function CaptureDocuments() {
  const webcamRef = useRef(null);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [facingMode, setFacingMode] = useState("environment"); // 'environment' for back camera, 'user' for front camera
  const [capturedPhotos, setCapturedPhotos] = useState([]);

  useEffect(() => {
    // Load data from cache when component mounts
    if ("caches" in window) {
      caches.open("capturedPhotos").then((cache) => {
        cache.match("capturedPhotos").then((response) => {
          if (response) {
            response.json().then((data) => {
              setCapturedPhotos(data);
            });
          }
        });
      });
    }
  }, []);

  const handleToggleCapture = () => {
    if (isCameraOn) {
      // If camera is on, stop capturing
      setIsCameraOn(false);
    } else {
      // If camera is off, start capturing
      setIsCameraOn(true);
    }
  };

  const handleToggleFacingMode = () => {
    setFacingMode((prevFacingMode) =>
      prevFacingMode === "environment" ? "user" : "environment"
    );
  };

  const handleCapturePhoto = () => {
    const photo = webcamRef.current.getScreenshot();
    setCapturedPhotos([...capturedPhotos, photo]);

    // Update cache with captured photos
    if ("caches" in window) {
      caches.open("capturedPhotos").then((cache) => {
        cache.put(
          "capturedPhotos",
          new Response(JSON.stringify([...capturedPhotos, photo]))
        );
      });
    }
  };

  const videoConstraints = {
    facingMode: facingMode,
  };

  return (
    <div className="container">
      <div className="video-container">
        <Webcam
          audio={false}
          ref={webcamRef}
          mirrored={facingMode === "user"} // Mirrored for front camera
          screenshotFormat="image/jpeg"
          width="100%"
          height="100%"
          videoConstraints={isCameraOn ? videoConstraints : false} // Start/stop camera based on isCameraOn state
        />
      </div>
      <div className="d-flex justify-content-center mt-3">
        <button onClick={handleToggleCapture} className="btn btn-primary me-2">
          {isCameraOn ? "Stop Camera" : "Start Camera"}
        </button>
        <button
          onClick={handleToggleFacingMode}
          className="btn btn-secondary me-2"
        >
          Switch Camera
        </button>
        <button onClick={handleCapturePhoto} className="btn btn-success">
          Capture Photo
        </button>
      </div>
      {capturedPhotos.length > 0 && (
        <div className="submitted-data mt-4">
          <h3>Captured Photos:</h3>
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Photo</th>
              </tr>
            </thead>
            <tbody>
              {capturedPhotos.map((photo, index) => (
                <tr key={index}>
                  <td>
                    <img
                      src={photo}
                      alt={`Captured ${index + 1}`}
                      style={{ width: "100px" }}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default CaptureDocuments;
