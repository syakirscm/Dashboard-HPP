import React, { useState } from 'react';
import { FinishedGoodSummary, BOMRow } from '../types/bom';
import { formatIDR, formatNumber } from '../utils/bomCalculations';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { BarChart3, PieChart as PieChartIcon, Share2, DollarSign } from 'lucide-react';

interface CostAnalyticsViewProps {
  fgSummaries: FinishedGoodSummary[];
  allRows: BOMRow[];
}

const COLORS = [
  '#10B981', // emerald
  '#F59E0B', // amber
  '#6366F1', // indigo
  '#06B6D4', // cyan
  '#EC4899', // pink
  '#8B5CF6', // violet
  '#14B8A6', // teal
  '#F97316', // orange
];

export const CostAnalyticsView: React.FC<CostAnalyticsViewProps> = ({
  fgSummaries,
  allRows,
}) => {
  const [selectedFG, setSelectedFG] = useState<string>(
    fgSummaries[0]?.kategori || 'Adon Fla'
  );

  // Prepare data for Bar Chart (Finished Goods comparison)
  const barData = fgSummaries.map((fg) => ({
    name: fg.nama,
    batchCost: fg.totalBatchCost,
    hppPerUnit: fg.hppPerUnit,
    unit: fg.unit,
  }));

  // Selected FG for pie chart
  const currentFG = fgSummaries.find((f) => f.kategori === selectedFG) || fgSummaries[0];

  const pieData = currentFG
    ? currentFG.ingredients.map((ing) => ({
        name: ing.nama,
        value: ing.totalCost,
        percentage: ing.costPercentage,
        usage: `${ing.usageQty} ${ing.unit}`,
      }))
    : [];

  // Group raw materials used across multiple recipes
  const rawMaterialUsageMap: {
    [name: string]: {
      kode: string;
      unit: string;
      price: number;
      usedIn: { category: string; usage: number; cost: number }[];
      totalCostAcrossAll: number;
    };
  } = {};

  allRows
    .filter((r) => r.tipe_produk === 'raw_materials')
    .forEach((rm) => {
      const name = rm.nama_produk;
      if (!rawMaterialUsageMap[name]) {
        rawMaterialUsageMap[name] = {
          kode: rm.kode,
          unit: rm.unit_produk,
          price: rm.harga_raw_material || 0,
          usedIn: [],
          totalCostAcrossAll: 0,
        };
      }
      const usage = rm.bb_pemakaian_qt || 0;
      const cost = rm.total_harga_raw_material || 0;
      rawMaterialUsageMap[name].usedIn.push({
        category: rm.kategori,
        usage: usage,
        cost: cost,
      });
      rawMaterialUsageMap[name].totalCostAcrossAll += cost;
    });

  const sharedRawMaterials = Object.entries(rawMaterialUsageMap).sort(
    (a, b) => b[1].totalCostAcrossAll - a[1].totalCostAcrossAll
  );

  return (
    <div className="space-y-6">
      {/* Chart Row 1: Bar Chart Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-emerald-600" />
                Perbandingan Total Biaya Batch HPP Produk
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Nilai total biaya produksi (IDR) per resep batch
              </p>
            </div>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} margin={{ top: 10, right: 10, left: 10, bottom: 25 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 11, fill: '#64748B' }}
                  interval={0}
                  angle={-10}
                  textAnchor="end"
                />
                <YAxis
                  tick={{ fontSize: 11, fill: '#64748B' }}
                  tickFormatter={(val) => `Rp ${(val / 1000).toFixed(0)}k`}
                />
                <Tooltip
                  formatter={(value: any) => [formatIDR(Number(value)), 'Total Biaya Batch']}
                  contentStyle={{
                    borderRadius: '8px',
                    border: '1px solid #E2E8F0',
                    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: 12, paddingTop: 10 }} />
                <Bar
                  dataKey="batchCost"
                  name="Total Biaya Batch (IDR)"
                  fill="#10B981"
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart Row 1 Side: Donut Chart per Finished Good */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <PieChartIcon className="w-4 h-4 text-amber-600" />
                Proporsi Biaya Bahan Baku
              </h3>
            </div>

            {/* Category selector dropdown */}
            <select
              value={selectedFG}
              onChange={(e) => setSelectedFG(e.target.value)}
              className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500 mb-4"
            >
              {fgSummaries.map((fg) => (
                <option key={fg.kategori} value={fg.kategori}>
                  {fg.nama} ({formatIDR(fg.totalBatchCost)})
                </option>
              ))}
            </select>

            <div className="h-44 w-full relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={70}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {pieData.map((_entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(val: any) => [formatIDR(Number(val)), 'Biaya Total']}
                    contentStyle={{ borderRadius: '8px', fontSize: '11px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Ingredient list snippet */}
          <div className="mt-2 pt-3 border-t border-slate-100 space-y-1.5 max-h-36 overflow-y-auto">
            {currentFG &&
              currentFG.ingredients.map((ing, idx) => (
                <div key={ing.kode} className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-1.5 truncate">
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: COLORS[idx % COLORS.length] }}
                    />
                    <span className="font-medium text-slate-700 truncate">{ing.nama}</span>
                  </span>
                  <span className="font-semibold text-slate-900 shrink-0">
                    {ing.costPercentage}% ({formatIDR(ing.totalCost)})
                  </span>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Shared Raw Materials Usage Breakdown */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
        <div className="mb-4">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Share2 className="w-5 h-5 text-indigo-600" />
            Penggunaan Bahan Baku Lintas Resep & Total Pengeluaran
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Analisis bahan baku yang digunakan di lebih dari satu produk untuk efisiensi pengadaan/bulk buying.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sharedRawMaterials.map(([name, info]) => {
            const isShared = info.usedIn.length > 1;
            return (
              <div
                key={name}
                className={`p-4 rounded-xl border ${
                  isShared
                    ? 'bg-indigo-50/40 border-indigo-200'
                    : 'bg-white border-slate-200'
                } hover:shadow-xs transition-shadow`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                      {info.kode}
                    </span>
                    <h4 className="text-sm font-bold text-slate-900 mt-1">{name}</h4>
                  </div>
                  <span className="text-xs font-bold text-slate-900 bg-white px-2.5 py-1 rounded-lg border border-slate-200 shadow-2xs">
                    {formatIDR(info.totalCostAcrossAll)}
                  </span>
                </div>

                <div className="text-xs text-slate-600 mb-2">
                  Harga Satuan:{' '}
                  <strong className="text-slate-800">
                    {formatIDR(info.price)} / {info.unit}
                  </strong>
                </div>

                {/* Recipe usage breakdown */}
                <div className="space-y-1.5 pt-2 border-t border-slate-200/60">
                  <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 block">
                    Digunakan Pada ({info.usedIn.length} resep):
                  </span>
                  {info.usedIn.map((u) => (
                    <div
                      key={u.category}
                      className="flex items-center justify-between text-xs bg-white px-2 py-1 rounded border border-slate-100"
                    >
                      <span className="font-medium text-slate-700">{u.category}</span>
                      <span className="text-slate-600 font-mono">
                        {formatNumber(u.usage)} {info.unit} ({formatIDR(u.cost)})
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
