import React, { useEffect, useRef, useState } from "react";

import CameraPhoto, {
  FACING_MODES,
  IMAGE_TYPES,
} from "jslib-html5-camera-photo";

function App() {
  const [camera, setCamera] = useState<CameraPhoto | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [prev, setPrev] = useState("");

  useEffect(() => {
    if (camera && !camera.stream) {
      camera
        .startCamera(FACING_MODES.ENVIRONMENT, { width: 1920, height: 1080 })
        .catch((err) => console.log(err));
    }
  }, [camera]);

  useEffect(() => {
    (async () => {
      if (videoRef.current) {
        setCamera(new CameraPhoto(videoRef.current));
      }
    })();
  }, [videoRef.current]);

  const takePicture = async () => {
    if (camera) {
      const uri = camera?.getDataUri({
        sizeFactor: 1,
        imageType: IMAGE_TYPES.JPG,
      });
      setPrev(uri);
    }
  };

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
          onClick={takePicture}
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
              width: "85%",
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
