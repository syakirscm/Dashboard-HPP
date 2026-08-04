export const DEFAULT_GAS_URL =
  (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_GAS_URL) ||
  'https://script.google.com/macros/s/AKfycbzSdMuaCID-g6uzlaV7ydY8Ec6jp4FgYcB-XCIRC5qzkJxpXgeyjtAPAHqsGXODUXrz/exec';
