import React, { useState } from 'react';
import { BOMRow, ProductType } from '../types/bom';
import { X, PlusCircle } from 'lucide-react';

interface AddItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: string[];
  onAddItem: (newRow: BOMRow) => void;
}

export const AddItemModal: React.FC<AddItemModalProps> = ({
  isOpen,
  onClose,
  categories,
  onAddItem,
}) => {
  const [kategori, setKategori] = useState(categories[0] || 'Adon Fla');
  const [customKategori, setCustomKategori] = useState('');
  const [useCustomCat, setUseCustomCat] = useState(false);
  const [kode, setKode] = useState('');
  const [namaProduk, setNamaProduk] = useState('');
  const [unitProduk, setUnitProduk] = useState('gram');
  const [tipeProduk, setTipeProduk] = useState<ProductType>('raw_materials');
  const [usageQty, setUsageQty] = useState<number>(100);
  const [hargaRM, setHargaRM] = useState<number>(50);
  const [yieldFG, setYieldFG] = useState<number>(1000);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const selectedCategoryName = useCustomCat ? customKategori : kategori;
    if (!selectedCategoryName || !kode || !namaProduk) return;

    const isFG = tipeProduk === 'finish_goods';

    const newRow: BOMRow = {
      id: `row-custom-${Date.now()}`,
      kategori: selectedCategoryName,
      kode: kode.trim(),
      nama_produk: namaProduk.trim(),
      unit_produk: unitProduk.trim(),
      tipe_produk: tipeProduk,
      minus: isFG ? 0 : -Math.abs(usageQty),
      finish_goods: isFG ? yieldFG : null,
      bb_pemakaian_qt: isFG ? null : usageQty,
      harga_raw_material: isFG ? null : hargaRM,
      total_harga_raw_material: isFG ? null : Math.round(usageQty * hargaRM),
      total_harga_fg: isFG ? 0 : null,
    };

    onAddItem(newRow);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-md overflow-hidden my-8">
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <PlusCircle className="w-5 h-5 text-emerald-400" />
            <h3 className="text-base font-bold">Tambah Item BOM Baru</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          {/* Category */}
          <div>
            <label className="block font-bold text-slate-700 uppercase mb-1">Kategori BOM</label>
            {!useCustomCat ? (
              <div className="flex gap-2">
                <select
                  value={kategori}
                  onChange={(e) => setKategori(e.target.value)}
                  className="flex-1 px-3 py-2 bg-white border border-slate-300 rounded-lg font-semibold"
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => setUseCustomCat(true)}
                  className="px-2.5 py-1 text-emerald-700 bg-emerald-50 rounded border border-emerald-200"
                >
                  + Baru
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Kategori baru..."
                  value={customKategori}
                  onChange={(e) => setCustomKategori(e.target.value)}
                  className="flex-1 px-3 py-2 border border-slate-300 rounded-lg"
                  required
                />
                <button
                  type="button"
                  onClick={() => setUseCustomCat(false)}
                  className="px-2.5 py-1 text-slate-600 bg-slate-100 rounded"
                >
                  Pilih
                </button>
              </div>
            )}
          </div>

          {/* Type */}
          <div>
            <label className="block font-bold text-slate-700 uppercase mb-1">Tipe Produk</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setTipeProduk('raw_materials')}
                className={`py-2 px-3 rounded-lg border font-semibold text-center ${
                  tipeProduk === 'raw_materials'
                    ? 'bg-emerald-50 border-emerald-500 text-emerald-800'
                    : 'bg-white border-slate-200 text-slate-600'
                }`}
              >
                raw_materials (Bahan Baku)
              </button>
              <button
                type="button"
                onClick={() => setTipeProduk('finish_goods')}
                className={`py-2 px-3 rounded-lg border font-semibold text-center ${
                  tipeProduk === 'finish_goods'
                    ? 'bg-amber-50 border-amber-500 text-amber-900'
                    : 'bg-white border-slate-200 text-slate-600'
                }`}
              >
                finish_goods (Hasil Olahan)
              </button>
            </div>
          </div>

          {/* Kode Baru & Nama Produk */}
          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">Kode Baru</label>
              <input
                type="text"
                placeholder="BB099 / P2099"
                value={kode}
                onChange={(e) => setKode(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono font-bold"
                required
              />
            </div>
            <div className="col-span-2">
              <label className="block font-bold text-slate-700 uppercase mb-1">Nama Produk</label>
              <input
                type="text"
                placeholder="misal: Susu UHT / Adon Custom"
                value={namaProduk}
                onChange={(e) => setNamaProduk(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                required
              />
            </div>
          </div>

          {/* Unit Produk */}
          <div>
            <label className="block font-bold text-slate-700 uppercase mb-1">Unit Produk</label>
            <select
              value={unitProduk}
              onChange={(e) => setUnitProduk(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg"
            >
              <option value="gram">gram</option>
              <option value="liter">liter</option>
              <option value="butir">butir</option>
              <option value="ktk">ktk</option>
              <option value="kg">kg</option>
              <option value="pcs">pcs</option>
            </select>
          </div>

          {/* Dynamic Inputs depending on type */}
          {tipeProduk === 'raw_materials' ? (
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Pemakaian Qt</label>
                <input
                  type="number"
                  value={usageQty}
                  onChange={(e) => setUsageQty(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono"
                  required
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Harga Satuan (IDR)</label>
                <input
                  type="number"
                  value={hargaRM}
                  onChange={(e) => setHargaRM(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono"
                  required
                />
              </div>
            </div>
          ) : (
            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">Yield Finish Goods</label>
              <input
                type="number"
                value={yieldFG}
                onChange={(e) => setYieldFG(Number(e.target.value))}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono"
                required
              />
            </div>
          )}

          <div className="pt-4 border-t border-slate-200 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg font-medium"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg shadow-xs"
            >
              Tambah ke BOM
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
