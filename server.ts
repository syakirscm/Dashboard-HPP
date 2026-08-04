import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Health Endpoint
  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Proxy endpoint to fetch Google Apps Script Web App data cleanly without CORS issues
  app.post('/api/fetch-sheet', async (req, res) => {
    try {
      const { url } = req.body;
      if (!url || typeof url !== 'string') {
        res.status(400).json({ status: 'error', message: 'URL Google Apps Script wajib diisi.' });
        return;
      }

      // Fetch with redirect follow
      const response = await fetch(url, {
        method: 'GET',
        redirect: 'follow',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) BOM-Dashboard-App',
        },
      });

      if (!response.ok) {
        res.status(response.status).json({
          status: 'error',
          message: `Gagal mengakses Google Apps Script (${response.status} ${response.statusText})`,
        });
        return;
      }

      const text = await response.text();
      let jsonData;
      try {
        jsonData = JSON.parse(text);
      } catch {
        res.status(422).json({
          status: 'error',
          message: 'Respons dari URL Apps Script bukan format JSON yang valid. Pastikan Web App diset ke "Anyone" dan mengembalikan JSON.',
        });
        return;
      }

      res.json(jsonData);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      res.status(500).json({
        status: 'error',
        message: `Terjadi kesalahan jaringan: ${errorMessage}`,
      });
    }
  });

  // Vite integration
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server BOM Running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
