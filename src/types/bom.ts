export type ProductType = 'raw_materials' | 'finish_goods';

export interface BOMRow {
  id: string;
  kategori: string;
  kode: string;
  nama_produk: string;
  unit_produk: string;
  tipe_produk: ProductType;
  minus: number; // e.g. -3 for RM, null for FG
  finish_goods: number | null; // yield quantity for FG, e.g. 4500
  bb_pemakaian_qt: number | null; // positive usage quantity for RM, e.g. 3.00
  harga_raw_material: number | null; // unit price for RM in IDR
  total_harga_raw_material: number | null; // calculated: pemakaian * harga
  total_harga_fg: number | null; // sum of total raw material costs for FG row
  updatedAt?: string;
}

export interface FinishedGoodSummary {
  kategori: string;
  kode: string;
  nama: string;
  unit: string;
  yieldQty: number;
  totalBatchCost: number;
  hppPerUnit: number;
  rawMaterialsCount: number;
  ingredients: {
    kode: string;
    nama: string;
    unit: string;
    usageQty: number;
    unitPrice: number;
    totalCost: number;
    costPercentage: number;
  }[];
}

export interface SyncStatus {
  lastSync: string | null;
  status: 'idle' | 'syncing' | 'connected' | 'error' | 'simulated';
  errorMessage?: string;
  mode: 'gas' | 'local' | 'demo';
  autoSyncEnabled: boolean;
  intervalSeconds: number;
}
