import React, { useState } from 'react';
import { FinishedGoodSummary } from '../types/bom';
import { formatIDR, formatNumber } from '../utils/bomCalculations';
import { X, Calculator, Printer, Copy, Check, Package, Sparkles } from 'lucide-react';

interface BatchCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  fgSummaries: FinishedGoodSummary[];
}

export const BatchCalculatorModal: React.FC<BatchCalculatorModalProps> = ({
  isOpen,
  onClose,
  fgSummaries,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>(
    fgSummaries[0]?.kategori || 'Adon Fla'
  );
  const [targetBatchQty, setTargetBatchQty] = useState<number>(
    fgSummaries[0]?.yieldQty || 4500
  );
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const currentFG = fgSummaries.find((fg) => fg.kategori === selectedCategory) || fgSummaries[0];

  const scaleFactor = targetBatchQty > 0 && currentFG ? targetBatchQty / currentFG.yieldQty : 1;

  const scaledIngredients = currentFG
    ? currentFG.ingredients.map((ing) => {
        const requiredQty = ing.usageQty * scaleFactor;
        const totalCost = requiredQty * ing.unitPrice;
        return {
          ...ing,
          requiredQty: Math.round(requiredQty * 100) / 100,
          totalCost: Math.round(totalCost),
        };
      })
    : [];

  const totalCalculatedBatchCost = scaledIngredients.reduce((acc, i) => acc + i.totalCost, 0);

  const handleCopyPlan = () => {
    let text = `=======================================\n`;
    text += `PERENCANAAN PRODUKSI BATCH BOM\n`;
    text += `Produk: ${currentFG.nama} (${currentFG.kode})\n`;
    text += `Target Produksi: ${formatNumber(targetBatchQty)} ${currentFG.unit}\n`;
    text += `Estimasi Biaya: ${formatIDR(totalCalculatedBatchCost)}\n`;
    text += `=======================================\n`;
    text += `KEBUTUHAN BAHAN BAKU:\n`;
    scaledIngredients.forEach((ing, i) => {
      text += `${i + 1}. [${ing.kode}] ${ing.nama}: ${formatNumber(ing.requiredQty)} ${ing.unit} (@ ${formatIDR(ing.unitPrice)} = ${formatIDR(ing.totalCost)})\n`;
    });
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="px-6 py-4 bg-indigo-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-300">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold tracking-tight">Kalkulator Perencanaan Batch Produksi</h3>
              <p className="text-xs text-indigo-200">
                Hitung otomatis kebutuhan bahan baku & total HPP berdasarkan target output
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-indigo-300 hover:text-white hover:bg-indigo-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* Controls */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Pilih Produk Jadi (FG)
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => {
                  setSelectedCategory(e.target.value);
                  const newFG = fgSummaries.find((f) => f.kategori === e.target.value);
                  if (newFG) setTargetBatchQty(newFG.yieldQty);
                }}
                className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {fgSummaries.map((fg) => (
                  <option key={fg.kategori} value={fg.kategori}>
                    {fg.nama} ({fg.kode})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Target Output Produksi ({currentFG?.unit})
              </label>
              <input
                type="number"
                value={targetBatchQty}
                onChange={(e) => setTargetBatchQty(Math.max(1, Number(e.target.value)))}
                className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Result Highlight Card */}
          <div className="bg-indigo-50/70 p-4 rounded-xl border border-indigo-200 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div>
              <span className="text-[11px] font-semibold text-indigo-700 uppercase tracking-wider block">
                Total Biaya Perencanaan Produksi
              </span>
              <span className="text-2xl font-extrabold text-indigo-950">
                {formatIDR(totalCalculatedBatchCost)}
              </span>
            </div>
            <div className="text-right sm:border-l border-indigo-200 sm:pl-4">
              <span className="text-[11px] text-slate-500 block">Biaya HPP Satuan</span>
              <span className="text-sm font-bold text-slate-800">
                {formatIDR(currentFG ? currentFG.hppPerUnit : 0)} / {currentFG?.unit}
              </span>
            </div>
          </div>

          {/* Calculated Ingredient Table */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <Package className="w-4 h-4 text-indigo-600" />
                Daftar Kebutuhan Bahan Baku
              </h4>
              <span className="text-xs text-slate-500">
                Resep Dasar: {formatNumber(currentFG?.yieldQty || 0)} {currentFG?.unit}
              </span>
            </div>

            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3">Kode</th>
                    <th className="py-2.5 px-3">Bahan Baku</th>
                    <th className="py-2.5 px-3 text-right">Jumlah Dibutuhkan</th>
                    <th className="py-2.5 px-3 text-right">Harga Satuan</th>
                    <th className="py-2.5 px-3 text-right">Total Biaya</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {scaledIngredients.map((ing) => (
                    <tr key={ing.kode} className="hover:bg-slate-50">
                      <td className="py-2 px-3 font-mono font-semibold text-slate-600">
                        {ing.kode}
                      </td>
                      <td className="py-2 px-3 font-medium text-slate-900">{ing.nama}</td>
                      <td className="py-2 px-3 text-right font-bold text-indigo-700">
                        {formatNumber(ing.requiredQty)} {ing.unit}
                      </td>
                      <td className="py-2 px-3 text-right text-slate-600">
                        {formatIDR(ing.unitPrice)}
                      </td>
                      <td className="py-2 px-3 text-right font-bold text-slate-900">
                        {formatIDR(ing.totalCost)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button
            onClick={handleCopyPlan}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-indigo-700 bg-white border border-indigo-200 hover:bg-indigo-50 rounded-lg transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-indigo-600" />
                <span>Rencana Berhasil Disalinkan!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Salin Rencana Pembelian</span>
              </>
            )}
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-200 hover:bg-slate-300 rounded-lg"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
