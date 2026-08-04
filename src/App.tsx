import { useState, useEffect, useCallback, useMemo } from 'react';
import { BOMRow, SyncStatus } from './types/bom';
import { INITIAL_BOM_DATA } from './data/initialBOM';
import { DEFAULT_GAS_URL } from './config/syncConfig';
import { processBOMData } from './utils/bomCalculations';
import { Header } from './components/Header';
import { KPICards } from './components/KPICards';
import { HierarchicalView } from './components/HierarchicalView';
import { SpreadsheetTableView } from './components/SpreadsheetTableView';
import { CostAnalyticsView } from './components/CostAnalyticsView';
import { SyncSettingsModal } from './components/SyncSettingsModal';
import { BatchCalculatorModal } from './components/BatchCalculatorModal';
import { SimulateSheetUpdateModal } from './components/SimulateSheetUpdateModal';
import { AddItemModal } from './components/AddItemModal';
import {
  Layers,
  Table as TableIcon,
  PieChart as ChartIcon,
  FileSpreadsheet,
} from 'lucide-react';

const STORAGE_KEY_BOM = 'bom_dashboard_rows_v1';
const STORAGE_KEY_GAS_URL = 'bom_dashboard_gas_url_v1';

export default function App() {
  // Load initial state from local storage or default data
  const [rows, setRows] = useState<BOMRow[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_BOM);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // Fallback to initial default dataset
      }
    }
    return INITIAL_BOM_DATA;
  });

  const [gasUrl, setGasUrl] = useState<string>(() => {
    // 1. Check URL query string parameter (?gas_url=... or ?url=...)
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const paramUrl = params.get('gas_url') || params.get('url');
      if (paramUrl && paramUrl.startsWith('http')) {
        localStorage.setItem(STORAGE_KEY_GAS_URL, paramUrl);
        return paramUrl;
      }
    }
    // 2. Check localStorage
    const saved = localStorage.getItem(STORAGE_KEY_GAS_URL);
    if (saved) return saved;

    // 3. Fallback to DEFAULT_GAS_URL from config
    if (DEFAULT_GAS_URL && !DEFAULT_GAS_URL.includes('EXAMPLE_REPLACE')) {
      return DEFAULT_GAS_URL;
    }

    return '';
  });

  const [syncStatus, setSyncStatus] = useState<SyncStatus>({
    lastSync: null,
    status: gasUrl ? 'idle' : 'local',
    mode: gasUrl ? 'gas' : 'local',
    autoSyncEnabled: false,
    intervalSeconds: 30,
  });

  // Active view tab
  const [activeTab, setActiveTab] = useState<'hierarchy' | 'table' | 'analytics'>('hierarchy');

  // Modals state
  const [isSyncModalOpen, setIsSyncModalOpen] = useState(false);
  const [isBatchCalcOpen, setIsBatchCalcOpen] = useState(false);
  const [isSimulateOpen, setIsSimulateOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Persist rows to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_BOM, JSON.stringify(rows));
  }, [rows]);

  // Save GAS URL to localStorage
  const handleSaveGasUrl = (url: string) => {
    setGasUrl(url);
    localStorage.setItem(STORAGE_KEY_GAS_URL, url);
    if (url) {
      setSyncStatus((prev) => ({ ...prev, mode: 'gas' }));
    }
  };

  // Trigger Sync with Google Apps Script endpoint
  const handleTriggerSync = useCallback(async () => {
    if (!gasUrl) {
      setIsSyncModalOpen(true);
      return;
    }

    setSyncStatus((prev) => ({ ...prev, status: 'syncing', errorMessage: undefined }));

    const sanitizeErrorMessage = (msg: string): string => {
      if (!msg) return 'Gagal terhubung ke Google Apps Script Web App.';
      const lower = msg.toLowerCase();
      if (
        lower.includes('unexpected token') ||
        lower.includes('not valid json') ||
        lower.includes('json.parse') ||
        lower.includes('the page') ||
        lower.includes('doctype') ||
        lower.includes('html')
      ) {
        return 'Google Apps Script mengembalikan halaman Web HTML (bukan JSON). Solusi: Di Google Apps Script, klik Deploy > New deployment > atur "Who has access" ke "Anyone" (Siapa saja) dan gunakan URL Web App berakhiran "/exec".';
      }
      if (
        lower.includes('sign in') ||
        lower.includes('accounts.google.com') ||
        lower.includes('google drive') ||
        lower.includes('access') ||
        lower.includes('ditolak')
      ) {
        return 'Akses ditolak oleh Google. Solusi: Ubah izin "Who has access" (Siapa yang memiliki akses) dari "Only myself" menjadi "Anyone" (Siapa saja) saat Deploy Web App.';
      }
      return msg;
    };

    const safeParseJSON = (text: string) => {
      if (!text || typeof text !== 'string') return null;
      const trimmed = text.trim();
      if (!trimmed.startsWith('{') && !trimmed.startsWith('[')) {
        return null;
      }
      try {
        return JSON.parse(trimmed);
      } catch {
        return null;
      }
    };

    try {
      let jsonData: any = null;
      let fetchErrorMessage: string | null = null;
      const cleanedUrl = gasUrl.trim();

      if (!cleanedUrl.startsWith('http')) {
        throw new Error('URL Google Apps Script tidak valid. URL harus diawali dengan https://script.google.com/macros/s/.../exec');
      }

      // 1. Try server proxy endpoint first (/api/fetch-sheet)
      try {
        const response = await fetch('/api/fetch-sheet', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url: cleanedUrl }),
        });

        const rawText = await response.text();
        const parsed = safeParseJSON(rawText);

        if (parsed) {
          if (parsed.status === 'success' && Array.isArray(parsed.data)) {
            jsonData = parsed;
          } else if (parsed.message) {
            fetchErrorMessage = sanitizeErrorMessage(parsed.message);
          }
        }
      } catch (proxyErr) {
        console.warn('API Proxy failed, attempting direct fetch:', proxyErr);
      }

      // 2. Fallback to direct client-side fetch if server proxy didn't return valid dataset
      if (!jsonData || !Array.isArray(jsonData.data)) {
        try {
          const directResponse = await fetch(cleanedUrl, {
            method: 'GET',
            redirect: 'follow',
          });

          const directText = await directResponse.text();
          const parsed = safeParseJSON(directText);

          if (parsed) {
            if (parsed.status === 'success' || Array.isArray(parsed.data)) {
              jsonData = parsed;
            } else if (parsed.message) {
              fetchErrorMessage = sanitizeErrorMessage(parsed.message);
            }
          } else {
            const lowerText = directText.toLowerCase();
            if (lowerText.includes('google drive') || lowerText.includes('sign in') || lowerText.includes('accounts.google.com')) {
              throw new Error('Akses ditolak oleh Google. Pastikan "Who has access" diset ke "Anyone" (Siapa saja) saat Deploy Web App di Google Apps Script.');
            } else {
              throw new Error('Google Apps Script mengembalikan halaman HTML/Teks (bukan JSON). Pastikan "Who has access" diset ke "Anyone" (Siapa saja) saat Deploy Web App.');
            }
          }
        } catch (directErr) {
          const msg = directErr instanceof Error ? directErr.message : String(directErr);
          throw new Error(fetchErrorMessage || sanitizeErrorMessage(msg));
        }
      }

      if (jsonData && Array.isArray(jsonData.data) && jsonData.data.length > 0) {
        setRows(jsonData.data);
        setSyncStatus((prev) => ({
          ...prev,
          status: 'connected',
          lastSync: new Date().toISOString(),
          mode: 'gas',
          errorMessage: undefined,
        }));
      } else {
        throw new Error(fetchErrorMessage || 'Data dari Google Apps Script kosong atau tidak berformat sesuai.');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setSyncStatus((prev) => ({
        ...prev,
        status: 'error',
        errorMessage: sanitizeErrorMessage(msg),
      }));
    }
  }, [gasUrl]);

  // Auto-sync interval handler
  useEffect(() => {
    if (!syncStatus.autoSyncEnabled || !gasUrl) return;

    const intervalId = setInterval(() => {
      handleTriggerSync();
    }, syncStatus.intervalSeconds * 1000);

    return () => clearInterval(intervalId);
  }, [syncStatus.autoSyncEnabled, syncStatus.intervalSeconds, gasUrl, handleTriggerSync]);

  // Process rows dynamically to recalculate total costs and HPP values
  const { processedRows, fgSummaries, totalBatchCost } = useMemo(() => {
    return processBOMData(rows);
  }, [rows]);

  // Update a specific row (e.g. price change, usage change)
  const handleUpdateRow = (rowId: string, updatedFields: Partial<BOMRow>) => {
    setRows((prev) =>
      prev.map((r) => (r.id === rowId ? { ...r, ...updatedFields } : r))
    );
  };

  // Delete row
  const handleDeleteRow = (rowId: string) => {
    setRows((prev) => prev.filter((r) => r.id !== rowId));
  };

  // Add new row
  const handleAddItem = (newRow: BOMRow) => {
    setRows((prev) => [...prev, newRow]);
  };

  // Apply simulated spreadsheet update
  const handleApplySimulation = (updatedRows: BOMRow[]) => {
    setRows(updatedRows);
    setSyncStatus((prev) => ({
      ...prev,
      status: 'simulated',
      lastSync: new Date().toISOString(),
    }));
  };

  // Reset to default initial screenshot dataset
  const handleResetToDefault = () => {
    setRows(INITIAL_BOM_DATA);
    setGasUrl('');
    localStorage.removeItem(STORAGE_KEY_BOM);
    localStorage.removeItem(STORAGE_KEY_GAS_URL);
    setSyncStatus({
      lastSync: null,
      status: 'local',
      mode: 'local',
      autoSyncEnabled: false,
      intervalSeconds: 30,
    });
    setIsSyncModalOpen(false);
  };

  // Export CSV function
  const handleExportCSV = () => {
    let csv = 'Kategori,Kode Baru,nama produk,unit produk,Tipe Produk,Minus,Finish goods,BB Pemakaian Qt,Harga Raw material,Total Harga Raw Material,Total Harga FG\n';
    processedRows.forEach((r) => {
      csv += `"${r.kategori}","${r.kode}","${r.nama_produk}","${r.unit_produk}","${r.tipe_produk}",${r.minus ?? ''},${r.finish_goods ?? ''},${r.bb_pemakaian_qt ?? ''},${r.harga_raw_material ?? ''},${r.total_harga_raw_material ?? ''},${r.total_harga_fg ?? ''}\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `BOM_Export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Calculate unique raw material types
  const uniqueRawMaterialsCount = useMemo(() => {
    const rawSet = new Set(
      rows.filter((r) => r.tipe_produk === 'raw_materials').map((r) => r.nama_produk)
    );
    return rawSet.size;
  }, [rows]);

  const categories = useMemo(() => {
    return Array.from(new Set(rows.map((r) => r.kategori)));
  }, [rows]);

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-800 font-sans antialiased flex flex-col">
      {/* Navigation Header */}
      <Header
        syncStatus={syncStatus}
        onRefresh={handleTriggerSync}
        onOpenSyncSettings={() => setIsSyncModalOpen(true)}
        onOpenBatchCalculator={() => setIsBatchCalcOpen(true)}
        onOpenSimulateModal={() => setIsSimulateOpen(true)}
        onOpenAddModal={() => setIsAddModalOpen(true)}
        onExportCSV={handleExportCSV}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* KPI Cards Summary */}
        <KPICards
          totalBatchCost={totalBatchCost}
          fgSummaries={fgSummaries}
          uniqueRawMaterialsCount={uniqueRawMaterialsCount}
        />

        {/* View Switching Navigation Tabs */}
        <div className="flex items-center justify-between border-b border-slate-200 mb-6 pb-2">
          <div className="flex items-center gap-1 sm:gap-2">
            <button
              id="tab-hierarchy"
              onClick={() => setActiveTab('hierarchy')}
              className={`inline-flex items-center gap-2 px-3.5 py-2 text-xs font-bold rounded-lg transition-colors ${
                activeTab === 'hierarchy'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-200/60 border border-slate-200'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Struktur Resep & HPP</span>
            </button>

            <button
              id="tab-table"
              onClick={() => setActiveTab('table')}
              className={`inline-flex items-center gap-2 px-3.5 py-2 text-xs font-bold rounded-lg transition-colors ${
                activeTab === 'table'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-200/60 border border-slate-200'
              }`}
            >
              <TableIcon className="w-4 h-4" />
              <span>Tabel Spreadsheet</span>
            </button>

            <button
              id="tab-analytics"
              onClick={() => setActiveTab('analytics')}
              className={`inline-flex items-center gap-2 px-3.5 py-2 text-xs font-bold rounded-lg transition-colors ${
                activeTab === 'analytics'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-200/60 border border-slate-200'
              }`}
            >
              <ChartIcon className="w-4 h-4" />
              <span>Analisis & Grafik Biaya</span>
            </button>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-xs text-slate-500">
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <span>5 Resep Active</span>
          </div>
        </div>

        {/* Dynamic Active Tab Content */}
        {activeTab === 'hierarchy' && (
          <HierarchicalView
            fgSummaries={fgSummaries}
            onUpdateRow={handleUpdateRow}
            allRows={processedRows}
          />
        )}

        {activeTab === 'table' && (
          <SpreadsheetTableView
            rows={processedRows}
            onUpdateRow={handleUpdateRow}
            onDeleteRow={handleDeleteRow}
            onOpenAddModal={() => setIsAddModalOpen(true)}
          />
        )}

        {activeTab === 'analytics' && (
          <CostAnalyticsView fgSummaries={fgSummaries} allRows={processedRows} />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-4 mt-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-xs text-slate-500">
          Dashboard Bill of Materials (BOM) &bull; Ditenagai oleh React, Express & Google Apps Script
        </div>
      </footer>

      {/* Modals */}
      <SyncSettingsModal
        isOpen={isSyncModalOpen}
        onClose={() => setIsSyncModalOpen(false)}
        syncStatus={syncStatus}
        gasUrl={gasUrl}
        onSaveGasUrl={handleSaveGasUrl}
        onTriggerSync={handleTriggerSync}
        onToggleAutoSync={(enabled, interval) =>
          setSyncStatus((prev) => ({
            ...prev,
            autoSyncEnabled: enabled,
            intervalSeconds: interval,
          }))
        }
        onResetToDefault={handleResetToDefault}
      />

      <BatchCalculatorModal
        isOpen={isBatchCalcOpen}
        onClose={() => setIsBatchCalcOpen(false)}
        fgSummaries={fgSummaries}
      />

      <SimulateSheetUpdateModal
        isOpen={isSimulateOpen}
        onClose={() => setIsSimulateOpen(false)}
        rows={rows}
        onApplySimulation={handleApplySimulation}
      />

      <AddItemModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        categories={categories}
        onAddItem={handleAddItem}
      />
    </div>
  );
}
