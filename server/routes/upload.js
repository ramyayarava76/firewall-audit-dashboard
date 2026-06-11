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
  const isCSV = ext === '.csv';
  const firstLine = lines[0] || '';
  const looksLikeHeaders = firstLine.split(/[,\s]+/).some((h) => /^(timestamp|action|source|dest|protocol|port|id|level)$/i.test(h.trim()));
  const hasCommas = firstLine.includes(',');
  
  let headers, dataLines;
  
  if (isCSV || (hasCommas && looksLikeHeaders)) {
    // CSV format with headers
    headers = firstLine.split(',').map((h) => h.trim());
    dataLines = lines.slice(1);
  } else if (looksLikeHeaders && !hasCommas) {
    // Space/tab-separated with headers
    headers = firstLine.split(/\s+/);
    dataLines = lines.slice(1);
  } else {
    // Default log format (no headers)
    headers = ['timestamp', 'action', 'source_ip', 'dest_ip', 'protocol', 'port', 'details'];
    dataLines = lines;
  }

  return dataLines.map((line) => {
    const parts = (isCSV || hasCommas) ? line.split(',').map(p => p.trim()) : line.split(/\s+/);
    const entry = {};
    headers.forEach((h, i) => {
      const value = parts[i]?.trim();
      entry[h] = value && value.length > 0 ? value : null;
    });
    return entry;
  });
}

function buildSummary(entries) {
  const total = entries.length;
  const blocked = entries.filter(
    (e) => {
      const action = String(e.action || e.Action || '').toUpperCase();
      return action === 'BLOCK' || action === 'DENY' || action === 'DROP';
    }
  ).length;
  const allowed = entries.filter(
    (e) => {
      const action = String(e.action || e.Action || '').toUpperCase();
      return action === 'ALLOW' || action === 'PERMIT' || action === 'ACCEPT';
    }
  ).length;

  // Calculate unique rules (combinations of key firewall fields)
  const uniqueRules = new Set();
  entries.forEach((e) => {
    const src = e.source_ip || e.Source || e.src_ip || e.SrcIP || '';
    const dst = e.dest_ip || e.Destination || e.dst_ip || e.DstIP || '';
    const proto = e.protocol || e.Protocol || e.proto || '';
    const prt = e.port || e.Port || e.dst_port || e.DstPort || '';
    const ruleKey = `${src}-${dst}-${proto}-${prt}`;
    if (ruleKey !== '----') { // Only count if at least one field is present
      uniqueRules.add(ruleKey);
    }
  });

  // Risk count = blocked/denied entries
  const riskCount = blocked;

  return {
    total,
    blocked,
    allowed,
    other: total - blocked - allowed,
    totalRules: uniqueRules.size,
    riskCount,
  };
}

// POST /api/upload
router.post('/', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded.' });
  }

  const content = req.file.buffer.toString('utf-8');
  const entries = parseLog(content, req.file.originalname);
  const summary = buildSummary(entries);
  const username = process.env.USERNAME || 'unknown';

  return res.json({
    message: `"${req.file.originalname}" processed successfully.`,
    filename: req.file.originalname,
    username,
    uploadedBy: username,
    summary,
    entries: entries.slice(0, 500), // cap at 500 rows for response size
  });
});

// Multer error handler
router.use((err, _req, res, _next) => {
  res.status(400).json({ error: err.message });
});

module.exports = router;
