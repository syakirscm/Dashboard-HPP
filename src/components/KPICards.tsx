import React from 'react';
import { FinishedGoodSummary } from '../types/bom';
import { formatIDR, formatNumber } from '../utils/bomCalculations';
import { DollarSign, Package, Layers, TrendingUp, Sparkles, Scale } from 'lucide-react';

interface KPICardsProps {
  totalBatchCost: number;
  fgSummaries: FinishedGoodSummary[];
  uniqueRawMaterialsCount: number;
}

export const KPICards: React.FC<KPICardsProps> = ({
  totalBatchCost,
  fgSummaries,
  uniqueRawMaterialsCount,
}) => {
  // Compute highest & lowest HPP per unit
  const sortedByHPP = [...fgSummaries].sort((a, b) => b.hppPerUnit - a.hppPerUnit);
  const highestHPP = sortedByHPP[0];
  const lowestHPP = sortedByHPP[sortedByHPP.length - 1];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* Total Batch Cost */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs hover:border-emerald-300 transition-colors">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
            Total HPP Batch BOM
          </span>
          <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <DollarSign className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2">
          <div className="text-2xl font-bold text-slate-900">{formatIDR(totalBatchCost)}</div>
          <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-emerald-500" />
            Akumulasi 5 resep batch produksi
          </p>
        </div>
      </div>

      {/* Finished Goods Count */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs hover:border-indigo-300 transition-colors">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
            Total Produk Jadi (FG)
          </span>
          <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Package className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2">
          <div className="text-2xl font-bold text-slate-900">{fgSummaries.length} Varian</div>
          <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
            <Layers className="w-3 h-3 text-indigo-500" />
            {uniqueRawMaterialsCount} variasi bahan baku terhubung
          </p>
        </div>
      </div>

      {/* Highest HPP per Unit */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs hover:border-amber-300 transition-colors">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
            HPP Termahal / Unit
          </span>
          <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
            <TrendingUp className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2">
          {highestHPP ? (
            <>
              <div className="text-xl font-bold text-slate-900">
                {formatIDR(highestHPP.hppPerUnit)} <span className="text-xs text-slate-500 font-normal">/ {highestHPP.unit}</span>
              </div>
              <p className="text-xs text-amber-700 font-medium truncate mt-1">
                {highestHPP.nama} (Yield {formatNumber(highestHPP.yieldQty)} {highestHPP.unit})
              </p>
            </>
          ) : (
            <div className="text-sm text-slate-400">-</div>
          )}
        </div>
      </div>

      {/* Lowest HPP per Unit */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs hover:border-sky-300 transition-colors">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
            HPP Termurah / Unit
          </span>
          <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center">
            <Scale className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2">
          {lowestHPP ? (
            <>
              <div className="text-xl font-bold text-slate-900">
                {formatIDR(lowestHPP.hppPerUnit)} <span className="text-xs text-slate-500 font-normal">/ {lowestHPP.unit}</span>
              </div>
              <p className="text-xs text-sky-700 font-medium truncate mt-1">
                {lowestHPP.nama} (Yield {formatNumber(lowestHPP.yieldQty)} {lowestHPP.unit})
              </p>
            </>
          ) : (
            <div className="text-sm text-slate-400">-</div>
          )}
        </div>
      </div>
    </div>
  );
};
