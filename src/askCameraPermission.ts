export const askCameraPermission = async () =>
  await navigator.mediaDevices
    .getUserMedia({ video: true })
    .then((res) => res.getTracks().forEach((track) => track.stop()))
    .then(() => true)
    .catch(() => false);
