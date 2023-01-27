import React, { useEffect, useRef, useState } from "react";

import CameraPhoto, {
  FACING_MODES,
  IMAGE_TYPES,
} from "jslib-html5-camera-photo";
import { askCameraPermission } from "./askCameraPermission";

function App() {
  const [isCameraOpen, setIsCameraOpen] = useState({
    isOpen: false,
    quality: 1,
  });
  const [camera, setCamera] = useState<CameraPhoto | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [prev, setPrev] = useState("");
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  const startCamera = async (quality: number, newCam?: CameraPhoto) => {
    let activeCamera = camera;

    if (newCam) {
      activeCamera = newCam;
      setCamera(newCam);
    }
    console.log({ activeCamera });

    if (activeCamera) {
      if (hasPermission === false) {
        console.log("ASKING");
        await askCameraPermission();
      }
      console.log("STARTING CAMERA");
      try {
        if (isCameraOpen.quality === 1) {
          await activeCamera.startCamera(FACING_MODES.ENVIRONMENT, {
            width: 1920,
            height: 1080,
          });
        }
        if (isCameraOpen.quality === 2) {
          await activeCamera.startCamera(FACING_MODES.ENVIRONMENT, {
            width: 2560,
            height: 1440,
          });
        }
        if (isCameraOpen.quality === 3) {
          await activeCamera.startCamera(FACING_MODES.ENVIRONMENT, {
            width: 3840,
            height: 2160,
          });
        }
        if (isCameraOpen.quality === 4) {
          await activeCamera.startCameraMaxResolution(FACING_MODES.ENVIRONMENT);
        }
        if (activeCamera.settings) {
          const { width, height, aspectRatio } = activeCamera.settings;
          console.log(width, height, aspectRatio);
        }

        console.log("SUCCESS START", { activeCamera });
        setHasPermission(true);
      } catch (err) {
        console.error(err);

        setIsCameraOpen({ isOpen: false, quality });
        setHasPermission(false);
      }
    }
  };

  useEffect(() => {
    if (videoRef.current && isCameraOpen.isOpen) {
      console.log("NEW CAMERA");
      const newCam = new CameraPhoto(videoRef.current);
      startCamera(isCameraOpen.quality, newCam);
    }
  }, [isCameraOpen.isOpen]);

  const takePicture = async () => {
    if (camera) {
      const uri = camera?.getDataUri({
        sizeFactor: 1,
        imageType: IMAGE_TYPES.JPG,
      });
      setPrev(uri);
    }
  };

  if (!isCameraOpen.isOpen) {
    return (
      <div>
        {hasPermission === false && <p>DENIED</p>}
        <button
          onClick={() => {
            setIsCameraOpen({ isOpen: true, quality: 1 });
          }}
        >
          <p>1920 x 1080</p>
        </button>
        <button
          onClick={() => {
            setIsCameraOpen({ isOpen: true, quality: 2 });
          }}
        >
          <p>2560 x 1440</p>
        </button>
        <button
          onClick={() => {
            setIsCameraOpen({ isOpen: true, quality: 3 });
          }}
        >
          <p>3024 x 4032</p>
        </button>
        <button
          onClick={() => {
            setIsCameraOpen({ isOpen: true, quality: 4 });
          }}
        >
          <p>Highest possible</p>
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
          onClick={async () => {
            await camera?.stopCamera();
            setIsCameraOpen({ isOpen: false, quality: 1 });
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
