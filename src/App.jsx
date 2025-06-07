import React, { useState, useEffect } from "react";
import "./styles.css";

export default function App() {
  const [url, setUrl] = useState("");
  const [info, setInfo] = useState(null);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstall, setShowInstall] = useState(false);

  useEffect(() => {
    // Capture the beforeinstallprompt event
    window.addEventListener("beforeinstallprompt", (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstall(true);
    });
    // Auto‑fetch from URL param
    const q = new URLSearchParams(window.location.search).get("url");
    if (q) {
      setUrl(q);
      fetchInfo(q);
    }
  }, []);

  const fetchInfo = async (videoUrl) => {
    try {
      const res = await fetch(`/api/info?url=${encodeURIComponent(videoUrl)}`);
      const data = await res.json();
      setInfo(data);
    } catch {
      alert("Failed to fetch video info.");
    }
  };

  const download = (type, format) => {
    window.open(
      `/api/download?url=${encodeURIComponent(
        url
      )}&type=${type}&format=${format}`,
      "_blank"
    );
  };

  const handleInstall = async () => {
    setShowInstall(false);
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") console.log("PWA installed");
    setDeferredPrompt(null);
  };

  return (
    <main className="container">
      {showInstall && (
        <div className="install-banner">
          <span>Install YT‑Downloader for quick access</span>
          <button onClick={handleInstall}>Install</button>
        </div>
      )}
      <h1>YouTube Downloader</h1>
      <div className="input-group">
        <input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="YouTube URL or search term"
        />
        <button onClick={() => fetchInfo(url)}>Go</button>
      </div>
      {info && (
        <section className="info-card">
          <img src={info.thumbnail} alt="cover" />
          <h2>{info.title}</h2>
          <div className="actions">
            <button onClick={() => download("video", "mp4")}>Video</button>
            <button onClick={() => download("audio", "mp3")}>Audio</button>
            <button onClick={() => download("cover", "jpg")}>Cover</button>
          </div>
        </section>
      )}
    </main>
  );
}
