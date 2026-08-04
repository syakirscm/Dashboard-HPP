import React from 'react';
import { SyncStatus } from '../types/bom';
import {
  RefreshCw,
  FileSpreadsheet,
  Calculator,
  Sliders,
  Download,
  CheckCircle2,
  AlertCircle,
  Clock,
  Radio,
  PlusCircle,
} from 'lucide-react';

interface HeaderProps {
  syncStatus: SyncStatus;
  onRefresh: () => void;
  onOpenSyncSettings: () => void;
  onOpenBatchCalculator: () => void;
  onOpenSimulateModal: () => void;
  onOpenAddModal: () => void;
  onExportCSV: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  syncStatus,
  onRefresh,
  onOpenSyncSettings,
  onOpenBatchCalculator,
  onOpenSimulateModal,
  onOpenAddModal,
  onExportCSV,
}) => {
  const getStatusBadge = () => {
    switch (syncStatus.status) {
      case 'connected':
        return (
          <span className="inline-flex items-[#047857] items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#ECFDF5] border border-[#A7F3D0]">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981]" />
            Live Google Sheets
          </span>
        );
      case 'syncing':
        return (
          <span className="inline-flex items-[#B45309] items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#FFFBEB] border border-[#FDE68A]">
            <RefreshCw className="w-3.5 h-3.5 text-[#F59E0B] animate-spin" />
            Menyingkronkan...
          </span>
        );
      case 'error':
        return (
          <span className="inline-flex items-[#B91C1C] items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#FEF2F2] border border-[#FECACA]">
            <AlertCircle className="w-3.5 h-3.5 text-[#EF4444]" />
            Koneksi Terputus
          </span>
        );
      case 'simulated':
        return (
          <span className="inline-flex items-[#4338CA] items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#EEF2FF] border border-[#C7D2FE]">
            <Radio className="w-3.5 h-3.5 text-[#6366F1]" />
            Simulasi Edit Sheets
          </span>
        );
      default:
        return (
          <span className="inline-flex items-[#374151] items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#F3F4F6] border border-[#E5E7EB]">
            <Clock className="w-3.5 h-3.5 text-[#6B7280]" />
            Data Lokal (Default)
          </span>
        );
    }
  };

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between py-4 gap-4">
          {/* Title & Badge */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-sm shrink-0">
              <FileSpreadsheet className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                  Dashboard BOM & HPP Produk
                </h1>
                {getStatusBadge()}
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Sinkronisasi otomatis dengan Google Sheets via Google Apps Script (GAS)
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              id="btn-refresh-data"
              onClick={onRefresh}
              disabled={syncStatus.status === 'syncing'}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors disabled:opacity-50"
              title="Perbarui Data Sekarang"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${syncStatus.status === 'syncing' ? 'animate-spin text-emerald-600' : ''}`} />
              <span>Refresh</span>
            </button>

            <button
              id="btn-simulate-edit"
              onClick={onOpenSimulateModal}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-amber-800 bg-amber-50 border border-amber-300 rounded-lg hover:bg-amber-100 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-colors"
              title="Simulasi Perubahan Harga di Spreadsheet"
            >
              <Sliders className="w-3.5 h-3.5 text-amber-600" />
              <span>Simulasi Edit</span>
            </button>

            <button
              id="btn-batch-calc"
              onClick={onOpenBatchCalculator}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-indigo-700 bg-indigo-50 border border-indigo-200 rounded-lg hover:bg-indigo-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
              title="Hitung Kebutuhan Bahan Baku Batch Produksi"
            >
              <Calculator className="w-3.5 h-3.5 text-indigo-600" />
              <span>Kalkulator Batch</span>
            </button>

            <button
              id="btn-add-item"
              onClick={onOpenAddModal}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors"
            >
              <PlusCircle className="w-3.5 h-3.5 text-slate-600" />
              <span>Tambah Item</span>
            </button>

            <button
              id="btn-sync-settings"
              onClick={onOpenSyncSettings}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-1 transition-colors shadow-xs"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Setup Apps Script</span>
            </button>

            <button
              id="btn-export-csv"
              onClick={onExportCSV}
              className="inline-flex items-center gap-1.5 px-2.5 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
              title="Export BOM Data ke CSV"
            >
              <Download className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
