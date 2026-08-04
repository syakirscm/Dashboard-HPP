import { BOMRow, FinishedGoodSummary } from '../types/bom';

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
      updatedFGRow = {
        ...fgRow,
        total_harga_fg: categoryTotalCost,
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
      const hppPerUnit = categoryTotalCost / yieldQty;

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
        hppPerUnit: Math.round(hppPerUnit * 100) / 100,
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
