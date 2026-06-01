import { useCallback, useEffect, useRef, useState } from "react";
import styles from "./WebcamCapture.module.css";

type Props = {
  photoUrl: string | null;
  onCapture: (url: string) => void;
};

type Phase = "idle" | "countdown" | "preview";

export function WebcamCapture({ photoUrl, onCapture }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [phase, setPhase] = useState<Phase>(photoUrl ? "preview" : "idle");

  useEffect(() => {
    if (photoUrl) setPhase("preview");
  }, [photoUrl]);
  const [count, setCount] = useState(3);
  const [error, setError] = useState<string | null>(null);

  const stopStream = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
  }, []);

  const ensureStream = useCallback(async () => {
    if (streamRef.current) return streamRef.current;
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: "user", width: { ideal: 640 }, height: { ideal: 480 } },
      audio: false,
    });
    streamRef.current = stream;
    if (videoRef.current) {
      videoRef.current.srcObject = stream;
      await videoRef.current.play();
    }
    return stream;
  }, []);

  const snap = useCallback(async () => {
    const video = videoRef.current;
    if (!video || !video.videoWidth) return;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(video, 0, 0);
    const url = canvas.toDataURL("image/jpeg", 0.88);
    stopStream();
    setPhase("preview");
    onCapture(url);
  }, [onCapture, stopStream]);

  useEffect(() => {
    if (phase === "preview") return;
    void ensureStream().catch((e) => {
      setError(e instanceof Error ? e.message : "Camera unavailable");
    });
    return () => stopStream();
  }, [phase, ensureStream, stopStream]);

  useEffect(() => {
    if (phase !== "countdown") return;
    if (count <= 0) {
      void snap();
      return;
    }
    const id = window.setTimeout(() => setCount((c) => c - 1), 1000);
    return () => clearTimeout(id);
  }, [phase, count, snap]);

  const startCountdown = () => {
    setError(null);
    setCount(3);
    setPhase("countdown");
  };

  const retake = async () => {
    setPhase("idle");
    setCount(3);
    await ensureStream();
  };

  if (photoUrl && phase === "preview") {
    return (
      <div className={styles.wrap}>
        <img src={photoUrl} alt="Your roast photo" className={styles.previewImg} />
        <button type="button" className={styles.secondaryBtn} onClick={() => void retake()}>
          Retake photo
        </button>
      </div>
    );
  }

  return (
    <div className={styles.wrap}>
      <div className={styles.videoFrame}>
        <video ref={videoRef} className={styles.video} playsInline muted />
        {phase === "countdown" && (
          <div className={styles.countdownOverlay}>
            <span className={styles.countNumber} key={count}>
              {count > 0 ? count : "📸"}
            </span>
            <span className={styles.countHint}>Smile — CODiii is watching</span>
          </div>
        )}
      </div>
      {error && <p className={styles.error}>{error}</p>}
      {phase !== "countdown" && (
        <button type="button" className={styles.primaryBtn} onClick={startCountdown} disabled={!!error}>
          Take my roast photo
        </button>
      )}
      {phase === "countdown" && (
        <p className={styles.countHintStatic}>Get ready…</p>
      )}
    </div>
  );
}
