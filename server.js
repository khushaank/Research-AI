const express = require("express");
const path = require("path");
const fs = require("fs");
const multer = require("multer");
const { exec } = require("child_process");

const app = express();
const PORT = process.env.PORT || 8000;
const ASSET_DIR = path.join(__dirname, "assets", "research");

// Ensure upload directory exists
if (!fs.existsSync(ASSET_DIR)) {
  fs.mkdirSync(ASSET_DIR, { recursive: true });
}

// Multer Storage Configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (!fs.existsSync(ASSET_DIR)) {
      fs.mkdirSync(ASSET_DIR, { recursive: true });
    }
    cb(null, ASSET_DIR);
  },
  filename: function (req, file, cb) {
    // Keep original name but sanitize slightly
    const sanitized = file.originalname.replace(/[^a-zA-Z0-9.\-_ ()]/g, "");
    cb(null, sanitized);
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit
});

// Serve static files
app.use(express.static(path.join(__dirname)));
app.use(express.json());

// Upload Endpoint
app.post("/upload", upload.array("files"), (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ error: "No files uploaded" });
  }

  console.log(`Uploaded ${req.files.length} files.`);

  // Auto-run indexing script to update manifest immediately
  exec("npm run index", (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
      return res.status(500).json({ error: "Indexing failed" });
    }
    console.log(`Index updated: ${stdout}`);

    res.json({
      success: true,
      count: req.files.length,
      message: "Files uploaded and index updated.",
    });
  });
});

// Fallback Route
app.get("*", (req, res) => {
  // If specific file not found, serve index.html
  // EXCEPT for API routes or missing assets
  if (
    req.path.startsWith("/assets") ||
    req.path.startsWith("/css") ||
    req.path.startsWith("/js")
  ) {
    return res.status(404).send("Not Found");
  }
  res.sendFile(path.join(__dirname, "index.html"));
});

app.listen(PORT, () => {
  console.log(`Research Hub Server running at http://localhost:${PORT}`);
  console.log(`Admin Dashboard: http://localhost:${PORT}/admin.html`);
});
