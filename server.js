import express from "express";
import ytdl from "ytdl-core";
import cors from "cors";
import fetch from "node-fetch";

const app = express();
app.use(cors());

// Metadata endpoint
app.get("/api/info", async (req, res) => {
  const { url } = req.query;
  if (!ytdl.validateURL(url))
    return res.status(400).json({ error: "Invalid URL" });
  try {
    const info = await ytdl.getInfo(url);
    const thumb = info.videoDetails.thumbnails.pop().url;
    res.json({ title: info.videoDetails.title, thumbnail: thumb });
  } catch {
    res.status(500).json({ error: "Failed to get info" });
  }
});

// Download endpoint
app.get("/api/download", async (req, res) => {
  const { url, type, format } = req.query;

  if (type === "cover") {
    const info = await ytdl.getInfo(url);
    const thumbUrl = info.videoDetails.thumbnails.pop().url;
    res.header("Content-Disposition", `attachment; filename=cover.${format}`);
    return fetch(thumbUrl).then((r) => r.body.pipe(res));
  }

  if (!ytdl.validateURL(url)) return res.status(400).send("Invalid URL");
  const opts = type === "audio" ? { filter: "audioonly" } : {};
  res.header(
    "Content-Disposition",
    `attachment; filename="download.${format}"`
  );
  ytdl(url, opts).pipe(res);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server listening on ${PORT}`));
