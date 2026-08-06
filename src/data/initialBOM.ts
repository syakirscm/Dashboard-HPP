import { BOMRow } from '../types/bom';

export const INITIAL_BOM_DATA: BOMRow[] = [
  // Category 1: Adon Fla
  {
    id: 'row-1',
    kategori: 'Adon Fla',
    kode: 'BB017',
    nama_produk: 'Fresh Milk',
    unit_produk: 'liter',
    tipe_produk: 'raw_materials',
    minus: -3,
    finish_goods: null,
    bb_pemakaian_qt: 3.0,
    harga_raw_material: 17261,
    total_harga_raw_material: 51784,
    total_harga_fg: null,
  },
  {
    id: 'row-2',
    kategori: 'Adon Fla',
    kode: 'P1001',
    nama_produk: 'Tepung Fla',
    unit_produk: 'ktk',
    tipe_produk: 'raw_materials',
    minus: -1,
    finish_goods: null,
    bb_pemakaian_qt: 1.0,
    harga_raw_material: 4934,
    total_harga_raw_material: 4934,
    total_harga_fg: null,
  },
  {
    id: 'row-3',
    kategori: 'Adon Fla',
    kode: 'BB024',
    nama_produk: 'Telur Ayam',
    unit_produk: 'butir',
    tipe_produk: 'raw_materials',
    minus: -30,
    finish_goods: null,
    bb_pemakaian_qt: 30.0,
    harga_raw_material: 1614,
    total_harga_raw_material: 48405,
    total_harga_fg: null,
  },
  {
    id: 'row-4',
    kategori: 'Adon Fla',
    kode: 'BB018',
    nama_produk: 'Gula Pasir',
    unit_produk: 'gram',
    tipe_produk: 'raw_materials',
    minus: -800,
    finish_goods: null,
    bb_pemakaian_qt: 800.0,
    harga_raw_material: 18,
    total_harga_raw_material: 14000,
    total_harga_fg: null,
  },
  {
    id: 'row-5',
    kategori: 'Adon Fla',
    kode: 'P1003',
    nama_produk: 'Mentega Fla',
    unit_produk: 'ktk',
    tipe_produk: 'raw_materials',
    minus: -1,
    finish_goods: null,
    bb_pemakaian_qt: 1.0,
    harga_raw_material: 7200,
    total_harga_raw_material: 7200,
    total_harga_fg: null,
  },
  {
    id: 'row-6',
    kategori: 'Adon Fla',
    kode: 'P2002',
    nama_produk: 'Adon Fla',
    unit_produk: 'gram',
    tipe_produk: 'finish_goods',
    minus: 0,
    finish_goods: 4500,
    bb_pemakaian_qt: null,
    harga_raw_material: null,
    total_harga_raw_material: null,
    total_harga_fg: 126737,
    harga_bb: 28.2,
    labour_cost: 0.6,
    overhead: 0.5,
    total_hpp: 29.3,
    margin_scm: 0.38,
    h_jual_scm: 47,
  },

  // Category 2: Adon Fla Cream Cheese
  {
    id: 'row-7',
    kategori: 'Adon Fla Cream Cheese',
    kode: 'BB170',
    nama_produk: 'Cream Cheese Anchor',
    unit_produk: 'gram',
    tipe_produk: 'raw_materials',
    minus: -250,
    finish_goods: null,
    bb_pemakaian_qt: 250.0,
    harga_raw_material: 162,
    total_harga_raw_material: 40600,
    total_harga_fg: null,
  },
  {
    id: 'row-8',
    kategori: 'Adon Fla Cream Cheese',
    kode: 'BB171',
    nama_produk: 'Whip Cream Brookfarm',
    unit_produk: 'gram',
    tipe_produk: 'raw_materials',
    minus: -100,
    finish_goods: null,
    bb_pemakaian_qt: 100.0,
    harga_raw_material: 48.4,
    total_harga_raw_material: 4840,
    total_harga_fg: null,
  },
  {
    id: 'row-9',
    kategori: 'Adon Fla Cream Cheese',
    kode: 'BB172',
    nama_produk: 'Gula Halus',
    unit_produk: 'gram',
    tipe_produk: 'raw_materials',
    minus: -60,
    finish_goods: null,
    bb_pemakaian_qt: 60.0,
    harga_raw_material: 59.1,
    total_harga_raw_material: 3546,
    total_harga_fg: null,
  },
  {
    id: 'row-10',
    kategori: 'Adon Fla Cream Cheese',
    kode: 'BB173',
    nama_produk: 'Vanili cair',
    unit_produk: 'gram',
    tipe_produk: 'raw_materials',
    minus: -2,
    finish_goods: null,
    bb_pemakaian_qt: 2.0,
    harga_raw_material: 208.5,
    total_harga_raw_material: 417,
    total_harga_fg: null,
  },
  {
    id: 'row-11',
    kategori: 'Adon Fla Cream Cheese',
    kode: 'P2015',
    nama_produk: 'Adon Fla Cream Cheese',
    unit_produk: 'gram',
    tipe_produk: 'finish_goods',
    minus: 0,
    finish_goods: 400,
    bb_pemakaian_qt: null,
    harga_raw_material: null,
    total_harga_raw_material: null,
    total_harga_fg: 49256,
    harga_bb: 123.1,
    labour_cost: 4.3,
    overhead: 2.2,
    total_hpp: 129.6,
    margin_scm: 0.38,
    h_jual_scm: 209,
  },

  // Category 3: Adon Klappy
  {
    id: 'row-12',
    kategori: 'Adon Klappy',
    kode: 'BB017',
    nama_produk: 'Fresh Milk',
    unit_produk: 'liter',
    tipe_produk: 'raw_materials',
    minus: -3,
    finish_goods: null,
    bb_pemakaian_qt: 3.0,
    harga_raw_material: 17261,
    total_harga_raw_material: 51784,
    total_harga_fg: null,
  },
  {
    id: 'row-13',
    kategori: 'Adon Klappy',
    kode: 'BB018',
    nama_produk: 'Gula Pasir',
    unit_produk: 'gram',
    tipe_produk: 'raw_materials',
    minus: -800,
    finish_goods: null,
    bb_pemakaian_qt: 800.0,
    harga_raw_material: 18,
    total_harga_raw_material: 14000,
    total_harga_fg: null,
  },
  {
    id: 'row-14',
    kategori: 'Adon Klappy',
    kode: 'BB020',
    nama_produk: 'Kelapa Muda',
    unit_produk: 'gram',
    tipe_produk: 'raw_materials',
    minus: -250,
    finish_goods: null,
    bb_pemakaian_qt: 250.0,
    harga_raw_material: 155.6,
    total_harga_raw_material: 38900,
    total_harga_fg: null,
  },
  {
    id: 'row-15',
    kategori: 'Adon Klappy',
    kode: 'BB024',
    nama_produk: 'Telur Ayam',
    unit_produk: 'butir',
    tipe_produk: 'raw_materials',
    minus: -30,
    finish_goods: null,
    bb_pemakaian_qt: 30.0,
    harga_raw_material: 1614,
    total_harga_raw_material: 48405,
    total_harga_fg: null,
  },
  {
    id: 'row-16',
    kategori: 'Adon Klappy',
    kode: 'P1002',
    nama_produk: 'Tepung Klappy #1',
    unit_produk: 'ktk',
    tipe_produk: 'raw_materials',
    minus: -1,
    finish_goods: null,
    bb_pemakaian_qt: 1.0,
    harga_raw_material: 5831,
    total_harga_raw_material: 5831,
    total_harga_fg: null,
  },
  {
    id: 'row-17',
    kategori: 'Adon Klappy',
    kode: 'P1004',
    nama_produk: 'Mentega Klappy #1',
    unit_produk: 'ktk',
    tipe_produk: 'raw_materials',
    minus: -1,
    finish_goods: null,
    bb_pemakaian_qt: 1.0,
    harga_raw_material: 7200,
    total_harga_raw_material: 7200,
    total_harga_fg: null,
  },
  {
    id: 'row-18',
    kategori: 'Adon Klappy',
    kode: 'BB165',
    nama_produk: 'Almond Bakar',
    unit_produk: 'gram',
    tipe_produk: 'raw_materials',
    minus: -180,
    finish_goods: null,
    bb_pemakaian_qt: 180.0,
    harga_raw_material: 194.8,
    total_harga_raw_material: 35064,
    total_harga_fg: null,
  },
  {
    id: 'row-19',
    kategori: 'Adon Klappy',
    kode: 'P2003',
    nama_produk: 'Adon Klappy',
    unit_produk: 'gram',
    tipe_produk: 'finish_goods',
    minus: 0,
    finish_goods: 4800,
    bb_pemakaian_qt: null,
    harga_raw_material: null,
    total_harga_raw_material: null,
    total_harga_fg: 201734,
    harga_bb: 42,
    labour_cost: 0.5,
    overhead: 0.8,
    total_hpp: 43.3,
    margin_scm: 0.38,
    h_jual_scm: 70,
  },

  // Category 4: Adonan Bola Ubi
  {
    id: 'row-20',
    kategori: 'Adonan Bola Ubi',
    kode: 'BB143',
    nama_produk: 'Ubi Ungu',
    unit_produk: 'gram',
    tipe_produk: 'raw_materials',
    minus: -10000,
    finish_goods: null,
    bb_pemakaian_qt: 10000.0,
    harga_raw_material: 18,
    total_harga_raw_material: 180000,
    total_harga_fg: null,
  },
  {
    id: 'row-21',
    kategori: 'Adonan Bola Ubi',
    kode: 'BB018',
    nama_produk: 'Gula Pasir',
    unit_produk: 'gram',
    tipe_produk: 'raw_materials',
    minus: -550,
    finish_goods: null,
    bb_pemakaian_qt: 550.0,
    harga_raw_material: 17.5,
    total_harga_raw_material: 9625,
    total_harga_fg: null,
  },
  {
    id: 'row-22',
    kategori: 'Adonan Bola Ubi',
    kode: 'BB026',
    nama_produk: 'Tepung Maizena',
    unit_produk: 'gram',
    tipe_produk: 'raw_materials',
    minus: -550,
    finish_goods: null,
    bb_pemakaian_qt: 550.0,
    harga_raw_material: 20.7,
    total_harga_raw_material: 11385,
    total_harga_fg: null,
  },
  {
    id: 'row-23',
    kategori: 'Adonan Bola Ubi',
    kode: 'BB052',
    nama_produk: 'Garam Halus',
    unit_produk: 'gram',
    tipe_produk: 'raw_materials',
    minus: -35,
    finish_goods: null,
    bb_pemakaian_qt: 35.0,
    harga_raw_material: 14.3,
    total_harga_raw_material: 501,
    total_harga_fg: null,
  },
  {
    id: 'row-24',
    kategori: 'Adonan Bola Ubi',
    kode: 'P2014',
    nama_produk: 'Adonan Bola Ubi',
    unit_produk: 'gram',
    tipe_produk: 'finish_goods',
    minus: 0,
    finish_goods: 9000,
    bb_pemakaian_qt: null,
    harga_raw_material: null,
    total_harga_raw_material: null,
    total_harga_fg: 201540,
    harga_bb: 22.4,
    labour_cost: 11.7,
    overhead: 0.4,
    total_hpp: 34.5,
    margin_scm: 0.38,
    h_jual_scm: 56,
  },

  // Category 5: Adonan Kulit Pie
  {
    id: 'row-25',
    kategori: 'Adonan Kulit Pie',
    kode: 'BB022',
    nama_produk: 'Mentega Palmboom',
    unit_produk: 'gram',
    tipe_produk: 'raw_materials',
    minus: -650,
    finish_goods: null,
    bb_pemakaian_qt: 650.0,
    harga_raw_material: 17.1,
    total_harga_raw_material: 11115,
    total_harga_fg: null,
  },
  {
    id: 'row-26',
    kategori: 'Adonan Kulit Pie',
    kode: 'BB024',
    nama_produk: 'Telur Ayam',
    unit_produk: 'butir',
    tipe_produk: 'raw_materials',
    minus: -6,
    finish_goods: null,
    bb_pemakaian_qt: 6.0,
    harga_raw_material: 1613.5,
    total_harga_raw_material: 9681,
    total_harga_fg: null,
  },
  {
    id: 'row-27',
    kategori: 'Adonan Kulit Pie',
    kode: 'BB025',
    nama_produk: 'Tepung Gula',
    unit_produk: 'gram',
    tipe_produk: 'raw_materials',
    minus: -252,
    finish_goods: null,
    bb_pemakaian_qt: 252.0,
    harga_raw_material: 22.3,
    total_harga_raw_material: 5620,
    total_harga_fg: null,
  },
  {
    id: 'row-28',
    kategori: 'Adonan Kulit Pie',
    kode: 'BB027',
    nama_produk: 'Tepung Terigu',
    unit_produk: 'gram',
    tipe_produk: 'raw_materials',
    minus: -1200,
    finish_goods: null,
    bb_pemakaian_qt: 1200.0,
    harga_raw_material: 9.2,
    total_harga_raw_material: 11040,
    total_harga_fg: null,
  },
  {
    id: 'row-29',
    kategori: 'Adonan Kulit Pie',
    kode: 'BB028',
    nama_produk: 'Vanili',
    unit_produk: 'gram',
    tipe_produk: 'raw_materials',
    minus: -2,
    finish_goods: null,
    bb_pemakaian_qt: 2.0,
    harga_raw_material: 222.0,
    total_harga_raw_material: 444,
    total_harga_fg: null,
  },
  {
    id: 'row-30',
    kategori: 'Adonan Kulit Pie',
    kode: 'BB052',
    nama_produk: 'Garam Halus',
    unit_produk: 'gram',
    tipe_produk: 'raw_materials',
    minus: -6,
    finish_goods: null,
    bb_pemakaian_qt: 6.0,
    harga_raw_material: 14.3,
    total_harga_raw_material: 86,
    total_harga_fg: null,
  },
  {
    id: 'row-31',
    kategori: 'Adonan Kulit Pie',
    kode: 'P2001',
    nama_produk: 'Adonan Kulit Pie',
    unit_produk: 'gram',
    tipe_produk: 'finish_goods',
    minus: 0,
    finish_goods: 2192,
    bb_pemakaian_qt: null,
    harga_raw_material: null,
    total_harga_raw_material: null,
    total_harga_fg: 37606,
    harga_bb: 17.2,
    labour_cost: 0.5,
    overhead: 0.3,
    total_hpp: 18.0,
    margin_scm: 0.38,
    h_jual_scm: 29,
  },
];

