export default async function handler(req: any, res: any) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ status: 'error', message: 'Method not allowed' });
  }

  const { url } = req.body || {};
  if (!url || typeof url !== 'string' || !url.trim().startsWith('http')) {
    return res.status(400).json({ status: 'error', message: 'URL Google Apps Script tidak valid. Wajib diawali http/https.' });
  }

  try {
    const response = await fetch(url.trim(), {
      method: 'GET',
      redirect: 'follow',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) BOM-Dashboard-App',
      },
    });

    const text = await response.text();
    const trimmed = text.trim();

    if (!trimmed.startsWith('{') && !trimmed.startsWith('[')) {
      return res.status(422).json({
        status: 'error',
        message: 'Google Apps Script mengembalikan halaman Web HTML (bukan JSON). Solusi: Di Google Apps Script, klik Deploy > New deployment > atur "Who has access" ke "Anyone" (Siapa saja).',
      });
    }

    try {
      const jsonData = JSON.parse(trimmed);
      return res.status(200).json(jsonData);
    } catch {
      return res.status(422).json({
        status: 'error',
        message: 'Respons dari Google Apps Script bukan format JSON yang valid.',
      });
    }
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    return res.status(500).json({
      status: 'error',
      message: `Terjadi kesalahan koneksi jaringan ke Apps Script: ${errorMessage}`,
    });
  }
}
