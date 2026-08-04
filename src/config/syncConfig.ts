// Konfigurasi Default Google Apps Script Web App
// Tempelkan URL Web App hasil deploy Apps Script Anda di sini
// atau atur Environment Variable VITE_GAS_URL di Vercel
// agar setiap orang yang membuka website secara otomatis langsung terhubung
// tanpa perlu memasukkan URL secara manual di menu settings.

export const DEFAULT_GAS_URL ="https://script.google.com/macros/s/AKfycbzSdMuaCID-g6uzlaV7ydY8Ec6jp4FgYcB-XCIRC5qzkJxpXgeyjtAPAHqsGXODUXrz/exec";
  (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_GAS_URL) ||
  'https://script.google.com/macros/s/AKfycbx_EXAMPLE_REPLACE_WITH_YOUR_DEPLOYED_EXEC_URL/exec';

