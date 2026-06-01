import { useCallback, useEffect, useRef, useState } from "react";

export function useWebcamCapture() {
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const stopStream = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
  }, []);

  const capture = useCallback(async (): Promise<string | null> => {
    setError(null);
    try {
      const stream =
        streamRef.current ??
        (await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "user", width: { ideal: 640 }, height: { ideal: 480 } },
          audio: false,
        }));
      streamRef.current = stream;

      const video = document.createElement("video");
      video.srcObject = stream;
      video.muted = true;
      await video.play();

      await new Promise((r) => setTimeout(r, 120));

      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("canvas unsupported");

      ctx.drawImage(video, 0, 0);
      const url = canvas.toDataURL("image/jpeg", 0.88);
      setPhotoUrl(url);
      stopStream();
      return url;
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Camera unavailable";
      setError(msg);
      stopStream();
      return null;
    }
  }, [stopStream]);

  useEffect(() => () => stopStream(), [stopStream]);

  return { photoUrl, error, capture, setPhotoUrl };
}
