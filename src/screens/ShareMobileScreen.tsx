import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ShareActions } from "../components/ShareActions";
import { fetchSharePayload, type SharePayload } from "../lib/shareLinkApi";
import styles from "./ShareMobileScreen.module.css";

export function ShareMobileScreen() {
  const { shareId } = useParams<{ shareId: string }>();
  const [data, setData] = useState<SharePayload | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    document.title = "Your CODiii Roast";
  }, []);

  useEffect(() => {
    if (!shareId) {
      setError("Invalid share link.");
      return;
    }
    void fetchSharePayload(shareId).then((payload) => {
      if (payload) setData(payload);
      else setError("This link expired or could not load. Scan the QR again from the booth screen.");
    });
  }, [shareId]);

  const getPngBlob = useCallback(async () => {
    if (!data?.imageUrl) return null;
    if (data.imageUrl.startsWith("data:")) {
      const res = await fetch(data.imageUrl);
      return res.blob();
    }
    const res = await fetch(data.imageUrl);
    return res.blob();
  }, [data]);

  if (error) {
    return (
      <div className={styles.page}>
        <p className={styles.error}>{error}</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className={styles.page}>
        <p className={styles.loading}>Loading your roast card…</p>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <p className={styles.badge}>From the CODiii booth</p>
      <h1 className={styles.title}>You got roasted</h1>
      <p className={styles.name}>{data.name}</p>

      <img
        src={data.imageUrl}
        alt="Your CODiii roast card"
        className={styles.card}
        draggable={false}
      />

      <ShareActions
        phone
        roast={data.roast}
        getPngBlob={getPngBlob}
        fileName="codiii-roast.png"
      />
    </div>
  );
}
