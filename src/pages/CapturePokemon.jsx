import React, { useRef, useState } from 'react';
import Webcam from 'react-webcam';
import '../App.css';

function CapturePokemon() {
  const webcamRef = useRef(null);
  const [isCameraOn, setIsCameraOn] = useState(false);

  const handleToggleCapture = () => {
    if (isCameraOn) {
      // If camera is on, stop capturing
      setIsCameraOn(false);
    } else {
      // If camera is off, start capturing
      setIsCameraOn(true);
    }
  };

  const videoConstraints = {
    facingMode: 'environment', // You can change to 'user' if you want to use the front camera
  };

  return (
    <div className="App">
      <div className="video-container">
        <Webcam
          audio={false}
          ref={webcamRef}
          mirrored={true} // Mirrored for front camera, remove if using back camera
          screenshotFormat="image/jpeg"
          width="100%"
          height="100%"
          videoConstraints={isCameraOn ? videoConstraints : false} // Start/stop camera based on isCameraOn state
        />
      </div>
      <button onClick={handleToggleCapture}>{isCameraOn ? 'Stop Camera' : 'Start Camera'}</button>
    </div>
  );
}

export default CapturePokemon;
