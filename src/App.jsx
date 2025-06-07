import React, { useState, useEffect } from 'react';

export default function App() {
  const [url, setUrl] = useState('');
  const [info, setInfo] = useState(null);

  useEffect(() => {
    const q = new URLSearchParams(window.location.search).get('url');
    if (q) { setUrl(q); fetchInfo(q); }
  }, []);

  const fetchInfo = async (videoUrl) => {
    try {
      const res = await fetch(`/api/info?url=${encodeURIComponent(videoUrl)}`);
      const data = await res.json();
      setInfo(data);
    } catch {
      alert('Failed to fetch video info.');
    }
  };

  const download = (type, format) => {
    window.open(
      `/api/download?url=${encodeURIComponent(url)}&type=${type}&format=${format}`,
      '_blank'
    );
  };

  return (
    <main className="container">
      <h1>YouTube Downloader</h1>
      <div className="input-group">
        <input
          value={url}
          onChange={e => setUrl(e.target.value)}
          placeholder="YouTube URL or search term"
        />
        <button onClick={() => fetchInfo(url)}>Go</button>
      </div>
      {info && (
        <section className="info-card">
          <img src={info.thumbnail} alt="cover" />
          <h2>{info.title}</h2>
          <div className="actions">
            <button onClick={() => download('video','mp4')}>Video</button>
            <button onClick={() => download('audio','mp3')}>Audio</button>
            <button onClick={() => download('cover','jpg')}>Cover</button>
          </div>
        </section>
      )}
    </main>
  );
}
