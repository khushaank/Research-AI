const fs = require("fs");
const path = require("path");

const ASSET_DIR = path.join(__dirname, "..", "assets", "research");
const OUTPUT_FILE = path.join(__dirname, "..", "research_manifest.json");
const ALLOWED_EXTENSIONS = [".pdf", ".png", ".jpg", ".jpeg", ".gif", ".webp"];

function scanDirectory(dir) {
  let items = [];

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`Created directory: ${dir}`);
    return items;
  }

  const files = fs.readdirSync(dir);

  files.forEach((file) => {
    const filePath = path.join(dir, file);
    const stats = fs.statSync(filePath);
    const ext = path.extname(file).toLowerCase();

    if (stats.isFile() && ALLOWED_EXTENSIONS.includes(ext)) {
      // Relative path for web
      const relativePath = path.posix.join("assets", "research", file);

      const name = path
        .parse(file)
        .name.replace(/_/g, " ")
        .replace(
          /\w\S*/g,
          (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(),
        );
      const type = ext === ".pdf" ? "pdf" : "image";

      items.push({
        id: Buffer.from(relativePath).toString("base64").substring(0, 16),
        title: name,
        type: type,
        path: relativePath,
        date: stats.birthtime.toISOString() || stats.mtime.toISOString(),
        description: `Research document: ${name}`,
      });
    }
  });

  // Sort by date (newest first)
  items.sort((a, b) => new Date(b.date) - new Date(a.date));
  return items;
}

console.log("Scanning for research documents...");
const items = scanDirectory(ASSET_DIR);

fs.writeFileSync(OUTPUT_FILE, JSON.stringify(items, null, 2));

console.log(`Index generated! Found ${items.length} items.`);
console.log(`Saved to ${OUTPUT_FILE}`);
