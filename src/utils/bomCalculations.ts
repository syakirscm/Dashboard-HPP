import { BOMRow, FinishedGoodSummary } from '../types/bom';

/**
 * Calculates Labour Cost per Unit using formula:
 * Labour Cost = Tarif Upah Per Output / Yield Output (Unit)
 */
export function calculateLabourCostForFG(fgRow: BOMRow, yieldQty: number): number {
  if (yieldQty <= 0) return 0;

  // 1. If explicit tarif_upah_per_output exists on fgRow
  if (typeof fgRow.tarif_upah_per_output === 'number' && fgRow.tarif_upah_per_output > 0) {
    return Math.round((fgRow.tarif_upah_per_output / yieldQty) * 10) / 10;
  }

  // 2. If fgRow.labour_cost is > 100, it represents raw Tarif Upah Per Output
  if (typeof fgRow.labour_cost === 'number' && fgRow.labour_cost > 100) {
    return Math.round((fgRow.labour_cost / yieldQty) * 10) / 10;
  }

  // 3. Known Tarif Upah lookup by kode / category / name from Crewing Guide
  const normKode = (fgRow.kode || '').trim().toLowerCase();
  const normCat = (fgRow.kategori || '').trim().toLowerCase();
  const normNama = (fgRow.nama_produk || '').trim().toLowerCase();

  const TARIF_UPAH_MAP: Record<string, number> = {
    'p2002': 2564,   // Adon Fla (2564 / 4500 = 0.569 -> 0.6)
    'p2015': 1709,   // Adon Fla Cream Cheese (1709 / 400 = 4.27 -> 4.3)
    'p2003': 2564,   // Adon Klappy (2564 / 4800 = 0.53 -> 0.5)
    'p2014': 105265, // Adonan Bola Ubi (105265 / 9000 = 11.69 -> 11.7)
    'p2001': 1197,   // Adonan Kulit Pie (1197 / 2192 = 0.54 -> 0.5)
    'p2017': 10256,  // Adonan Kulit Pie Large (10256 / 2300 = 4.45 -> 4.5)
    'p2012': 4615,   // Adonan Kulit Risol Biasa (4615 / 8000 = 0.57 -> 0.6)
    'p2013': 4615,   // Adonan Kulit Risol Coklat (4615 / 8000 = 0.57 -> 0.6)
    'p2016': 2564,   // Adonan Toping Pie Susu (2564 / 352 = 7.28 -> 7.3)
    'p2004': 12821,  // Adonan Topping Coklat (12821 / 1000 = 12.8)
    'p2005': 12821,  // Adonan Topping Cookies & Cream (12821 / 1000 = 12.8)
    'p2009': 56650,  // Adonan Isian Beef BBQ (56650 / 15000 = 3.77 -> 3.8)
    'p2010': 67008,  // Adonan Isian Chicken Ragout (67008 / 15000 = 4.46 -> 4.5)
    'p2011': 67257,  // Adonan Isian Truffle Mushroom (67257 / 9000 = 7.47 -> 7.5)
    'p1010': 1795,   // Racikan Mayo (1795 / 2000 = 0.89 -> 0.9)
    'bj045': 85043,  // Kulit Risol Biasa (85043 / 200 = 425.2)
    'bj046': 85043,  // Kulit Risol Coklat (85043 / 200 = 425.2)
    'bj014': 1128,   // Acar (1128 / 500 = 2.25 -> 2.3)
    'bb165': 8547,   // Almond Bakar (8547 / 3780 = 2.26 -> 2.3)
    'bj028': 11795,  // Ayam Liwet (11795 / 140 = 84.25 -> 84.3)
    'bj044': 24650,  // Ayam Suwir (24650 / 5500 = 4.48 -> 4.5)
    'bj016': 18154,  // Ayam Tumis (18154 / 2500 = 7.26 -> 7.3)
    'bj011': 38376,  // Bakso Daging (38376 / 260 = 147.6)
    'bj010': 22140,  // Bakso Keju (22140 / 150 = 147.6)
    'bj013': 29520,  // Bakso Keju Muncrat (29520 / 200 = 147.6)
    'bj012': 20664,  // Bakso Urat (20664 / 140 = 147.6)
    'bsj-12209': 26568, // BSJ Bola Ubi Lumer (26568 / 180 = 147.6)
    'bj031': 6570,   // Bumbu Liwet (6570 / 1500 = 4.38 -> 4.4)
    'p2008': 8760,   // Bumbu Sate Maranggi (8760 / 2000 = 4.38 -> 4.4)
    'p2007': 10950,  // Bumbu Ungkep (10950 / 2500 = 4.38 -> 4.4)
    'p2006': 3942,   // Bumbu Sate Telur (3942 / 900 = 4.38 -> 4.4)
    'p1006': 17520,  // Cream Pistachio (17520 / 4000 = 4.38 -> 4.4)
    'bj018': 3650,   // Daging Iris (3650 / 500 = 7.3)
    'adon fla': 2564,
    'adon fla cream cheese': 1709,
    'adon klappy': 2564,
    'adonan bola ubi': 105265,
    'adonan kulit pie': 1197,
    'adonan kulit pie large': 10256,
    'adonan kulit pie medium': 10256,
    'adonan kulit risol biasa': 4615,
    'adonan kulit risol coklat': 4615,
    'adonan toping pie susu': 2564,
    'adonan topping coklat': 12821,
    'adonan topping cookies & cream': 12821,
    'adonan isian beef bbq': 56650,
    'adonan isian chicken ragout': 67008,
    'adonan isian truffle mushroom': 67257,
  };

  const tarif = TARIF_UPAH_MAP[normKode] || TARIF_UPAH_MAP[normCat] || TARIF_UPAH_MAP[normNama];
  if (tarif && tarif > 0) {
    return Math.round((tarif / yieldQty) * 10) / 10;
  }

  // 4. Fallback: If fgRow.labour_cost is already provided per-unit (e.g. 0.6), derive total tarif from base yield
  if (typeof fgRow.labour_cost === 'number' && fgRow.labour_cost > 0) {
    const baseYield = (fgRow.finish_goods && fgRow.finish_goods > 0) ? fgRow.finish_goods : yieldQty;
    const derivedTarif = fgRow.labour_cost * baseYield;
    return Math.round((derivedTarif / yieldQty) * 10) / 10;
  }

  return 0;
}

