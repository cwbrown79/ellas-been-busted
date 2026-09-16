import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import Database from 'better-sqlite3';
import fs from 'fs';
import multer from 'multer';

const app = express();
const PORT = process.env.PORT || 3001;

const dataDir = process.env.DATA_DIR || path.join(process.cwd(), 'data');
const dbPath = process.env.DB_PATH || path.join(dataDir, 'ellas-been-busted.db');
const uploadsDir = path.join(dataDir, 'uploads');
fs.mkdirSync(uploadsDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

const upload = multer({ storage });

fs.mkdirSync(path.dirname(dbPath), { recursive: true });

const db = new Database(dbPath);

db.exec(`
  CREATE TABLE IF NOT EXISTS photos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    filename TEXT NOT NULL,
    original_name TEXT,
    caption TEXT,
    category TEXT,
    submitted_by TEXT,
    status TEXT NOT NULL DEFAULT 'pending',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    approved_at DATETIME
  )
`);

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(uploadsDir));

app.get('/api/health', (req, res) => {
  res.json({ ok: true, app: "Ella's Been Busted" });
});
app.post('/api/admin/login', (req, res) => {
  const { password } = req.body;

  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminPassword) {
    return res.status(500).json({ error: 'Admin password is not configured' });
  }

  if (password !== adminPassword) {
    return res.status(401).json({ error: 'Invalid password' });
  }

  res.json({ ok: true });
});

app.post('/api/admin/photos', (req, res) => {
  const { password } = req.body;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminPassword || password !== adminPassword) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const photos = db.prepare(`
      SELECT *
      FROM photos
      WHERE status = 'pending'
      ORDER BY created_at DESC
    `).all();

    res.json(photos);
  } catch (error) {
    console.error('Failed to load pending photos:', error);
    res.status(500).json({ error: 'Failed to load pending photos' });
  }
});

app.post('/api/admin/photos/:id/approve', (req, res) => {
  const { password } = req.body;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminPassword || password !== adminPassword) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const result = db.prepare(`
      UPDATE photos
      SET status = 'approved'
      WHERE id = ?
        AND status = 'pending'
    `).run(req.params.id);

    if (result.changes === 0) {
      return res.status(404).json({ error: 'Pending photo not found' });
    }

    res.json({ ok: true });
  } catch (error) {
    console.error('Failed to approve photo:', error);
    res.status(500).json({ error: 'Failed to approve photo' });
  }
});

app.post('/api/photos', upload.single('photo'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Photo is required' });
    }

    const caption = req.body.caption || '';
    const category = req.body.category || 'Everyday';
    const submittedBy = req.body.submittedBy || '';

    const result = db.prepare(`
      INSERT INTO photos
        (filename, original_name, caption, category, submitted_by, status)
      VALUES
        (?, ?, ?, ?, ?, 'pending')
    `).run(
      req.file.filename,
      req.file.originalname,
      caption,
      category,
      submittedBy
    );

    res.status(201).json({
      ok: true,
      id: result.lastInsertRowid,
      message: 'Photo submitted for approval'
    });
  } catch (error) {
    console.error('Photo upload error:', error);
    res.status(500).json({ error: 'Unable to save photo' });
  }
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const webDist = path.join(__dirname, '..', 'web', 'dist');

app.use(express.static(webDist));

app.get('*', (req, res) => {
  if (req.path.startsWith('/api/')) return res.sendStatus(404);
  res.sendFile(path.join(webDist, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Ella's Been Busted server running on port ${PORT}`);
});
