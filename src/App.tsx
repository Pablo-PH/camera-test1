import React, { useEffect, useRef, useState } from "react";

import CameraPhoto, {
  FACING_MODES,
  IMAGE_TYPES,
} from "jslib-html5-camera-photo";
import { askCameraPermission } from "./askCameraPermission";

function App() {
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [camera, setCamera] = useState<CameraPhoto | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [prev, setPrev] = useState("");
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  const startCamera = async (newCam?: CameraPhoto) => {
    let activeCamera = camera;

    if (newCam) {
      activeCamera = newCam;
      setCamera(newCam);
    }

    if (activeCamera && !activeCamera.stream) {
      if (hasPermission === false) {
        console.log("ASKING");
        await askCameraPermission();
      }

      activeCamera
        .startCamera(FACING_MODES.ENVIRONMENT, { width: 1920, height: 1080 })
        .then(() => setHasPermission(true))
        .catch(() => {
          setIsCameraOpen(false);
          setHasPermission(false);
        });
    }
  };

  useEffect(() => {
    if (videoRef.current && isCameraOpen) {
      console.log("NEW CAMERA");

      const newCam = new CameraPhoto(videoRef.current);
      startCamera(newCam);
    }
  }, [isCameraOpen]);

  const takePicture = async () => {
    if (camera) {
      const uri = camera?.getDataUri({
        sizeFactor: 1,
        imageType: IMAGE_TYPES.PNG,
      });
      setPrev(uri);
    }
  };

  if (!isCameraOpen) {
    return (
      <div>
        <button
          onClick={() => {
            setIsCameraOpen(true);
          }}
        >
          {hasPermission === false && <p>DENIED</p>}
          <p>Open Camera</p>
        </button>
        <img
          src={prev}
          alt="PHOTO"
          style={{
            width: 250,
            height: "100%",
          }}
        />
      </div>
    );
  }

  return (
    <div
      style={{
        backgroundColor: "red",
        height: "100vh",
        width: "100vw",
        display: "flex",
        flexDirection: "column",
        justifyContent: "start",
        alignItems: "center",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "start",
          alignItems: "center",
          overflow: "hidden",
          backgroundColor: "black",
        }}
      >
        <button
          style={{
            width: 30,
            height: 30,
            borderRadius: 100,
            marginBottom: 5,
          }}
          onClick={() => {
            setIsCameraOpen(false);
          }}
        >
          <p>X</p>
        </button>
        <div
          style={{
            width: "100%",
            height: "75%",
            backgroundColor: "pink",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
          }}
        >
          <img
            src={prev}
            alt="PHOTO"
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              width: 250,
            }}
          />
          <div
            style={{
              borderWidth: 2,
              borderColor: "white",
              position: "absolute",
              borderStyle: "solid",
              width: "65%",
              height: "90%",
            }}
          />
          <video
            style={{ objectFit: "fill" }}
            width={"100%"}
            height={"100%"}
            autoPlay={true}
            ref={videoRef}
            contentEditable={false}
            controls={false}
            playsInline={true}
            unselectable={"on"}
          />
        </div>
        <button
          style={{
            width: 50,
            height: 50,
            borderRadius: 100,
            marginTop: 5,
          }}
          onClick={takePicture}
        >
          <p>O</p>
        </button>
      </div>
    </div>
  );
}

export default App;
