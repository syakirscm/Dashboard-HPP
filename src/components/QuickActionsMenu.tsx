import React, { useState, useRef, useEffect } from 'react';
import { SyncStatus } from '../types/bom';
import {
  Menu,
  RefreshCw,
  FileSpreadsheet,
  Calculator,
  Sliders,
  Download,
  PlusCircle,
  Sparkles,
  ChevronDown,
  Wrench,
  Database,
  Table,
} from 'lucide-react';

interface QuickActionsMenuProps {
  syncStatus: SyncStatus;
  onRefresh: () => void;
  onOpenSyncSettings: () => void;
  onOpenBatchCalculator: () => void;
  onOpenSimulateModal: () => void;
  onOpenAddModal: () => void;
  onExportCSV: () => void;
}

export const QuickActionsMenu: React.FC<QuickActionsMenuProps> = ({
  syncStatus,
  onRefresh,
  onOpenSyncSettings,
  onOpenBatchCalculator,
  onOpenSimulateModal,
  onOpenAddModal,
  onExportCSV,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block text-left" ref={menuRef}>
      {/* Tombol Utama Menu Khusus */}
      <button
        id="btn-menu-khusus"
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={`inline-flex items-center gap-2 px-3.5 py-2 text-xs font-bold rounded-xl transition-all shadow-xs border ${
          isOpen
            ? 'bg-slate-900 text-white border-slate-900 ring-2 ring-emerald-500/20'
            : 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100 hover:border-emerald-300'
        }`}
        title="Buka Menu Khusus & Alat"
      >
        <Wrench className="w-4 h-4 text-emerald-600 group-hover:rotate-12 transition-transform" />
        <span>Menu Khusus</span>
        <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Popover Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-slate-200 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="px-4 py-3 bg-gradient-to-r from-slate-900 to-slate-800 text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-bold tracking-wide uppercase">Menu Khusus Alat</span>
            </div>
            <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full font-medium">
              BOM HPP
            </span>
          </div>

          <div className="p-2 space-y-3">
            {/* Kelompok 1: Integrasi & Data */}
            <div>
              <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                <Database className="w-3 h-3 text-emerald-600" />
                <span>Integrasi Spreadsheet</span>
              </div>
              <div className="mt-1 space-y-0.5">
                <button
                  onClick={() => {
                    onOpenSyncSettings();
                    setIsOpen(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-slate-700 hover:bg-emerald-50 hover:text-emerald-900 rounded-lg transition-colors text-left font-medium group"
                >
                  <div className="w-6 h-6 rounded-md bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                    <FileSpreadsheet className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="font-semibold text-slate-800 group-hover:text-emerald-900">Setup Apps Script</div>
                    <div className="text-[10px] text-slate-500">Hubungkan Web App live sync</div>
                  </div>
                </button>

                <button
                  onClick={() => {
                    onRefresh();
                    setIsOpen(false);
                  }}
                  disabled={syncStatus.status === 'syncing'}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-slate-700 hover:bg-slate-100 rounded-lg transition-colors text-left font-medium group disabled:opacity-50"
                >
                  <div className="w-6 h-6 rounded-md bg-slate-100 text-slate-600 flex items-center justify-center shrink-0 group-hover:bg-slate-200">
                    <RefreshCw className={`w-3.5 h-3.5 ${syncStatus.status === 'syncing' ? 'animate-spin text-emerald-600' : ''}`} />
                  </div>
                  <div>
                    <div className="font-semibold text-slate-800">Refresh Data</div>
                    <div className="text-[10px] text-slate-500">Tarik ulang data dari Apps Script</div>
                  </div>
                </button>
              </div>
            </div>

            <div className="border-t border-slate-100 my-1" />

            {/* Kelompok 2: Fitur Simulasi & Kalkulator */}
            <div>
              <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                <Calculator className="w-3 h-3 text-indigo-600" />
                <span>Simulasi & Hitung</span>
              </div>
              <div className="mt-1 space-y-0.5">
                <button
                  onClick={() => {
                    onOpenSimulateModal();
                    setIsOpen(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-slate-700 hover:bg-amber-50 hover:text-amber-900 rounded-lg transition-colors text-left font-medium group"
                >
                  <div className="w-6 h-6 rounded-md bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 group-hover:bg-amber-500 group-hover:text-white transition-colors">
                    <Sliders className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="font-semibold text-slate-800 group-hover:text-amber-950">Simulasi Edit Spreadsheet</div>
                    <div className="text-[10px] text-slate-500">Uji dampak harga raw material</div>
                  </div>
                </button>

                <button
                  onClick={() => {
                    onOpenBatchCalculator();
                    setIsOpen(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-slate-700 hover:bg-indigo-50 hover:text-indigo-900 rounded-lg transition-colors text-left font-medium group"
                >
                  <div className="w-6 h-6 rounded-md bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                    <Calculator className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="font-semibold text-slate-800 group-hover:text-indigo-950">Kalkulator Batch</div>
                    <div className="text-[10px] text-slate-500">Hitung total kebutuhan bahan</div>
                  </div>
                </button>
              </div>
            </div>

            <div className="border-t border-slate-100 my-1" />

            {/* Kelompok 3: Aksi Data */}
            <div>
              <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                <Table className="w-3 h-3 text-emerald-600" />
                <span>Manajemen Data BOM</span>
              </div>
              <div className="mt-1 space-y-0.5">
                <button
                  onClick={() => {
                    onOpenAddModal();
                    setIsOpen(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-slate-700 hover:bg-emerald-50 hover:text-emerald-900 rounded-lg transition-colors text-left font-medium group"
                >
                  <div className="w-6 h-6 rounded-md bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                    <PlusCircle className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="font-semibold text-slate-800 group-hover:text-emerald-950">Tambah Item Baru</div>
                    <div className="text-[10px] text-slate-500">Input resep atau bahan baru</div>
                  </div>
                </button>

                <button
                  onClick={() => {
                    onExportCSV();
                    setIsOpen(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-slate-700 hover:bg-slate-100 rounded-lg transition-colors text-left font-medium group"
                >
                  <div className="w-6 h-6 rounded-md bg-slate-100 text-slate-600 flex items-center justify-center shrink-0 group-hover:bg-slate-200">
                    <Download className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="font-semibold text-slate-800">Export ke CSV</div>
                    <div className="text-[10px] text-slate-500">Unduh data BOM format spreadsheet</div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