/**
 * Recalculates all total prices and finished goods HPP dynamically
 * to ensure consistency even if user edits prices or usages in the spreadsheet/dashboard.
 */
export function processBOMData(rows: BOMRow[]): {
  processedRows: BOMRow[];
  fgSummaries: FinishedGoodSummary[];
  totalBatchCost: number;
} {
  // First group by Category
  const categoryGroups: { [cat: string]: BOMRow[] } = {};
  rows.forEach((row) => {
    if (!categoryGroups[row.kategori]) {
      categoryGroups[row.kategori] = [];
    }
    categoryGroups[row.kategori].push(row);
  });

  const processedRows: BOMRow[] = [];
  const fgSummaries: FinishedGoodSummary[] = [];
  let totalBatchCost = 0;

  Object.entries(categoryGroups).forEach(([catName, catRows]) => {
    const rawMaterials = catRows.filter((r) => r.tipe_produk === 'raw_materials');
    const fgRow = catRows.find((r) => r.tipe_produk === 'finish_goods');

    // Calculate raw material totals
    let categoryTotalCost = 0;
    const updatedRawMaterials: BOMRow[] = rawMaterials.map((rm) => {
      const usageQty = rm.bb_pemakaian_qt ?? Math.abs(rm.minus || 0);
      const price = rm.harga_raw_material ?? 0;
      const totalRM = Math.round(usageQty * price * 100) / 100;
      categoryTotalCost += totalRM;

      return {
        ...rm,
        bb_pemakaian_qt: usageQty,
        harga_raw_material: price,
        total_harga_raw_material: totalRM,
      };
    });

    categoryTotalCost = Math.round(categoryTotalCost);
    totalBatchCost += categoryTotalCost;

    // Update FG row
    let updatedFGRow: BOMRow | undefined;
    if (fgRow) {
      const yieldQty = fgRow.finish_goods || 1;
      // Harga BB per unit = total raw material cost / yield
      const hargaBB = yieldQty > 0 ? Math.round((categoryTotalCost / yieldQty) * 10) / 10 : 0;
      
      // Calculate Labour Cost = Tarif Upah Per Output / Yield Output (Unit)
      const labourCost = calculateLabourCostForFG(fgRow, yieldQty);

      // Overhead Cost = Harga BB x Average Persentase Ratio (1.8% dari tabel COST UTILITY di raw data)
      const OVERHEAD_RATIO = 0.018; // 1.8% average ratio
      const overheadCost = Math.round((hargaBB * OVERHEAD_RATIO) * 10) / 10;
      
      // Total HPP = Harga BB + Labour Cost + Overhead (dynamically recalculated)
      const calculatedHPP = Math.round((hargaBB + labourCost + overheadCost) * 10) / 10;
      const totalHPP = calculatedHPP > 0 ? calculatedHPP : (fgRow.total_hpp ?? 0);
      
      // Margin SCM %
      const marginSCM = fgRow.margin_scm ?? 0.38; // default 38%
      
      // H Jual SCM dynamically calculated based on live totalHPP
      const hJualSCM =
        marginSCM > 0 && marginSCM < 1
          ? Math.round(totalHPP / (1 - marginSCM))
          : Math.round(totalHPP * 1.38);

      updatedFGRow = {
        ...fgRow,
        total_harga_fg: categoryTotalCost,
        harga_bb: hargaBB,
        labour_cost: labourCost,
        overhead: overheadCost,
        total_hpp: totalHPP,
        margin_scm: marginSCM,
        h_jual_scm: hJualSCM,
      };
    }

    // Add to processed rows in standard order: raw materials followed by FG row
    processedRows.push(...updatedRawMaterials);
    if (updatedFGRow) {
      processedRows.push(updatedFGRow);
    }

    // Build FinishedGoodSummary object for analytics and cards
    if (updatedFGRow) {
      const yieldQty = updatedFGRow.finish_goods || 1;
      const hargaBB = updatedFGRow.harga_bb || 0;
      const labourCost = updatedFGRow.labour_cost || 0;
      const overheadCost = updatedFGRow.overhead || 0;
      const totalHPP = updatedFGRow.total_hpp || (hargaBB + labourCost + overheadCost);
      const marginSCM = updatedFGRow.margin_scm || 0.38;
      const hJualSCM = updatedFGRow.h_jual_scm || 0;

      const ingredients = updatedRawMaterials.map((rm) => {
        const totalRM = rm.total_harga_raw_material || 0;
        const pct = categoryTotalCost > 0 ? (totalRM / categoryTotalCost) * 100 : 0;
        return {
          kode: rm.kode,
          nama: rm.nama_produk,
          unit: rm.unit_produk,
          usageQty: rm.bb_pemakaian_qt || 0,
          unitPrice: rm.harga_raw_material || 0,
          totalCost: totalRM,
          costPercentage: Math.round(pct * 10) / 10,
        };
      });

      fgSummaries.push({
        kategori: catName,
        kode: updatedFGRow.kode,
        nama: updatedFGRow.nama_produk,
        unit: updatedFGRow.unit_produk,
        yieldQty: yieldQty,
        totalBatchCost: categoryTotalCost,
        hppPerUnit: hargaBB,
        hargaBB: hargaBB,
        labourCost: labourCost,
        overheadCost: overheadCost,
        totalHPP: totalHPP,
        marginSCM: marginSCM,
        hJualSCM: hJualSCM,
        rawMaterialsCount: updatedRawMaterials.length,
        ingredients: ingredients,
      });
    }
  });

  return {
    processedRows,
    fgSummaries,
    totalBatchCost,
  };
}

export function formatIDR(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 2,
    minimumFractionDigits: 0,
  }).format(amount);
}

export function formatNumber(num: number, maxDecimals = 2): string {
  return new Intl.NumberFormat('id-ID', {
    maximumFractionDigits: maxDecimals,
  }).format(num);
}
