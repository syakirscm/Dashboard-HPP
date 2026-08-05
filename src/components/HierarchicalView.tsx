import React, { useState } from 'react';
import { FinishedGoodSummary, BOMRow } from '../types/bom';
import { formatIDR, formatNumber } from '../utils/bomCalculations';
import {
  ChevronDown,
  ChevronRight,
  PackageCheck,
  Percent,
  Edit2,
  Check,
  X,
  PieChart as PieIcon,
  ShoppingBag,
  Filter,
} from 'lucide-react';

interface HierarchicalViewProps {
  fgSummaries: FinishedGoodSummary[];
  onUpdateRow: (rowId: string, updatedFields: Partial<BOMRow>) => void;
  allRows: BOMRow[];
}

export const HierarchicalView: React.FC<HierarchicalViewProps> = ({
  fgSummaries,
  onUpdateRow,
  allRows,
}) => {
  const [expandedCats, setExpandedCats] = useState<{ [cat: string]: boolean }>({
    'Adon Fla': true,
    'Adon Fla Cream Cheese': true,
    'Adon Klappy': true,
    'Adonan Bola Ubi': true,
    'Adonan Kulit Pie': true,
  });

  const [editingRowId, setEditingRowId] = useState<string | null>(null);
  const [editPrice, setEditPrice] = useState<number>(0);
  const [editQty, setEditQty] = useState<number>(0);

  // Filter States for Kategori, Kode Baru, and nama produk
  const [filterKategori, setFilterKategori] = useState<string>('ALL');
  const [filterKode, setFilterKode] = useState<string>('');
  const [filterNama, setFilterNama] = useState<string>('');

  const categories = Array.from(new Set(allRows.map((r) => r.kategori).filter(Boolean))).sort();
  const uniqueCodes = Array.from(new Set(allRows.map((r) => r.kode).filter(Boolean))).sort();
  const uniqueProductNames = Array.from(new Set(allRows.map((r) => r.nama_produk).filter(Boolean))).sort();

  const isFilterActive =
    filterKategori !== 'ALL' || filterKode !== '' || filterNama !== '';

  const handleResetFilters = () => {
    setFilterKategori('ALL');
    setFilterKode('');
    setFilterNama('');
  };

  const filteredFgSummaries = fgSummaries.filter((fg) => {
    const matchesCat =
      filterKategori === 'ALL' || fg.kategori === filterKategori;

    const matchesKode =
      !filterKode ||
      fg.kode.toLowerCase().includes(filterKode.toLowerCase()) ||
      fg.ingredients.some((ing) =>
        ing.kode.toLowerCase().includes(filterKode.toLowerCase())
      );

    const matchesNama =
      !filterNama ||
      fg.nama.toLowerCase().includes(filterNama.toLowerCase()) ||
      fg.ingredients.some((ing) =>
        ing.nama.toLowerCase().includes(filterNama.toLowerCase())
      );

    return matchesCat && matchesKode && matchesNama;
  });

  const toggleCategory = (cat: string) => {
    setExpandedCats((prev) => ({ ...prev, [cat]: !prev[cat] }));
  };

  const startEditing = (rowId: string, currentPrice: number, currentQty: number) => {
    setEditingRowId(rowId);
    setEditPrice(currentPrice);
    setEditQty(currentQty);
  };

  const cancelEditing = () => {
    setEditingRowId(null);
  };

  const saveEditing = (rowId: string, isFG: boolean) => {
    if (isFG) {
      onUpdateRow(rowId, {
        finish_goods: editQty,
      });
    } else {
      onUpdateRow(rowId, {
        harga_raw_material: editPrice,
        bb_pemakaian_qt: editQty,
        minus: -Math.abs(editQty),
      });
    }
    setEditingRowId(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <PackageCheck className="w-5 h-5 text-emerald-600" />
            Struktur Resep & HPP per Kategori
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Breakdown komposisi bahan baku, persentase kontribusi biaya, dan HPP unit produk jadi.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() =>
              setExpandedCats(
                fgSummaries.reduce((acc, fg) => ({ ...acc, [fg.kategori]: true }), {})
              )
            }
            className="text-xs text-emerald-700 hover:text-emerald-900 font-medium px-2.5 py-1 bg-emerald-50 rounded border border-emerald-200"
          >
            Buka Semua
          </button>
          <button
            onClick={() =>
              setExpandedCats(
                fgSummaries.reduce((acc, fg) => ({ ...acc, [fg.kategori]: false }), {})
              )
            }
            className="text-xs text-slate-600 hover:text-slate-800 font-medium px-2.5 py-1 bg-slate-100 rounded border border-slate-200"
          >
            Tutup Semua
          </button>
        </div>
      </div>

      {/* Filter Card for Hierarchical View */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-emerald-600" />
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Filter Resep & Bahan
            </span>
          </div>
          {isFilterActive && (
            <button
              onClick={handleResetFilters}
              className="inline-flex items-center gap-1 text-[11px] font-medium text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 px-2 py-0.5 rounded border border-rose-200 transition-colors"
            >
              <X className="w-3 h-3" />
              Reset Filter
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* 1. Filter Kategori */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
              Kategori
            </label>
            <select
              value={filterKategori}
              onChange={(e) => setFilterKategori(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800 font-medium"
            >
              <option value="ALL">Semua Kategori ({categories.length})</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* 2. Filter Kode Baru */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
              Kode Baru
            </label>
            <div className="relative">
              <input
                type="text"
                list="hierarchical-kode-list"
                placeholder="Cari Kode Baru..."
                value={filterKode}
                onChange={(e) => setFilterKode(e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800 font-mono"
              />
              <datalist id="hierarchical-kode-list">
                {uniqueCodes.map((code) => (
                  <option key={code} value={code} />
                ))}
              </datalist>
              {filterKode && (
                <button
                  onClick={() => setFilterKode('')}
                  className="absolute right-2 top-2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>

          {/* 3. Filter nama produk */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
              nama produk
            </label>
            <div className="relative">
              <input
                type="text"
                list="hierarchical-nama-list"
                placeholder="Cari nama produk / bahan..."
                value={filterNama}
                onChange={(e) => setFilterNama(e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800"
              />
              <datalist id="hierarchical-nama-list">
                {uniqueProductNames.map((name) => (
                  <option key={name} value={name} />
                ))}
              </datalist>
              {filterNama && (
                <button
                  onClick={() => setFilterNama('')}
                  className="absolute right-2 top-2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5">
        {filteredFgSummaries.length === 0 ? (
          <div className="bg-white p-8 rounded-xl border border-slate-200 text-center text-slate-500">
            Tidak ada resep yang sesuai dengan filter yang dipilih.
            <button
              onClick={handleResetFilters}
              className="mt-2 block mx-auto text-xs text-emerald-600 hover:underline font-semibold"
            >
              Reset semua filter
            </button>
          </div>
        ) : (
          filteredFgSummaries.map((fg) => {
          const isExpanded = expandedCats[fg.kategori] ?? true;
          const fgRowObj = allRows.find(
            (r) => r.kategori === fg.kategori && r.tipe_produk === 'finish_goods'
          );

          return (
            <div
              key={fg.kategori}
              className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs transition-all hover:border-slate-300"
            >
              {/* Finished Good Category Header */}
              <div
                onClick={() => toggleCategory(fg.kategori)}
                className="px-5 py-4 bg-gradient-to-r from-amber-50/70 via-amber-50/30 to-white border-b border-amber-100 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer select-none"
              >
                <div className="flex items-start md:items-center gap-3">
                  <button className="p-1 rounded-md text-amber-800 hover:bg-amber-100 mt-0.5 md:mt-0 transition-colors">
                    {isExpanded ? (
                      <ChevronDown className="w-5 h-5" />
                    ) : (
                      <ChevronRight className="w-5 h-5" />
                    )}
                  </button>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-2 py-0.5 rounded text-xs font-bold bg-amber-200/80 text-amber-900 font-mono">
                        {fg.kode}
                      </span>
                      <h3 className="text-base font-bold text-slate-900">{fg.nama}</h3>
                      <span className="text-xs text-slate-500 font-medium">({fg.kategori})</span>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-slate-600 mt-1">
                      <span>
                        Yield Total:{' '}
                        <strong className="text-slate-800">
                          {formatNumber(fg.yieldQty)} {fg.unit}
                        </strong>
                      </span>
                      <span>•</span>
                      <span>{fg.rawMaterialsCount} Bahan Baku</span>
                    </div>
                  </div>
                </div>

                {/* HPP Metric Pills */}
                <div className="flex items-center gap-3 shrink-0 bg-white px-3 py-2 rounded-xl border border-amber-200/80 shadow-2xs overflow-x-auto">
                  <div className="text-right px-1">
                    <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                      Harga BB
                    </span>
                    <span className="text-xs font-bold text-amber-950">
                      Rp {formatNumber(fg.hargaBB)}
                    </span>
                  </div>
                  <div className="h-6 w-px bg-slate-200" />
                  <div className="text-right px-1">
                    <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block">
                      Labour / {fg.unit}
                    </span>
                    <span className="text-xs font-bold text-slate-800 font-mono">
                      Rp {formatNumber(fg.labourCost)} <span className="text-[10px] font-normal text-slate-500">/{fg.unit}</span>
                    </span>
                  </div>
                  <div className="h-6 w-px bg-slate-200" />
                  <div className="text-right px-1">
                    <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block">
                      Overhead / {fg.unit}
                    </span>
                    <span className="text-xs font-bold text-slate-800 font-mono">
                      Rp {formatNumber(fg.overheadCost)} <span className="text-[10px] font-normal text-slate-500">/{fg.unit}</span>
                    </span>
                  </div>
                  <div className="h-6 w-px bg-slate-200" />
                  <div className="text-right px-1 bg-rose-50/70 rounded-md py-0.5">
                    <span className="text-[10px] font-extrabold text-rose-700 uppercase tracking-wider block">
                      TOTAL HPP
                    </span>
                    <span className="text-sm font-extrabold text-rose-700">
                      Rp {formatNumber(fg.totalHPP)}
                    </span>
                  </div>
                  <div className="h-6 w-px bg-slate-200" />
                  <div className="text-right px-1 bg-emerald-50/70 rounded-md py-0.5">
                    <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider block">
                      H Jual ({Math.round(fg.marginSCM * 100)}%)
                    </span>
                    <span className="text-sm font-extrabold text-emerald-700">
                      Rp {formatNumber(fg.hJualSCM)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Collapsible Body */}
              {isExpanded && (
                <div className="p-5">
                  {/* Visual Cost Distribution Bar */}
                  <div className="mb-4 bg-slate-50 p-3 rounded-lg border border-slate-100">
                    <div className="flex items-center justify-between text-xs font-semibold text-slate-600 mb-1.5">
                      <span className="flex items-center gap-1">
                        <PieIcon className="w-3.5 h-3.5 text-amber-600" />
                        Distribusi Biaya Bahan Baku
                      </span>
                      <span>100% Total Batch</span>
                    </div>
                    <div className="w-full h-3 rounded-full bg-slate-200 flex overflow-hidden">
                      {fg.ingredients.map((ing, idx) => {
                        const colors = [
                          'bg-emerald-500',
                          'bg-amber-500',
                          'bg-indigo-500',
                          'bg-sky-500',
                          'bg-rose-500',
                          'bg-teal-500',
                          'bg-purple-500',
                          'bg-orange-500',
                        ];
                        const barColor = colors[idx % colors.length];
                        return (
                          <div
                            key={ing.kode}
                            style={{ width: `${ing.costPercentage}%` }}
                            className={`${barColor} transition-all relative group`}
                            title={`${ing.nama}: ${ing.costPercentage}% (${formatIDR(ing.totalCost)})`}
                          />
                        );
                      })}
                    </div>
                    {/* Compact legend */}
                    <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-[11px] text-slate-600">
                      {fg.ingredients.map((ing, idx) => {
                        const colors = [
                          'bg-emerald-500',
                          'bg-amber-500',
                          'bg-indigo-500',
                          'bg-sky-500',
                          'bg-rose-500',
                          'bg-teal-500',
                          'bg-purple-500',
                          'bg-orange-500',
                        ];
                        return (
                          <span key={ing.kode} className="flex items-center gap-1.5">
                            <span className={`w-2 h-2 rounded-full ${colors[idx % colors.length]}`} />
                            <span className="font-medium text-slate-800">{ing.nama}:</span>
                            <span className="text-slate-500">{ing.costPercentage}%</span>
                          </span>
                        );
                      })}
                    </div>
                  </div>

                  {/* Raw Materials Table */}
                  <div className="overflow-x-auto border border-slate-200 rounded-lg">
                    <table className="w-full text-xs text-left">
                      <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                        <tr>
                          <th className="py-2.5 px-3">Kode</th>
                          <th className="py-2.5 px-3">Nama Bahan Baku</th>
                          <th className="py-2.5 px-3 text-right">Pemakaian</th>
                          <th className="py-2.5 px-3 text-right">Harga Satuan</th>
                          <th className="py-2.5 px-3 text-right">Total Biaya RM</th>
                          <th className="py-2.5 px-3 text-center">Kontribusi (%)</th>
                          <th className="py-2.5 px-3 text-center">Aksi</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {fg.ingredients.map((ing) => {
                          const matchingRow = allRows.find(
                            (r) => r.kategori === fg.kategori && r.kode === ing.kode
                          );
                          const isEditing = matchingRow && editingRowId === matchingRow.id;

                          return (
                            <tr key={ing.kode} className="hover:bg-slate-50/70 transition-colors">
                              <td className="py-2.5 px-3 font-mono font-medium text-slate-600">
                                {ing.kode}
                              </td>
                              <td className="py-2.5 px-3 font-medium text-slate-900">
                                {ing.nama}
                              </td>

                              {/* Usage Qty */}
                              <td className="py-2.5 px-3 text-right font-medium text-slate-700">
                                {isEditing ? (
                                  <input
                                    type="number"
                                    value={editQty}
                                    onChange={(e) => setEditQty(Number(e.target.value))}
                                    className="w-20 px-2 py-1 text-xs border border-emerald-400 rounded focus:outline-none focus:ring-1 focus:ring-emerald-500 text-right font-mono"
                                  />
                                ) : (
                                  `${formatNumber(ing.usageQty)} ${ing.unit}`
                                )}
                              </td>

                              {/* Price per unit */}
                              <td className="py-2.5 px-3 text-right font-medium text-slate-700">
                                {isEditing ? (
                                  <input
                                    type="number"
                                    value={editPrice}
                                    onChange={(e) => setEditPrice(Number(e.target.value))}
                                    className="w-24 px-2 py-1 text-xs border border-emerald-400 rounded focus:outline-none focus:ring-1 focus:ring-emerald-500 text-right font-mono"
                                  />
                                ) : (
                                  formatIDR(ing.unitPrice)
                                )}
                              </td>

                              {/* Total Cost */}
                              <td className="py-2.5 px-3 text-right font-bold text-slate-900">
                                {formatIDR(ing.totalCost)}
                              </td>

                              {/* Cost Percentage Bar */}
                              <td className="py-2.5 px-3">
                                <div className="flex items-center gap-2 justify-center">
                                  <div className="w-16 bg-slate-100 h-2 rounded-full overflow-hidden shrink-0">
                                    <div
                                      style={{ width: `${Math.min(ing.costPercentage, 100)}%` }}
                                      className="bg-emerald-500 h-full rounded-full"
                                    />
                                  </div>
                                  <span className="font-semibold text-slate-700 w-10 text-right font-mono">
                                    {ing.costPercentage}%
                                  </span>
                                </div>
                              </td>

                              {/* Edit Action */}
                              <td className="py-2.5 px-3 text-center">
                                {matchingRow && (
                                  <>
                                    {isEditing ? (
                                      <div className="flex items-center justify-center gap-1">
                                        <button
                                          onClick={() => saveEditing(matchingRow.id, false)}
                                          className="p-1 text-emerald-600 hover:bg-emerald-50 rounded"
                                          title="Simpan"
                                        >
                                          <Check className="w-3.5 h-3.5" />
                                        </button>
                                        <button
                                          onClick={cancelEditing}
                                          className="p-1 text-rose-600 hover:bg-rose-50 rounded"
                                          title="Batal"
                                        >
                                          <X className="w-3.5 h-3.5" />
                                        </button>
                                      </div>
                                    ) : (
                                      <button
                                        onClick={() =>
                                          startEditing(matchingRow.id, ing.unitPrice, ing.usageQty)
                                        }
                                        className="p-1 text-slate-400 hover:text-emerald-600 hover:bg-slate-100 rounded transition-colors"
                                        title="Edit Harga/Pemakaian"
                                      >
                                        <Edit2 className="w-3.5 h-3.5" />
                                      </button>
                                    )}
                                  </>
                                )}
                              </td>
                            </tr>
                          );
                        })}

                        {/* Finish Good Summary Row inside table */}
                        {fgRowObj && (
                          <tr className="bg-amber-50/80 font-bold border-t-2 border-amber-200 text-amber-950">
                            <td className="py-3 px-3 font-mono">{fgRowObj.kode}</td>
                            <td className="py-3 px-3 flex items-center gap-1.5">
                              <ShoppingBag className="w-3.5 h-3.5 text-amber-700" />
                              <span>{fgRowObj.nama_produk} (FG Yield)</span>
                            </td>
                            <td className="py-3 px-3 text-right">
                              {editingRowId === fgRowObj.id ? (
                                <input
                                  type="number"
                                  value={editQty}
                                  onChange={(e) => setEditQty(Number(e.target.value))}
                                  className="w-20 px-2 py-1 text-xs border border-amber-400 rounded focus:outline-none text-right font-mono"
                                />
                              ) : (
                                `${formatNumber(fg.yieldQty)} ${fg.unit}`
                              )}
                            </td>
                            <td className="py-3 px-3 text-right text-slate-500 font-normal">
                              (Hasil Olahan)
                            </td>
                            <td className="py-3 px-3 text-right text-slate-900 font-extrabold text-sm">
                              {formatIDR(fg.totalBatchCost)}
                            </td>
                            <td className="py-3 px-3 text-center text-emerald-800 font-extrabold">
                              HPP: {formatIDR(fg.hppPerUnit)} / {fg.unit}
                            </td>
                            <td className="py-3 px-3 text-center">
                              {editingRowId === fgRowObj.id ? (
                                <div className="flex items-center justify-center gap-1">
                                  <button
                                    onClick={() => saveEditing(fgRowObj.id, true)}
                                    className="p-1 text-emerald-600 hover:bg-emerald-50 rounded"
                                  >
                                    <Check className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    onClick={cancelEditing}
                                    className="p-1 text-rose-600 hover:bg-rose-50 rounded"
                                  >
                                    <X className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              ) : (
                                <button
                                  onClick={() => startEditing(fgRowObj.id, 0, fg.yieldQty)}
                                  className="p-1 text-amber-700 hover:text-amber-900 hover:bg-amber-100 rounded"
                                  title="Edit Yield Quantity FG"
                                >
                                  <Edit2 className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          );
        })
      )}
      </div>
    </div>
  );
};
