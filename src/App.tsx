import React, { useEffect, useRef, useState } from "react";

import CameraPhoto, {
  FACING_MODES,
  IMAGE_TYPES,
} from "jslib-html5-camera-photo";

function App() {
  const [camera, setCamera] = useState<CameraPhoto | null>(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [prev, setPrev] = useState("");
  const [dim, setDim] = useState({ width: "100%", height: "" });
  const [fill, setFill] = useState(false);
  const { width, height } = dim;

  const openCamera = () => setIsCameraOpen(true);

  useEffect(() => {
    if (camera && !camera.stream) {
      camera
        .startCamera(FACING_MODES.ENVIRONMENT, { width: 1920, height: 1080 })
        .then(() => setIsCameraOpen(true))
        .catch(() => setIsCameraOpen(false));
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
      setIsCameraOpen(false);
    }
  };

  console.log(dim, fill);

  return (
    <div
      style={{
        backgroundColor: "red",
        height: "100vh",
        width: "100vw",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          overflow: "hidden",
          backgroundColor: "black",
          position: "relative",
        }}
      >
        <div style={{ display: "flex", width: "100%" }}>
          <button
            style={{ width: "100%" }}
            onClick={() => setDim({ width: "100%", height: "100%" })}
          >
            <p>W 100% H 100%</p>
          </button>
          <button
            style={{ width: "100%" }}
            onClick={() => setDim({ width: "", height: "100%" })}
          >
            <p>H 100%</p>
          </button>
          <button
            style={{ width: "100%" }}
            onClick={() => setDim({ width: "100%", height: "" })}
          >
            <p>w 100%</p>
          </button>
          <button
            style={{ width: "100%" }}
            onClick={() => setFill((pFill) => !pFill)}
          >
            <p>FILL</p>
          </button>
        </div>
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
        <div style={{ width: "100%", backgroundColor: 'pink', padding: 0, margin: 0 }}>
          <div
            style={{
              borderWidth: 2,
              borderColor: "white",
              position: "absolute",
              width: "90%",
              height: "",
              backgroundColor: "blue",
            }}
          />
          <video
            style={{ objectFit: fill ? "fill" : "contain" }}
            width={width}
            height={height}
            autoPlay={true}
            ref={videoRef}
            contentEditable={false}
            controls={false}
            playsInline={true}
            unselectable={"on"}
          />
        </div>
        <button style={{ width: "100%" }} onClick={takePicture}>
          <p>TAKE PICTURE</p>
        </button>
      </div>
    </div>
  );
}

export default App;
