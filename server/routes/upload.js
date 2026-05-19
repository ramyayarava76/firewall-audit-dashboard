const express = require('express');
const multer = require('multer');
const path = require('path');

const router = express.Router();

// Store uploads in memory (no disk write needed for parsing)
const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB max
  fileFilter: (_req, file, cb) => {
    const allowed = ['.log', '.txt', '.csv', '.json'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowed.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error(`Unsupported file type: ${ext}. Allowed: ${allowed.join(', ')}`));
    }
  },
});

/**
 * Parse firewall log lines into structured audit entries.
 * Handles simple space/tab/comma-separated log formats.
 */
function parseLog(content, filename) {
  const ext = path.extname(filename).toLowerCase();
  const lines = content
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0 && !l.startsWith('#'));

  if (ext === '.json') {
    try {
      const parsed = JSON.parse(content);
      return Array.isArray(parsed) ? parsed : [parsed];
    } catch {
      return [{ raw: content, error: 'Invalid JSON' }];
    }
  }

  // CSV / log / txt: split on comma or whitespace
  const isCSV = ext === '.csv' || lines[0]?.includes(',');
  const headers = isCSV
    ? lines[0].split(',').map((h) => h.trim())
    : ['timestamp', 'action', 'source_ip', 'dest_ip', 'protocol', 'port', 'details'];

  const dataLines = isCSV ? lines.slice(1) : lines;

  return dataLines.map((line) => {
    const parts = isCSV ? line.split(',') : line.split(/\s+/);
    const entry = {};
    headers.forEach((h, i) => {
      entry[h] = parts[i] !== undefined ? parts[i].trim() : '';
    });
    return entry;
  });
}

function buildSummary(entries) {
  const total = entries.length;
  const blocked = entries.filter(
    (e) => String(e.action || e.Action || '').toUpperCase() === 'BLOCK' ||
            String(e.action || e.Action || '').toUpperCase() === 'DENY'
  ).length;
  const allowed = entries.filter(
    (e) => String(e.action || e.Action || '').toUpperCase() === 'ALLOW' ||
            String(e.action || e.Action || '').toUpperCase() === 'PERMIT'
  ).length;

  return { total, blocked, allowed, other: total - blocked - allowed };
}

// POST /api/upload
router.post('/', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded.' });
  }

  const content = req.file.buffer.toString('utf-8');
  const entries = parseLog(content, req.file.originalname);
  const summary = buildSummary(entries);

  return res.json({
    message: `"${req.file.originalname}" processed successfully.`,
    filename: req.file.originalname,
    summary,
    entries: entries.slice(0, 500), // cap at 500 rows for response size
  });
});

// Multer error handler
router.use((err, _req, res, _next) => {
  res.status(400).json({ error: err.message });
});

module.exports = router;
