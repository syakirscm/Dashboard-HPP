import React, { useState } from 'react';
import { SyncStatus } from '../types/bom';
import { GOOGLE_APPS_SCRIPT_SAMPLE_CODE } from '../data/initialBOM';
import {
  X,
  Copy,
  Check,
  Globe,
  RefreshCw,
  ExternalLink,
  Code,
  Sliders,
  AlertTriangle,
  Zap,
  Share2,
  CheckCircle2,
  HelpCircle,
  FileSpreadsheet,
  Users,
} from 'lucide-react';

interface SyncSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  syncStatus: SyncStatus;
  gasUrl: string;
  onSaveGasUrl: (url: string) => void;
  onTriggerSync: () => Promise<void>;
  onToggleAutoSync: (enabled: boolean, interval: number) => void;
  onResetToDefault: () => void;
  onOpenTemplateModal?: () => void;
}

export const SyncSettingsModal: React.FC<SyncSettingsModalProps> = ({
  isOpen,
  onClose,
  syncStatus,
  gasUrl,
  onSaveGasUrl,
  onTriggerSync,
  onToggleAutoSync,
  onResetToDefault,
  onOpenTemplateModal,
}) => {
  const [inputUrl, setInputUrl] = useState(gasUrl);
  const [copied, setCopied] = useState(false);
  const [copiedShareLink, setCopiedShareLink] = useState(false);
  const [testing, setTesting] = useState(false);
  const [activeTab, setActiveTab] = useState<'config' | 'guide'>('config');

  if (!isOpen) return null;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(GOOGLE_APPS_SCRIPT_SAMPLE_CODE);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleCopyShareLink = () => {
    if (!inputUrl) return;
    const shareUrl = `${window.location.origin}${window.location.pathname}?gas_url=${encodeURIComponent(inputUrl.trim())}`;
    navigator.clipboard.writeText(shareUrl);
    setCopiedShareLink(true);
    setTimeout(() => setCopiedShareLink(false), 3000);
  };

  const handleSaveAndTest = async () => {
    setTesting(true);
    onSaveGasUrl(inputUrl);
    await onTriggerSync();
    setTesting(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-3xl overflow-hidden my-8">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-400">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold tracking-tight">
                Integrasi Apps Script Web App
              </h3>
              <p className="text-xs text-slate-400">
                Hubungkan data BOM Anda untuk sinkronisasi otomatis secara langsung
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-6 pt-3 gap-2">
          <button
            onClick={() => setActiveTab('config')}
            className={`pb-2.5 px-3 text-xs font-semibold border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'config'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Pengaturan URL & Live Sync</span>
          </button>
          <button
            onClick={() => setActiveTab('guide')}
            className={`pb-2.5 px-3 text-xs font-semibold border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'guide'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Code className="w-3.5 h-3.5" />
            <span>Kode Apps Script & Panduan Setup</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 max-h-[75vh] overflow-y-auto">
          {activeTab === 'config' ? (
            <div className="space-y-6">
              {/* Status Banner */}
              <div
                className={`p-4 rounded-xl border flex items-start gap-3 ${
                  syncStatus.status === 'connected'
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                    : syncStatus.status === 'error'
                    ? 'bg-rose-50 border-rose-200 text-rose-900'
                    : 'bg-amber-50 border-amber-200 text-amber-900'
                }`}
              >
                <Zap className="w-5 h-5 shrink-0 mt-0.5" />
                <div className="text-xs flex-1">
                  <div className="font-bold">
                    Status Koneksi: {syncStatus.status.toUpperCase()}
                  </div>
                  <p className="mt-0.5 text-slate-600">
                    {syncStatus.lastSync
                      ? `Terakhir disinkronkan: ${new Date(syncStatus.lastSync).toLocaleTimeString()}`
                      : 'Belum terhubung ke Google Apps Script Web App.'}
                  </p>
                  {syncStatus.errorMessage && (
                    <div className="mt-2 text-[11px] bg-rose-100/90 p-3.5 rounded-xl border border-rose-300 text-rose-900 space-y-2.5">
                      <div className="font-mono font-bold text-rose-800 text-xs flex items-center gap-1.5">
                        <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                        <span>Pesan Error: {syncStatus.errorMessage}</span>
                      </div>
                      <div className="pt-2 border-t border-rose-200/80 text-slate-800 leading-relaxed space-y-2">
                        <div className="font-bold text-rose-950 text-xs flex items-center gap-1">
                          <span>💡 Mengapa Error Ini Terjadi?</span>
                        </div>
                        <p className="text-[11px] text-slate-700">
                          Error ini berarti Google Apps Script mengembalikan halaman web/login Google (HTML) dan bukan data JSON. Hal ini terjadi karena <strong>akses Web App belum dibuka untuk publik ("Anyone")</strong> atau <strong>kode belum di-deploy sebagai versi baru</strong>.
                        </p>
                        <div className="bg-white/90 p-2.5 rounded-lg border border-rose-200 space-y-1.5 text-slate-800">
                          <strong className="text-emerald-900 font-bold block text-[11px]">
                            Langkah Solusi 3 Menit di Google Apps Script:
                          </strong>
                          <ol className="list-decimal list-inside space-y-1.5 text-[11px] text-slate-800 pl-0.5">
                            <li>
                              Buka Google Spreadsheet &gt; <strong>Ekstensi (Extensions)</strong> &gt; <strong>Apps Script</strong>.
                            </li>
                            <li>
                              Pastikan Anda sudah menempelkan kode dari tab <strong>"Kode Apps Script & Panduan Setup"</strong> di atas.
                            </li>
                            <li>
                              Klik <strong>Deploy (Terapkan)</strong> &gt; <strong>Manage deployments (Kelola pendaftaran)</strong>.
                            </li>
                            <li>
                              Klik <strong>Edit (Ikon Pensil)</strong> pada deployment aktif Anda.
                            </li>
                            <li>
                              Ubah <strong>Who has access (Siapa yang memiliki akses)</strong> menjadi:{' '}
                              <span className="bg-emerald-100 text-emerald-900 font-extrabold px-1.5 py-0.5 rounded border border-emerald-300">
                                Anyone (Siapa saja)
                              </span>{' '}
                              <span className="text-rose-600 font-bold">*WAJIB</span>
                            </li>
                            <li>
                              Ubah <strong>Version (Versi)</strong> menjadi:{' '}
                              <span className="bg-slate-100 text-slate-900 font-bold px-1 py-0.5 rounded border border-slate-300">
                                New version (Versi baru)
                              </span>
                            </li>
                            <li>
                              Klik <strong>Deploy</strong>, lalu salin URL Web App yang berakhiran <code className="font-mono bg-slate-100 text-slate-900 px-1 py-0.5 rounded">/exec</code> dan simpan di bawah.
                            </li>
                          </ol>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Banner Template Spreadsheet & Crewing Guide */}
              {onOpenTemplateModal && (
                <div className="p-4 bg-gradient-to-r from-emerald-900 to-teal-950 text-white rounded-2xl shadow-md border border-emerald-700/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-400 shrink-0">
                      <FileSpreadsheet className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                        <span>Template Spreadsheet & Crewing Guide</span>
                        <span className="bg-amber-400 text-slate-950 text-[9px] px-1.5 py-0.2 rounded font-extrabold uppercase">
                          CSV / Sheet
                        </span>
                      </h4>
                      <p className="text-[11px] text-emerald-200/90 mt-0.5">
                        Unduh atau lihat format sheet "NEW FORMULA & HPP" dan "Source Crewing Guide"
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={onOpenTemplateModal}
                    className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 text-xs font-bold text-slate-900 bg-emerald-400 hover:bg-emerald-300 rounded-xl transition-all shadow-xs cursor-pointer shrink-0"
                  >
                    <span>Lihat & Unduh Template</span>
                  </button>
                </div>
              )}

              {/* URL Input Form */}
              <div className="space-y-3">
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                  URL Google Apps Script Web App
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    placeholder="https://script.google.com/macros/s/.../exec"
                    value={inputUrl}
                    onChange={(e) => setInputUrl(e.target.value)}
                    className="flex-1 px-3.5 py-2 text-xs font-mono bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <button
                    onClick={handleSaveAndTest}
                    disabled={testing || !inputUrl}
                    className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-50 transition-colors shrink-0"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${testing ? 'animate-spin' : ''}`} />
                    <span>{testing ? 'Menguji...' : 'Tes & Simpan'}</span>
                  </button>
                </div>
                <p className="text-[11px] text-slate-500">
                  Masukkan URL Web App hasil deploy dari Google Apps Script spreadsheet Anda.
                </p>

                {/* Share Link Generator Box */}
                {inputUrl ? (
                  <div className="p-3.5 bg-emerald-50/90 rounded-xl border border-emerald-200 space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-950">
                        <Share2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>Link Berbagi Otomatis untuk Tim/Orang Lain</span>
                      </div>
                      <button
                        onClick={handleCopyShareLink}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg transition-colors shadow-2xs shrink-0"
                      >
                        {copiedShareLink ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-200" />
                            <span>Link Berhasil Disalin!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Salin Link Berbagi (+ URL Sync)</span>
                          </>
                        )}
                      </button>
                    </div>
                    <p className="text-[11px] text-slate-700 leading-relaxed">
                      💡 <strong>Solusi Mudah Bagikan ke Orang Lain:</strong> Gunakan tombol di atas untuk menyalin link. Kirim link ini ke teman/tim Anda. Saat mereka membuka link ini, URL Web App akan <strong>otomatis terisi & tersimpan di HP/Komputer mereka</strong> tanpa perlu menyetting manual lagi!
                    </p>
                  </div>
                ) : null}

                {/* Info Card: Cara agar URL Permanen untuk Semua Pengunjung */}
                <div className="p-3.5 bg-blue-50/80 rounded-xl border border-blue-200/80 space-y-2 text-slate-800">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-blue-950">
                    <HelpCircle className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>Cara Agar Semua Pengunjung Otomatis Terhubung (Tanpa Setting Manual)</span>
                  </div>
                  <div className="text-[11px] text-slate-700 space-y-1.5 leading-relaxed">
                    <p>
                      Secara bawaan, simpanan URL tersimpan di <code>localStorage</code> browser Anda sendiri. Jika websitenya dibuka orang lain di HP/laptop berbeda, ada 2 cara agar mereka tidak perlu memasukkan URL lagi:
                    </p>
                    <ul className="list-disc list-inside space-y-1 text-[11px] font-medium text-slate-800 pl-1">
                      <li>
                        <strong>Opsi 1 (Instan):</strong> Gunakan tombol <em>"Salin Link Berbagi (+ URL Sync)"</em> di atas. Link tersebut berisi parameter khusus yang otomatis mengisi URL Apps Script saat diklik.
                      </li>
                      <li>
                        <strong>Opsi 2 (Permanen):</strong> Masukkan URL Apps Script Anda ke variabel <code>DEFAULT_GAS_URL</code> di file <code>src/config/syncConfig.ts</code>. Dengan begitu, setiap pengunjung yang membuka link website utama akan langsung terhubung tanpa setting apapun!
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Auto Sync Settings */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Auto Sync Otomatis</h4>
                    <p className="text-[11px] text-slate-500">
                      Perbarui data secara berkala tanpa harus menekan tombol refresh.
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={syncStatus.autoSyncEnabled}
                      onChange={(e) =>
                        onToggleAutoSync(e.target.checked, syncStatus.intervalSeconds)
                      }
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600"></div>
                  </label>
                </div>

                {syncStatus.autoSyncEnabled && (
                  <div className="flex items-center gap-3 pt-2 border-t border-slate-200">
                    <span className="text-xs text-slate-600">Interval Sinkronisasi:</span>
                    <select
                      value={syncStatus.intervalSeconds}
                      onChange={(e) =>
                        onToggleAutoSync(true, Number(e.target.value))
                      }
                      className="px-2.5 py-1 text-xs bg-white border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-emerald-500 text-slate-800 font-semibold"
                    >
                      <option value={10}>Setiap 10 Detik (Cepat)</option>
                      <option value={30}>Setiap 30 Detik (Standar)</option>
                      <option value={60}>Setiap 1 Menit</option>
                    </select>
                  </div>
                )}
              </div>

              {/* Quick Reset Button */}
              <div className="pt-2 border-t border-slate-200 flex justify-between items-center">
                <button
                  onClick={onResetToDefault}
                  className="text-xs text-rose-600 hover:text-rose-800 hover:underline font-medium"
                >
                  Reset ke Data Default Screenshot
                </button>
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg"
                >
                  Tutup
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Step-by-Step Instructions */}
              <div className="space-y-3">
                <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-xs">
                    1
                  </span>
                  Langkah-langkah Memasang Google Apps Script
                </h4>
                <ol className="list-decimal list-inside text-xs text-slate-700 space-y-2 pl-2">
                  <li>
                    Buka Google Spreadsheet yang berisi data BOM (kolom Kategori, Kode Baru, nama
                    produk, dll).
                  </li>
                  <li>
                    Pilih menu <strong className="text-slate-900">Ekstensi (Extensions)</strong> &gt;{' '}
                    <strong className="text-slate-900">Apps Script</strong>.
                  </li>
                  <li>Hapus semua kode bawaan, lalu tempel (paste) kode di bawah ini.</li>
                  <li>
                    Klik tombol <strong className="text-[#047857]">Deploy</strong> &gt;{' '}
                    <strong className="text-[#047857]">Deployment baru (New deployment)</strong>.
                  </li>
                  <li>
                    Pilih tipe <strong className="text-slate-900">Web app</strong>. Atur "Siapa yang memiliki akses" (Who has access) ke{' '}
                    <strong className="text-[#B91C1C]">Siapa saja (Anyone)</strong>.
                  </li>
                  <li>Klik Deploy, lalu salin (copy) URL Web App yang dihasilkan.</li>
                </ol>
              </div>

              {/* Code Snippet */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 font-mono">
                    Code.gs (Google Apps Script)
                  </span>
                  <button
                    onClick={handleCopyCode}
                    className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Tersalin!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Salin Kode Script</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="bg-slate-950 text-slate-200 p-4 rounded-xl text-xs font-mono overflow-x-auto max-h-72 border border-slate-800">
                  <pre>{GOOGLE_APPS_SCRIPT_SAMPLE_CODE}</pre>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
