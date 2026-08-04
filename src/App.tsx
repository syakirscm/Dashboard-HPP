import { useState, useEffect, useCallback, useMemo } from 'react';
import { BOMRow, SyncStatus } from './types/bom';
import { INITIAL_BOM_DATA } from './data/initialBOM';
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
    return localStorage.getItem(STORAGE_KEY_GAS_URL) || '';
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

    try {
      const response = await fetch('/api/fetch-sheet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: gasUrl }),
      });

      const json = await response.json();

      if (json.status === 'success' && Array.isArray(json.data) && json.data.length > 0) {
        setRows(json.data);
        setSyncStatus((prev) => ({
          ...prev,
          status: 'connected',
          lastSync: new Date().toISOString(),
          mode: 'gas',
        }));
      } else {
        throw new Error(json.message || 'Gagal memproses data dari Google Apps Script');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setSyncStatus((prev) => ({
        ...prev,
        status: 'error',
        errorMessage: msg,
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
