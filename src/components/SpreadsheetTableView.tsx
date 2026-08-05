import React, { useState } from 'react';
import { BOMRow } from '../types/bom';
import { formatIDR, formatNumber } from '../utils/bomCalculations';
import {
  Search,
  Filter,
  ArrowUpDown,
  FileSpreadsheet,
  Edit3,
  Check,
  X,
  Plus,
} from 'lucide-react';

interface SpreadsheetTableViewProps {
  rows: BOMRow[];
  onUpdateRow: (rowId: string, updatedFields: Partial<BOMRow>) => void;
  onDeleteRow: (rowId: string) => void;
  onOpenAddModal: () => void;
}

export const SpreadsheetTableView: React.FC<SpreadsheetTableViewProps> = ({
  rows,
  onUpdateRow,
  onDeleteRow,
  onOpenAddModal,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [filterKode, setFilterKode] = useState<string>('');
  const [filterNama, setFilterNama] = useState<string>('');
  const [selectedType, setSelectedType] = useState<string>('ALL');
  const [sortField, setSortField] = useState<keyof BOMRow>('kategori');
  const [sortAsc, setSortAsc] = useState(true);

  // Inline editing state
  const [editingRowId, setEditingRowId] = useState<string | null>(null);
  const [editRowData, setEditRowData] = useState<Partial<BOMRow>>({});

  const categories = Array.from(new Set(rows.map((r) => r.kategori).filter(Boolean))).sort();
  const uniqueCodes = Array.from(new Set(rows.map((r) => r.kode).filter(Boolean))).sort();
  const uniqueProductNames = Array.from(new Set(rows.map((r) => r.nama_produk).filter(Boolean))).sort();

  const handleSort = (field: keyof BOMRow) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  const isFilterActive =
    selectedCategory !== 'ALL' ||
    filterKode !== '' ||
    filterNama !== '' ||
    selectedType !== 'ALL' ||
    searchTerm !== '';

  const handleResetFilters = () => {
    setSelectedCategory('ALL');
    setFilterKode('');
    setFilterNama('');
    setSelectedType('ALL');
    setSearchTerm('');
  };

  const filteredRows = rows.filter((r) => {
    const matchesCat =
      selectedCategory === 'ALL' || r.kategori === selectedCategory;

    const matchesKode =
      !filterKode || r.kode.toLowerCase().includes(filterKode.toLowerCase());

    const matchesNama =
      !filterNama || r.nama_produk.toLowerCase().includes(filterNama.toLowerCase());

    const matchesType = selectedType === 'ALL' || r.tipe_produk === selectedType;

    const matchesSearch =
      !searchTerm ||
      r.nama_produk.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.kode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.kategori.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesCat && matchesKode && matchesNama && matchesType && matchesSearch;
  });

  const sortedRows = [...filteredRows].sort((a, b) => {
    let valA = a[sortField];
    let valB = b[sortField];

    if (valA === null || valA === undefined) valA = '';
    if (valB === null || valB === undefined) valB = '';

    if (typeof valA === 'number' && typeof valB === 'number') {
      return sortAsc ? valA - valB : valB - valA;
    }

    return sortAsc
      ? String(valA).localeCompare(String(valB))
      : String(valB).localeCompare(String(valA));
  });

  const startInlineEdit = (row: BOMRow) => {
    setEditingRowId(row.id);
    setEditRowData({ ...row });
  };

  const saveInlineEdit = () => {
    if (editingRowId && editRowData) {
      // Recalculate fields based on type
      if (editRowData.tipe_produk === 'raw_materials') {
        const usage = editRowData.bb_pemakaian_qt ?? 0;
        const price = editRowData.harga_raw_material ?? 0;
        editRowData.minus = -Math.abs(usage);
        editRowData.total_harga_raw_material = Math.round(usage * price);
      } else if (editRowData.tipe_produk === 'finish_goods') {
        const yieldQty = editRowData.finish_goods || 1;
        const hargaBB = editRowData.harga_bb ?? (editRowData.total_harga_fg ? editRowData.total_harga_fg / yieldQty : 0);
        const labour = editRowData.labour_cost ?? 0;
        const overhead = editRowData.overhead ?? 0;
        const totalHPP = Math.round((hargaBB + labour + overhead) * 10) / 10;
        const margin = editRowData.margin_scm ?? 0.38;
        const hJual = editRowData.h_jual_scm ?? (margin > 0 && margin < 1 ? Math.round(totalHPP / (1 - margin)) : Math.round(totalHPP * 1.38));

        editRowData.harga_bb = Math.round(hargaBB * 10) / 10;
        editRowData.labour_cost = labour;
        editRowData.overhead = overhead;
        editRowData.total_hpp = totalHPP;
        editRowData.margin_scm = margin;
        editRowData.h_jual_scm = hJual;
      }
      onUpdateRow(editingRowId, editRowData);
      setEditingRowId(null);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
      {/* Table Header Controls */}
      <div className="p-4 border-b border-slate-200 bg-slate-50/50 space-y-3">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-emerald-600" />
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Filter Data Spreadsheet
            </span>
            {isFilterActive && (
              <button
                onClick={handleResetFilters}
                className="inline-flex items-center gap-1 text-[11px] font-medium text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 px-2 py-0.5 rounded border border-rose-200 transition-colors ml-2"
              >
                <X className="w-3 h-3" />
                Reset Filter
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500">
              Menampilkan <strong className="text-slate-800">{sortedRows.length}</strong> dari{' '}
              {rows.length} baris
            </span>
            <button
              onClick={onOpenAddModal}
              className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition-colors ml-2"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Tambah Baris</span>
            </button>
          </div>
        </div>

        {/* 3 Main Filter Controls: Kategori | Kode Baru | nama produk */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5">
          {/* 1. Filter Kategori */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
              Kategori
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
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
                list="kode-baru-list"
                placeholder="Filter Kode Baru..."
                value={filterKode}
                onChange={(e) => setFilterKode(e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800 font-mono"
              />
              <datalist id="kode-baru-list">
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
                list="nama-produk-list"
                placeholder="Filter nama produk..."
                value={filterNama}
                onChange={(e) => setFilterNama(e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800"
              />
              <datalist id="nama-produk-list">
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

          {/* Search Box / Tipe Produk */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
              Tipe Produk
            </label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800 font-medium"
            >
              <option value="ALL">Semua Tipe Produk</option>
              <option value="raw_materials">raw_materials (Bahan Baku)</option>
              <option value="finish_goods">finish_goods (Produk Jadi)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grid Table matching Google Sheets structure */}
      <div className="overflow-x-auto">
        <table className="w-full text-xs text-left border-collapse">
          <thead>
            <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-300 select-none">
              <th
                onClick={() => handleSort('kategori')}
                className="py-3 px-3 border-r border-slate-200 cursor-pointer hover:bg-slate-200/60"
              >
                <div className="flex items-center gap-1">
                  <span>Kategori</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th
                onClick={() => handleSort('kode')}
                className="py-3 px-3 border-r border-slate-200 cursor-pointer hover:bg-slate-200/60"
              >
                <div className="flex items-center gap-1">
                  <span>Kode Baru</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th
                onClick={() => handleSort('nama_produk')}
                className="py-3 px-3 border-r border-slate-200 cursor-pointer hover:bg-slate-200/60"
              >
                <div className="flex items-center gap-1">
                  <span>Nama Produk</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th className="py-3 px-3 border-r border-slate-200">unit produk</th>
              <th className="py-3 px-3 border-r border-slate-200">Tipe Produk</th>
              <th className="py-3 px-3 border-r border-slate-200 text-right">Minus</th>
              <th className="py-3 px-3 border-r border-slate-200 text-right">Finish goods</th>
              <th className="py-3 px-3 border-r border-slate-200 text-right">BB Pemakaian Qt</th>
              <th className="py-3 px-3 border-r border-slate-200 text-right">Harga Raw material</th>
              <th className="py-3 px-3 border-r border-slate-200 text-right">Total Harga Raw Material</th>
              <th className="py-3 px-3 border-r border-slate-200 text-right">Total Harga FG</th>
              <th className="py-3 px-3 border-r border-slate-200 text-right text-amber-900 font-extrabold bg-amber-50/50">Harga BB</th>
              <th className="py-3 px-3 border-r border-slate-200 text-right font-bold text-slate-800">Labour Cost per Unit (Rp)</th>
              <th className="py-3 px-3 border-r border-slate-200 text-right font-bold text-slate-800">Overhead Cost per Unit (Rp)</th>
              <th className="py-3 px-3 border-r border-slate-200 text-right text-rose-700 font-extrabold bg-rose-50/50">TOTAL HPP</th>
              <th className="py-3 px-3 border-r border-slate-200 text-center">Margin SCM</th>
              <th className="py-3 px-3 border-r border-slate-200 text-right text-rose-700 font-extrabold bg-rose-50/50">H Jual SCM</th>
              <th className="py-3 px-3 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 font-sans">
            {sortedRows.length === 0 ? (
              <tr>
                <td colSpan={18} className="py-8 text-center text-slate-500">
                  <FileSpreadsheet className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                  Tidak ada data yang sesuai dengan pencarian/filter.
                </td>
              </tr>
            ) : (
              sortedRows.map((row) => {
                const isFG = row.tipe_produk === 'finish_goods';
                const isEditing = editingRowId === row.id;

                // Match original spreadsheet yellow background tint for FG rows
                const rowClass = isFG
                  ? 'bg-amber-100/70 hover:bg-amber-100 font-semibold text-amber-950'
                  : 'hover:bg-slate-50 text-slate-800';

                return (
                  <tr key={row.id} className={`${rowClass} transition-colors border-b border-slate-200/80`}>
                    {/* Kategori */}
                    <td className="py-2.5 px-3 border-r border-slate-200 font-medium">
                      {isEditing ? (
                        <input
                          type="text"
                          value={editRowData.kategori ?? ''}
                          onChange={(e) =>
                            setEditRowData({ ...editRowData, kategori: e.target.value })
                          }
                          className="w-full px-1.5 py-0.5 border border-emerald-500 rounded text-xs bg-white text-slate-900"
                        />
                      ) : (
                        row.kategori
                      )}
                    </td>

                    {/* Kode Baru */}
                    <td className="py-2.5 px-3 border-r border-slate-200 font-mono font-bold">
                      {isEditing ? (
                        <input
                          type="text"
                          value={editRowData.kode ?? ''}
                          onChange={(e) =>
                            setEditRowData({ ...editRowData, kode: e.target.value })
                          }
                          className="w-full px-1.5 py-0.5 border border-emerald-500 rounded text-xs bg-white text-slate-900 font-mono"
                        />
                      ) : (
                        row.kode
                      )}
                    </td>

                    {/* Nama Produk */}
                    <td className="py-2.5 px-3 border-r border-slate-200">
                      {isEditing ? (
                        <input
                          type="text"
                          value={editRowData.nama_produk ?? ''}
                          onChange={(e) =>
                            setEditRowData({ ...editRowData, nama_produk: e.target.value })
                          }
                          className="w-full px-1.5 py-0.5 border border-emerald-500 rounded text-xs bg-white text-slate-900"
                        />
                      ) : (
                        row.nama_produk
                      )}
                    </td>

                    {/* Unit Produk */}
                    <td className="py-2.5 px-3 border-r border-slate-200 text-slate-600">
                      {isEditing ? (
                        <input
                          type="text"
                          value={editRowData.unit_produk ?? ''}
                          onChange={(e) =>
                            setEditRowData({ ...editRowData, unit_produk: e.target.value })
                          }
                          className="w-16 px-1.5 py-0.5 border border-emerald-500 rounded text-xs bg-white text-slate-900"
                        />
                      ) : (
                        row.unit_produk
                      )}
                    </td>

                    {/* Tipe Produk */}
                    <td className="py-2.5 px-3 border-r border-slate-200 font-mono">
                      {isEditing ? (
                        <select
                          value={editRowData.tipe_produk}
                          onChange={(e) =>
                            setEditRowData({
                              ...editRowData,
                              tipe_produk: e.target.value as any,
                            })
                          }
                          className="px-1.5 py-0.5 border border-emerald-500 rounded text-xs bg-white text-slate-900"
                        >
                          <option value="raw_materials">raw_materials</option>
                          <option value="finish_goods">finish_goods</option>
                        </select>
                      ) : (
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            isFG
                              ? 'bg-amber-200 text-amber-900'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {row.tipe_produk}
                        </span>
                      )}
                    </td>

                    {/* Minus */}
                    <td className="py-2.5 px-3 border-r border-slate-200 text-right font-mono text-slate-600">
                      {!isFG && (row.minus !== null ? row.minus : '')}
                    </td>

                    {/* Finish goods */}
                    <td className="py-2.5 px-3 border-r border-slate-200 text-right font-mono font-bold">
                      {isFG ? (
                        isEditing ? (
                          <input
                            type="number"
                            value={editRowData.finish_goods ?? ''}
                            onChange={(e) =>
                              setEditRowData({
                                ...editRowData,
                                finish_goods: Number(e.target.value),
                              })
                            }
                            className="w-20 px-1.5 py-0.5 border border-emerald-500 rounded text-xs bg-white text-slate-900 text-right"
                          />
                        ) : (
                          formatNumber(row.finish_goods || 0)
                        )
                      ) : (
                        ''
                      )}
                    </td>

                    {/* BB Pemakaian Qt */}
                    <td className="py-2.5 px-3 border-r border-slate-200 text-right font-mono">
                      {!isFG ? (
                        isEditing ? (
                          <input
                            type="number"
                            value={editRowData.bb_pemakaian_qt ?? ''}
                            onChange={(e) =>
                              setEditRowData({
                                ...editRowData,
                                bb_pemakaian_qt: Number(e.target.value),
                              })
                            }
                            className="w-20 px-1.5 py-0.5 border border-emerald-500 rounded text-xs bg-white text-slate-900 text-right"
                          />
                        ) : (
                          formatNumber(row.bb_pemakaian_qt || 0)
                        )
                      ) : (
                        ''
                      )}
                    </td>

                    {/* Harga Raw material */}
                    <td className="py-2.5 px-3 border-r border-slate-200 text-right font-mono">
                      {!isFG ? (
                        isEditing ? (
                          <input
                            type="number"
                            value={editRowData.harga_raw_material ?? ''}
                            onChange={(e) =>
                              setEditRowData({
                                ...editRowData,
                                harga_raw_material: Number(e.target.value),
                              })
                            }
                            className="w-24 px-1.5 py-0.5 border border-emerald-500 rounded text-xs bg-white text-slate-900 text-right"
                          />
                        ) : (
                          formatNumber(row.harga_raw_material || 0)
                        )
                      ) : (
                        ''
                      )}
                    </td>

                    {/* Total Harga Raw Material */}
                    <td className="py-2.5 px-3 border-r border-slate-200 text-right font-mono font-semibold">
                      {!isFG && row.total_harga_raw_material
                        ? formatNumber(row.total_harga_raw_material)
                        : ''}
                    </td>

                    {/* Total Harga FG */}
                    <td className="py-2.5 px-3 border-r border-slate-200 text-right font-mono font-extrabold text-amber-950 text-xs">
                      {isFG && row.total_harga_fg ? formatNumber(row.total_harga_fg) : ''}
                    </td>

                    {/* Harga BB */}
                    <td className="py-2.5 px-3 border-r border-slate-200 text-right font-mono font-bold text-amber-900 bg-amber-50/30">
                      {isFG && row.harga_bb !== null && row.harga_bb !== undefined
                        ? formatNumber(row.harga_bb)
                        : ''}
                    </td>

                    {/* Labour Cost */}
                    <td className="py-2.5 px-3 border-r border-slate-200 text-right font-mono">
                      {isFG ? (
                        isEditing ? (
                          <div className="flex items-center justify-end gap-1">
                            <input
                              type="number"
                              step="0.1"
                              value={editRowData.labour_cost ?? ''}
                              onChange={(e) =>
                                setEditRowData({
                                  ...editRowData,
                                  labour_cost: Number(e.target.value),
                                })
                              }
                              className="w-16 px-1.5 py-0.5 border border-emerald-500 rounded text-xs bg-white text-slate-900 text-right"
                            />
                            <span className="text-[10px] text-slate-500 font-sans">/{row.unit_produk || 'unit'}</span>
                          </div>
                        ) : row.labour_cost !== null && row.labour_cost !== undefined ? (
                          <span className="font-semibold text-slate-800">
                            {formatNumber(row.labour_cost)}{' '}
                            <span className="text-[10px] font-normal text-slate-500">/{row.unit_produk || 'unit'}</span>
                          </span>
                        ) : (
                          ''
                        )
                      ) : (
                        ''
                      )}
                    </td>

                    {/* Overhead */}
                    <td className="py-2.5 px-3 border-r border-slate-200 text-right font-mono">
                      {isFG ? (
                        isEditing ? (
                          <div className="flex items-center justify-end gap-1">
                            <input
                              type="number"
                              step="0.1"
                              value={editRowData.overhead ?? ''}
                              onChange={(e) =>
                                setEditRowData({
                                  ...editRowData,
                                  overhead: Number(e.target.value),
                                })
                              }
                              className="w-16 px-1.5 py-0.5 border border-emerald-500 rounded text-xs bg-white text-slate-900 text-right"
                            />
                            <span className="text-[10px] text-slate-500 font-sans">/{row.unit_produk || 'unit'}</span>
                          </div>
                        ) : row.overhead !== null && row.overhead !== undefined ? (
                          <span className="font-semibold text-slate-800">
                            {formatNumber(row.overhead)}{' '}
                            <span className="text-[10px] font-normal text-slate-500">/{row.unit_produk || 'unit'}</span>
                          </span>
                        ) : (
                          ''
                        )
                      ) : (
                        ''
                      )}
                    </td>

                    {/* TOTAL HPP */}
                    <td className="py-2.5 px-3 border-r border-slate-200 text-right font-mono font-extrabold text-rose-600 bg-rose-50/30 text-sm">
                      {isFG && row.total_hpp !== null && row.total_hpp !== undefined
                        ? formatNumber(row.total_hpp)
                        : ''}
                    </td>

                    {/* Margin SCM */}
                    <td className="py-2.5 px-3 border-r border-slate-200 text-center font-mono font-bold text-slate-700">
                      {isFG ? (
                        isEditing ? (
                          <input
                            type="number"
                            step="0.01"
                            value={editRowData.margin_scm ?? 0.38}
                            onChange={(e) =>
                              setEditRowData({
                                ...editRowData,
                                margin_scm: Number(e.target.value),
                              })
                            }
                            className="w-16 px-1.5 py-0.5 border border-emerald-500 rounded text-xs bg-white text-slate-900 text-center"
                          />
                        ) : row.margin_scm !== null && row.margin_scm !== undefined ? (
                          `${Math.round(row.margin_scm * 100)}%`
                        ) : (
                          ''
                        )
                      ) : (
                        ''
                      )}
                    </td>

                    {/* H Jual SCM */}
                    <td className="py-2.5 px-3 border-r border-slate-200 text-right font-mono font-extrabold text-rose-600 bg-rose-50/30 text-sm">
                      {isFG ? (
                        isEditing ? (
                          <input
                            type="number"
                            value={editRowData.h_jual_scm ?? ''}
                            onChange={(e) =>
                              setEditRowData({
                                ...editRowData,
                                h_jual_scm: Number(e.target.value),
                              })
                            }
                            className="w-20 px-1.5 py-0.5 border border-emerald-500 rounded text-xs bg-white text-slate-900 text-right"
                          />
                        ) : row.h_jual_scm !== null && row.h_jual_scm !== undefined ? (
                          formatNumber(row.h_jual_scm)
                        ) : (
                          ''
                        )
                      ) : (
                        ''
                      )}
                    </td>

                    {/* Action */}
                    <td className="py-2.5 px-3 text-center">
                      {isEditing ? (
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={saveInlineEdit}
                            className="p-1 text-emerald-600 hover:bg-emerald-50 rounded"
                            title="Simpan perubahan"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setEditingRowId(null)}
                            className="p-1 text-slate-400 hover:bg-slate-100 rounded"
                            title="Batal"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => startInlineEdit(row)}
                            className="p-1 text-slate-400 hover:text-emerald-600 hover:bg-slate-100 rounded"
                            title="Edit Baris"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onDeleteRow(row.id)}
                            className="p-1 text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded"
                            title="Hapus Baris"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
