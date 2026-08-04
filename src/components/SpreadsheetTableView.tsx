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
  const [selectedType, setSelectedType] = useState<string>('ALL');
  const [sortField, setSortField] = useState<keyof BOMRow>('kategori');
  const [sortAsc, setSortAsc] = useState(true);

  // Inline editing state
  const [editingRowId, setEditingRowId] = useState<string | null>(null);
  const [editRowData, setEditRowData] = useState<Partial<BOMRow>>({});

  const categories = Array.from(new Set(rows.map((r) => r.kategori)));

  const handleSort = (field: keyof BOMRow) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  const filteredRows = rows.filter((r) => {
    const matchesSearch =
      r.nama_produk.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.kode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.kategori.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCat = selectedCategory === 'ALL' || r.kategori === selectedCategory;
    const matchesType = selectedType === 'ALL' || r.tipe_produk === selectedType;

    return matchesSearch && matchesCat && matchesType;
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
      }
      onUpdateRow(editingRowId, editRowData);
      setEditingRowId(null);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
      {/* Table Header Controls */}
      <div className="p-4 border-b border-slate-200 bg-slate-50/50 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-wrap flex-1">
          {/* Search Box */}
          <div className="relative min-w-[200px] flex-1 max-w-xs">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Cari kode, nama produk, kategori..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Filter Category */}
          <div className="flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-slate-500" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-700 font-medium"
            >
              <option value="ALL">Semua Kategori ({categories.length})</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Filter Type */}
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-700 font-medium"
          >
            <option value="ALL">Semua Tipe Produk</option>
            <option value="raw_materials">raw_materials</option>
            <option value="finish_goods">finish_goods</option>
          </select>
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
              <th className="py-3 px-3 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 font-sans">
            {sortedRows.length === 0 ? (
              <tr>
                <td colSpan={12} className="py-8 text-center text-slate-500">
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
                    <td className="py-2.5 px-3 border-r border-slate-200 text-right font-mono font-extrabold text-amber-900 text-sm">
                      {isFG && row.total_harga_fg ? formatNumber(row.total_harga_fg) : ''}
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
