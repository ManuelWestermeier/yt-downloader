import express from "express";
import cors from "cors";
import fetch from "node-fetch";
import playdl from "play-dl";

const app = express();
app.use(cors());

// GET /api/info?url=...
// Returns { title, thumbnail }
app.get("/api/info", async (req, res) => {
  const { url } = req.query;
  if (!url || !(await playdl.validate(url))) {
    return res.status(400).json({ error: "Invalid or missing URL" });
  }
  try {
    const info = await playdl.video_info(url);
    const vd = info.video_details;
    const thumb = vd.thumbnails.pop().url;
    res.json({ title: vd.title, thumbnail: thumb });
  } catch (err) {
    console.error("INFO ERR:", err);
    res.status(500).json({ error: "Failed to fetch video info" });
  }
});

// GET /api/download?url=...&type=video|audio|cover&format=mp4|mp3|jpg
app.get("/api/download", async (req, res) => {
  const { url, type, format } = req.query;
  if (!url || !type || !format || !(await playdl.validate(url))) {
    return res.status(400).send("Invalid parameters");
  }

  try {
    if (type === "cover") {
      // Fetch thumbnail
      const info = await playdl.video_info(url);
      const thumbUrl = info.video_details.thumbnails.pop().url;
      res.header(
        "Content-Disposition",
        `attachment; filename="cover.${format}"`
      );
      return fetch(thumbUrl).then((r) => r.body.pipe(res));
    }

    // For audio/video streams
    const streamInfo = await playdl.stream(url, {
      quality: type === "audio" ? 0 : 3, // 0 = best audio, 3 = best video+audio
    });

    res.header(
      "Content-Disposition",
      `attachment; filename="download.${format}"`
    );
    streamInfo.stream.pipe(res);
  } catch (err) {
    console.error("DOWNLOAD ERR:", err);
    res.status(500).send("Download failed");
  }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server listening on ${PORT}`));
