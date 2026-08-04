import React, { useState } from 'react';
import { BOMRow } from '../types/bom';
import { formatIDR } from '../utils/bomCalculations';
import { X, Sliders, RefreshCw, Sparkles, Check } from 'lucide-react';

interface SimulateSheetUpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
  rows: BOMRow[];
  onApplySimulation: (updatedRows: BOMRow[]) => void;
}

export const SimulateSheetUpdateModal: React.FC<SimulateSheetUpdateModalProps> = ({
  isOpen,
  onClose,
  rows,
  onApplySimulation,
}) => {
  // Pick unique raw materials to display price sliders/inputs
  const rawMaterialRows = rows.filter((r) => r.tipe_produk === 'raw_materials');

  // Map unique items by code
  const uniqueMaterials = Array.from(
    new Map(rawMaterialRows.map((r) => [r.nama_produk, r])).values()
  ) as BOMRow[];

  const [priceMap, setPriceMap] = useState<{ [name: string]: number }>(
    uniqueMaterials.reduce(
      (acc, rm) => ({ ...acc, [rm.nama_produk]: rm.harga_raw_material || 0 }),
      {}
    )
  );

  if (!isOpen) return null;

  const handlePriceChange = (name: string, newPrice: number) => {
    setPriceMap((prev) => ({ ...prev, [name]: newPrice }));
  };

  const handleApply = () => {
    // Clone all rows and update prices
    const updated = rows.map((r) => {
      if (r.tipe_produk === 'raw_materials' && priceMap[r.nama_produk] !== undefined) {
        const newPrice = priceMap[r.nama_produk];
        const usage = r.bb_pemakaian_qt ?? Math.abs(r.minus || 0);
        return {
          ...r,
          harga_raw_material: newPrice,
          total_harga_raw_material: Math.round(usage * newPrice),
        };
      }
      return r;
    });

    onApplySimulation(updated);
    onClose();
  };

  const quickPresets = [
    { label: 'Kenaikan Harga Telur (+20%)', item: 'Telur Ayam', factor: 1.2 },
    { label: 'Kenaikan Harga Milk (+15%)', item: 'Fresh Milk', factor: 1.15 },
    { label: 'Kenaikan Harga Ubi Ungu (+30%)', item: 'Ubi Ungu', factor: 1.3 },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-xl overflow-hidden my-8">
        {/* Header */}
        <div className="px-6 py-4 bg-amber-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-amber-300">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold tracking-tight">
                Simulasi Perubahan Data Spreadsheet
              </h3>
              <p className="text-xs text-amber-200">
                Ubah harga bahan baku untuk mensimulasikan update otomatis dari Google Sheet
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-amber-300 hover:text-white hover:bg-amber-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* Preset Buttons */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              Simulasi Cepat (Skenario Inflasi Supplier):
            </span>
            <div className="flex flex-wrap gap-2">
              {quickPresets.map((preset) => (
                <button
                  key={preset.label}
                  onClick={() => {
                    const current = priceMap[preset.item] || 0;
                    handlePriceChange(preset.item, Math.round(current * preset.factor));
                  }}
                  className="px-2.5 py-1 text-xs font-semibold text-amber-900 bg-amber-50 border border-amber-200 rounded-lg hover:bg-amber-100 transition-colors"
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* List of Unique Raw Materials */}
          <div className="space-y-2 border-t border-slate-200 pt-4">
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
              Daftar Harga Raw Material (IDR)
            </label>
            <div className="space-y-2">
              {uniqueMaterials.map((rm) => (
                <div
                  key={rm.nama_produk}
                  className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg border border-slate-200 text-xs"
                >
                  <div>
                    <span className="font-mono font-bold text-slate-500 mr-2">{rm.kode}</span>
                    <span className="font-bold text-slate-900">{rm.nama_produk}</span>
                    <span className="text-slate-500 ml-1">({rm.unit_produk})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-500 text-[11px]">Rp</span>
                    <input
                      type="number"
                      value={priceMap[rm.nama_produk] ?? 0}
                      onChange={(e) =>
                        handlePriceChange(rm.nama_produk, Number(e.target.value))
                      }
                      className="w-28 px-2 py-1 bg-white border border-slate-300 rounded text-right font-mono font-bold text-slate-900 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-200 rounded-lg"
          >
            Batal
          </button>
          <button
            onClick={handleApply}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-700 rounded-lg shadow-xs transition-colors"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Terapkan Perubahan Simulasi</span>
          </button>
        </div>
      </div>
    </div>
  );
};