export const GOOGLE_APPS_SCRIPT_SAMPLE_CODE = `/**
 * Google Apps Script - Live Synchronizer BOM & Crewing Guide
 * 
 * Multi-Sheet Setup:
 * 1. Sheet "NEW FORMULA & HPP": Raw Materials & Finish Goods BOM data
 * 2. Sheet "Source Crewing Guide": Direct Labour Cost & Overhead Cost per Category/Product
 * 
 * Instructions:
 * 1. Open Google Spreadsheet.
 * 2. Go to Extensions > Apps Script.
 * 3. Delete existing code and paste this entire script.
 * 4. Click 'Deploy' > 'New deployment'.
 * 5. Select type: 'Web app'.
 * 6. Set Description: "BOM & Crewing Guide API".
 * 7. Set 'Who has access': "Anyone" (Siapa saja).
 * 8. Copy the Web App URL and paste it into Dashboard Settings!
 */

function doGet(e) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    
    // 1. Fetch "NEW FORMULA & HPP" (or fallback to active sheet)
    var bomSheet = ss.getSheetByName("NEW FORMULA & HPP") || ss.getActiveSheet();
    var data = bomSheet.getDataRange().getValues();
    
    if (data.length <= 1) {
      return responseJSON({ status: 'error', message: 'Sheet "NEW FORMULA & HPP" kosong atau tidak ada data.' });
    }

    // 2. Fetch "Source Crewing Guide" (or "Crewing Guide") for Labour & Overhead costs
    var crewingSheet = ss.getSheetByName("Source Crewing Guide") || ss.getSheetByName("Crewing Guide");
    var crewingMap = {};
    
    if (crewingSheet) {
      var cData = crewingSheet.getDataRange().getValues();
      if (cData.length > 1) {
        var cHeaders = cData[0].map(function(h) { return String(h).trim().toLowerCase(); });
        var cCatIdx = cHeaders.findIndex(function(h) { return h.includes('kategori') || h.includes('category') || h.includes('cat'); });
        if (cCatIdx === -1) cCatIdx = 0;
        
        var cKodeIdx = cHeaders.findIndex(function(h) { return h.includes('kode') || h.includes('code') || h.includes('sku'); });
        if (cKodeIdx === -1) cKodeIdx = 1;
        
        var cNamaIdx = cHeaders.findIndex(function(h) { return h.includes('nama') || h.includes('produk') || h.includes('item'); });
        if (cNamaIdx === -1) cNamaIdx = 2;
        
        // Penarikan nilai Labour: Rumus Tarif Upah Per Output (Kolom H / Index 7) dibagi Yield Output (Unit) (Kolom I / Index 8)
        var cTarifPerOutputIdx = cHeaders.findIndex(function(h) { return h.includes('tarif upah per output') || h.includes('upah per output'); });
        if (cTarifPerOutputIdx === -1) cTarifPerOutputIdx = 7; // Col H = index 7

        var cYieldIdx = cHeaders.findIndex(function(h) { return h.includes('yield output') || h.includes('yield'); });
        if (cYieldIdx === -1) cYieldIdx = 8; // Col I = index 8

        var cLabourIdx = cHeaders.findIndex(function(h) {
          return h.includes('per satuan') || h.includes('per unit') || h.includes('labour cost per');
        });
        if (cLabourIdx === -1) cLabourIdx = 10; // Col K = index 10

        var cOverheadIdx = cHeaders.findIndex(function(h) { return h.includes('overhead'); });
        if (cOverheadIdx === -1) cOverheadIdx = 4;
        
        // helper parse float mendukung format "0,6", "Rp 0,6", "0.6", dll.
        function parseNum(val) {
          if (val === null || val === undefined || val === '') return 0;
          if (typeof val === 'number') return val;
          var str = String(val).replace(/[^0-9,.-]/g, '').replace(',', '.');
          var n = parseFloat(str);
          return isNaN(n) ? 0 : n;
        }

        for (var c = 1; c < cData.length; c++) {
          var cRow = cData[c];
          if (!cRow || cRow.length === 0) continue;

          var catKey = cCatIdx < cRow.length ? String(cRow[cCatIdx] || '').trim().toLowerCase() : '';
          var kodeKey = cKodeIdx < cRow.length ? String(cRow[cKodeIdx] || '').trim().toLowerCase() : '';
          var namaKey = cNamaIdx < cRow.length ? String(cRow[cNamaIdx] || '').trim().toLowerCase() : '';
          
          // Abaikan jika tidak ada nama/kode/kategori
          if (!catKey && !kodeKey && !namaKey) continue;

          // Rumus Labour: Tarif Upah Per Output / Yield Output (Unit)
          var tarifPerOutput = (cTarifPerOutputIdx < cRow.length) ? parseNum(cRow[cTarifPerOutputIdx]) : 0;
          var yieldOutput = (cYieldIdx < cRow.length) ? parseNum(cRow[cYieldIdx]) : 0;

          var labourVal = 0;
          if (yieldOutput > 0 && tarifPerOutput > 0) {
            labourVal = Math.round((tarifPerOutput / yieldOutput) * 10) / 10;
          } else if (cLabourIdx < cRow.length && cRow[cLabourIdx] !== undefined && cRow[cLabourIdx] !== null && String(cRow[cLabourIdx]).trim() !== '') {
            labourVal = parseNum(cRow[cLabourIdx]);
          } else if (cRow.length > 10 && cRow[10] !== undefined) {
            labourVal = parseNum(cRow[10]);
          }

          var overheadVal = (cOverheadIdx !== -1 && cOverheadIdx < cRow.length) ? parseNum(cRow[cOverheadIdx]) : 0;
          
          var entry = { labour: labourVal, overhead: overheadVal };
          if (catKey) crewingMap[catKey] = entry;
          if (kodeKey) crewingMap[kodeKey] = entry;
          if (namaKey) crewingMap[namaKey] = entry;
        }
      }
    }

    // 3. Process BOM Data Headers
    var headers = data[0].map(function(h) {
      return String(h).trim().toLowerCase();
    });
    
    var colMap = {
      kategori: headers.findIndex(function(h) { return h.includes('kategori'); }),
      kode: headers.findIndex(function(h) { return h.includes('kode'); }),
      nama_produk: headers.findIndex(function(h) { return h.includes('nama') || h.includes('produk'); }),
      unit_produk: headers.findIndex(function(h) { return h.includes('unit'); }),
      tipe_produk: headers.findIndex(function(h) { return h.includes('tipe'); }),
      minus: headers.findIndex(function(h) { return h.includes('minus'); }),
      finish_goods: headers.findIndex(function(h) { return h.includes('finish') || h.includes('fg') || h.includes('yield'); }),
      bb_pemakaian_qt: headers.findIndex(function(h) { return h.includes('pemakaian') || h.includes('bb'); }),
      harga_raw_material: headers.findIndex(function(h) { return h.includes('harga raw'); }),
      total_harga_raw_material: headers.findIndex(function(h) { return h.includes('total harga raw'); }),
      total_harga_fg: headers.findIndex(function(h) { return h.includes('total harga fg'); }),
      harga_bb: headers.findIndex(function(h) { return h.includes('harga bb'); }),
      labour_cost: headers.findIndex(function(h) { return h.includes('labour'); }),
      overhead: headers.findIndex(function(h) { return h.includes('overhead'); }),
      total_hpp: headers.findIndex(function(h) { return h.includes('total hpp'); }),
      margin_scm: headers.findIndex(function(h) { return h.includes('margin'); }),
      h_jual_scm: headers.findIndex(function(h) { return h.includes('jual'); })
    };

    var rows = [];
    for (var i = 1; i < data.length; i++) {
      var row = data[i];
      if (!row[colMap.kategori] && !row[colMap.nama_produk]) continue;

      var tipe = String(row[colMap.tipe_produk] || '').toLowerCase().trim();
      var isFG = tipe.includes('finish') || tipe === 'fg';
      
      var kategoriStr = String(row[colMap.kategori] || '').trim();
      var kodeStr = String(row[colMap.kode] || '').trim();
      var namaStr = String(row[colMap.nama_produk] || '').trim();
      
      // Match Labour and Overhead from "Source Crewing Guide" map
      var crewingInfo = crewingMap[kategoriStr.toLowerCase()] || 
                        crewingMap[kodeStr.toLowerCase()] || 
                        crewingMap[namaStr.toLowerCase()] || null;
                        
      var labourVal = isFG ? (
        crewingInfo ? crewingInfo.labour : 
        (colMap.labour_cost !== -1 ? (Number(row[colMap.labour_cost]) || 0) : 0)
      ) : null;
      
      var overheadVal = isFG ? (
        crewingInfo ? crewingInfo.overhead : 
        (colMap.overhead !== -1 ? (Number(row[colMap.overhead]) || 0) : 0)
      ) : null;

      var item = {
        id: 'row-' + i,
        kategori: kategoriStr,
        kode: kodeStr,
        nama_produk: namaStr,
        unit_produk: String(row[colMap.unit_produk] || ''),
        tipe_produk: isFG ? 'finish_goods' : 'raw_materials',
        minus: Number(row[colMap.minus]) || 0,
        finish_goods: isFG ? (Number(row[colMap.finish_goods]) || 0) : null,
        bb_pemakaian_qt: !isFG ? (Number(row[colMap.bb_pemakaian_qt]) || Math.abs(Number(row[colMap.minus]) || 0)) : null,
        harga_raw_material: !isFG ? (Number(row[colMap.harga_raw_material]) || 0) : null,
        total_harga_raw_material: !isFG ? (Number(row[colMap.total_harga_raw_material]) || 0) : null,
        total_harga_fg: isFG ? (Number(row[colMap.total_harga_fg]) || 0) : null,
        harga_bb: isFG && colMap.harga_bb !== -1 ? (Number(row[colMap.harga_bb]) || null) : null,
        labour_cost: labourVal,
        overhead: overheadVal,
        total_hpp: isFG && colMap.total_hpp !== -1 ? (Number(row[colMap.total_hpp]) || null) : null,
        margin_scm: isFG && colMap.margin_scm !== -1 ? (Number(row[colMap.margin_scm]) || null) : null,
        h_jual_scm: isFG && colMap.h_jual_scm !== -1 ? (Number(row[colMap.h_jual_scm]) || null) : null
      };
      
      rows.push(item);
    }

    return responseJSON({
      status: 'success',
      count: rows.length,
      sourceSheet: bomSheet.getName(),
      crewingIntegrated: !!crewingSheet,
      timestamp: new Date().toISOString(),
      data: rows
    });

  } catch (err) {
    return responseJSON({ status: 'error', message: err.toString() });
  }
}

function responseJSON(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
`;
