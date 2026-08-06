// Konfigurasi Default Google Apps Script Web App
// Tempelkan URL Web App hasil deploy Apps Script Anda di sini
// atau atur Environment Variable VITE_GAS_URL di Vercel
// agar setiap orang yang membuka website secara otomatis langsung terhubung
// tanpa perlu memasukkan URL secara manual di menu settings.

export const DEFAULT_GAS_URL =
  (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_GAS_URL) ||
  
  'https://script.google.com/macros/s/AKfycbw7L8BPQhEIxr6faxHSoQNtXVU2QU3xeP0yzVSDdPApP5l9GDCYpvXjUxL-7jSdwiAm/exec';

