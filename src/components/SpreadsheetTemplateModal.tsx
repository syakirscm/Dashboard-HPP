import React, { useState } from 'react';
import {
  X,
  FileSpreadsheet,
  Download,
  Copy,
  Check,
  Table,
  Users,
  Layers,
  Sparkles,
  HelpCircle,
  ArrowRight,
} from 'lucide-react';

interface SpreadsheetTemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SpreadsheetTemplateModal: React.FC<SpreadsheetTemplateModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'bom' | 'crewing'>('bom');
  const [copiedBom, setCopiedBom] = useState(false);
  const [copiedCrewing, setCopiedCrewing] = useState(false);

  if (!isOpen) return null;

  // Sample CSV Data for NEW FORMULA & HPP
  const bomCsvContent = `Kategori,Kode Baru,Nama Produk,Unit,Tipe Produk,Minus,Finish Goods,Harga Raw Material,Labour Cost,Overhead,Margin SCM
Adon Fla,BB017,Fresh Milk,liter,raw_materials,-3,,17261,,,
Adon Fla,P1001,Tepung Fla,ktk,raw_materials,-1,,4934,,,
Adon Fla,BB024,Telur Ayam,butir,raw_materials,-30,,1614,,,
Adon Fla,BB018,Gula Pasir,gram,raw_materials,-800,,18,,,
Adon Fla,P1003,Mentega Fla,ktk,raw_materials,-1,,7200,,,
Adon Fla,P2002,Adon Fla,gram,finish_goods,0,4500,,0,0.2,0.38
Adon Fla Cream Cheese,BB170,Cream Cheese Anchor,gram,raw_materials,-250,,162,,,
Adon Fla Cream Cheese,BB171,Whip Cream Brookfarm,gram,raw_materials,-100,,48.4,,,
Adon Fla Cream Cheese,P2003,Adon Fla Cream Cheese,gram,finish_goods,0,352,,0,1.0,0.38`;

  // Sample CSV Data for Source Crewing Guide
  const crewingCsvContent = `Kategori,Kode Produk,Nama Produk,Labour Cost per Unit (Rp),Overhead Cost per Unit (Rp),Crew Ratio,Shift Duration (Jam),Catatan
Adon Fla,P2002,Adon Fla,0.6,0.2,2 Crew,8 Jam,Gaji Rp 150.000 / shift 4500g (Rp 0,6/gram)
Adon Fla Cream Cheese,P2003,Adon Fla Cream Cheese,2.0,1.0,2 Crew,8 Jam,Gaji Rp 150.000 / shift 352g
Adonan Kulit Pie,P2001,Adonan Kulit Pie,1.0,0.5,1 Crew,8 Jam,Standard pie crust crewing
Pia Fla Coklat,P3001,Pia Fla Coklat,150,50,3 Crew,8 Jam,Packing & Baking crew`;

  const handleDownloadCSV = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCopy = (content: string, type: 'bom' | 'crewing') => {
    navigator.clipboard.writeText(content);
    if (type === 'bom') {
      setCopiedBom(true);
      setTimeout(() => setCopiedBom(false), 2500);
    } else {
      setCopiedCrewing(true);
      setTimeout(() => setCopiedCrewing(false), 2500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-4xl overflow-hidden my-8">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-400 shrink-0">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold tracking-tight text-white flex items-center gap-2">
                <span>Template Spreadsheet & Crewing Guide</span>
                <span className="text-[10px] bg-emerald-500/30 text-emerald-300 font-extrabold px-2 py-0.5 rounded-full border border-emerald-400/20 uppercase">
                  Multi-Sheet Sync
                </span>
              </h3>
              <p className="text-xs text-slate-300">
                Panduan struktur sheet Google Spreadsheet untuk BOM dan nilai Labour/Overhead
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-6 pt-3 gap-2">
          <button
            onClick={() => setActiveTab('bom')}
            className={`pb-2.5 px-4 text-xs font-bold border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'bom'
                ? 'border-emerald-600 text-emerald-900 bg-white rounded-t-lg border-t border-x border-slate-200 -mb-px'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Table className="w-4 h-4 text-emerald-600" />
            <span>Sheet 1: NEW FORMULA & HPP</span>
          </button>
          <button
            onClick={() => setActiveTab('crewing')}
            className={`pb-2.5 px-4 text-xs font-bold border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'crewing'
                ? 'border-emerald-600 text-emerald-900 bg-white rounded-t-lg border-t border-x border-slate-200 -mb-px'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Users className="w-4 h-4 text-amber-600" />
            <span>Sheet 2: Source Crewing Guide</span>
            <span className="bg-amber-100 text-amber-800 text-[10px] px-1.5 py-0.2 rounded font-extrabold">
              BARU
            </span>
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {activeTab === 'bom' ? (
            <div className="space-y-6">
              {/* Overview Box */}
              <div className="p-4 bg-emerald-50/80 rounded-2xl border border-emerald-200/80 space-y-2 text-slate-800">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-bold text-xs text-emerald-950">
                    <Sparkles className="w-4 h-4 text-emerald-600" />
                    <span>Struktur Sheet "NEW FORMULA & HPP"</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleCopy(bomCsvContent, 'bom')}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 rounded-lg transition-colors shadow-2xs"
                    >
                      {copiedBom ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Tersalin!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-slate-600" />
                          <span>Salin Format CSV</span>
                        </>
                      )}
                    </button>
                    <button
                      onClick={() =>
                        handleDownloadCSV(
                          bomCsvContent,
                          'Template_NEW_FORMULA_HPP.csv'
                        )
                      }
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg transition-colors shadow-2xs"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Unduh Template CSV</span>
                    </button>
                  </div>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed">
                  Sheet ini menyimpan resep BOM (bahan baku dan produk jadi). Set setiap nama sheet di Google Spreadsheet Anda menjadi <code className="bg-emerald-100/80 text-emerald-900 font-mono px-1.5 py-0.5 rounded font-bold">NEW FORMULA & HPP</code>.
                </p>
              </div>

              {/* Column Descriptions */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-emerald-600" />
                  <span>Daftar Kolom & Penjelasannya</span>
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                    <div className="font-bold text-slate-900 font-mono text-[11px] text-emerald-800">
                      Kategori
                    </div>
                    <p className="text-slate-600 text-[11px]">
                      Nama kelompok resep (misal: <i>Adon Fla</i>, <i>Pia Fla Coklat</i>).
                    </p>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                    <div className="font-bold text-slate-900 font-mono text-[11px] text-emerald-800">
                      Kode Baru / Kode
                    </div>
                    <p className="text-slate-600 text-[11px]">
                      Kode unik item bahan baku atau finish goods (misal: <i>BB017</i>, <i>P2002</i>).
                    </p>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                    <div className="font-bold text-slate-900 font-mono text-[11px] text-emerald-800">
                      Tipe Produk
                    </div>
                    <p className="text-slate-600 text-[11px]">
                      Pilih <code className="bg-slate-200 px-1 rounded">raw_materials</code> untuk bahan baku atau <code className="bg-slate-200 px-1 rounded">finish_goods</code> untuk baris total produk jadi.
                    </p>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                    <div className="font-bold text-slate-900 font-mono text-[11px] text-emerald-800">
                      Minus (Pemakaian Qty)
                    </div>
                    <p className="text-slate-600 text-[11px]">
                      Jumlah pemakaian bahan baku (bernilai minus, misal <i>-3</i>, <i>-800</i>).
                    </p>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                    <div className="font-bold text-slate-900 font-mono text-[11px] text-emerald-800">
                      Finish Goods (Yield Qty)
                    </div>
                    <p className="text-slate-600 text-[11px]">
                      Total jumlah resep produk jadi yang dihasilkan (misal <i>4500</i> gram).
                    </p>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                    <div className="font-bold text-slate-900 font-mono text-[11px] text-emerald-800">
                      Harga Raw Material
                    </div>
                    <p className="text-slate-600 text-[11px]">
                      Harga beli per unit bahan baku dalam Rupiah.
                    </p>
                  </div>
                </div>
              </div>

              {/* Live Preview Table */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Contoh Tampilan Tabel "NEW FORMULA & HPP"
                </span>
                <div className="bg-slate-900 text-slate-100 p-4 rounded-xl text-xs font-mono overflow-x-auto border border-slate-800 max-h-48">
                  <pre>{bomCsvContent}</pre>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Overview Box for Crewing Guide */}
              <div className="p-4 bg-amber-50/90 rounded-2xl border border-amber-200 space-y-2 text-slate-800">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-bold text-xs text-amber-950">
                    <Users className="w-4 h-4 text-amber-600" />
                    <span>Struktur Sheet "Source Crewing Guide"</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleCopy(crewingCsvContent, 'crewing')}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 rounded-lg transition-colors shadow-2xs"
                    >
                      {copiedCrewing ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Tersalin!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-slate-600" />
                          <span>Salin Format CSV</span>
                        </>
                      )}
                    </button>
                    <button
                      onClick={() =>
                        handleDownloadCSV(
                          crewingCsvContent,
                          'Template_Source_Crewing_Guide.csv'
                        )
                      }
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-amber-700 hover:bg-amber-800 rounded-lg transition-colors shadow-2xs"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Unduh Template Crewing CSV</span>
                    </button>
                  </div>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed">
                  Buat tab/sheet baru di Google Spreadsheet bernama <code className="bg-amber-100 text-amber-900 font-mono px-1.5 py-0.5 rounded font-bold">Source Crewing Guide</code>.
                  Google Apps Script akan <strong>otomatis menarik nilai Labour Cost dan Overhead Cost</strong> dari sheet ini secara real-time dan menggabungkannya ke perhitungan HPP produk!
                </p>
              </div>

              {/* Column Descriptions */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-amber-600" />
                  <span>Kolom Utama "Source Crewing Guide"</span>
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                    <div className="font-bold text-slate-900 font-mono text-[11px] text-amber-900">
                      Kategori / Kode Produk / Nama Produk
                    </div>
                    <p className="text-slate-600 text-[11px]">
                      Pencocokan otomatis berdasarkan Kategori (misal <i>Adon Fla</i>) atau Kode (<i>P2002</i>).
                    </p>
                  </div>

                  <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-200/80 space-y-1">
                    <div className="font-bold text-amber-950 font-mono text-[11px] flex items-center gap-1">
                      <span>Labour Cost (Kolom K)</span>
                      <span className="text-[10px] bg-amber-200 text-amber-900 px-1 rounded font-bold">Ditarik dari Kolom K</span>
                    </div>
                    <p className="text-slate-700 text-[11px]">
                      Biaya tenaga kerja langsung per gram/unit produk (misal: Rp 0,6 / gram) yang berada di <strong>Kolom K</strong> pada sheet Source Crewing Guide.
                    </p>
                  </div>

                  <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-200/80 space-y-1">
                    <div className="font-bold text-amber-950 font-mono text-[11px] flex items-center gap-1">
                      <span>Overhead Cost (Rp/Unit)</span>
                      <span className="text-[10px] bg-amber-200 text-amber-900 px-1 rounded">Ditarik ke HPP</span>
                    </div>
                    <p className="text-slate-700 text-[11px]">
                      Biaya overhead (listrik, gas, sewa, kemasan umum) per unit produk.
                    </p>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                    <div className="font-bold text-slate-900 font-mono text-[11px] text-amber-900">
                      Crew Ratio & Shift (Opsional)
                    </div>
                    <p className="text-slate-600 text-[11px]">
                      Kolom tambahan catat jumlah personil crew dan durasi kerja per resep.
                    </p>
                  </div>
                </div>
              </div>

              {/* Formula & Calculation Workflow Card */}
              <div className="p-4 bg-slate-900 text-white rounded-2xl space-y-2">
                <div className="text-xs font-bold text-emerald-400 flex items-center gap-2">
                  <ArrowRight className="w-4 h-4" />
                  <span>Sistem Perhitungan Real-time HPP SCM:</span>
                </div>
                <div className="text-xs font-mono space-y-1 text-slate-300 bg-slate-950/80 p-3 rounded-xl border border-slate-800">
                  <div>1. Total Biaya Bahan = Sum(Qty Pemakaian * Harga Raw Material)</div>
                  <div>2. Harga BB / Unit = Total Biaya Bahan / Yield Finish Goods</div>
                  <div className="text-amber-300 font-bold">3. Labour Cost = Ditarik dari "Source Crewing Guide"</div>
                  <div className="text-amber-300 font-bold">4. Overhead = Ditarik dari "Source Crewing Guide"</div>
                  <div className="text-emerald-300 font-bold">5. Total HPP = Harga BB + Labour Cost + Overhead</div>
                  <div className="text-indigo-300">6. Harga Jual SCM = Total HPP / (1 - Margin SCM %)</div>
                </div>
              </div>

              {/* Live Preview Table Crewing */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Contoh Format CSV "Source Crewing Guide"
                </span>
                <div className="bg-slate-900 text-amber-200 p-4 rounded-xl text-xs font-mono overflow-x-auto border border-slate-800 max-h-48">
                  <pre>{crewingCsvContent}</pre>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex justify-between items-center">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <HelpCircle className="w-4 h-4 text-emerald-600" />
            <span>Butuh bantuan? Gunakan tombol unduh untuk mendapatkan contoh CSV resmi.</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-slate-700 bg-white border border-slate-300 hover:bg-slate-100 rounded-lg transition-colors shadow-2xs cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
