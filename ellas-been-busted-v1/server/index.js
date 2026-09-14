import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ ok: true, app: "Ella's Been Busted" });
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
