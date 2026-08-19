export interface TaxUserData {
  playerName: string;
  playerProfileCategory?: string;
  cedula: string;
  isSimpleRegime: boolean;
  isLiquidatedEstate: boolean;
  estateDeceasedResident?: boolean;
  
  // Residency (Art. 10 E.T.)
  stayedMoreThan183Days: boolean;
  hasColombianNationality: boolean;
  hasFamilyInColombia: boolean;
  has50PercentIncomeInColombia: boolean;
  has50PercentAssetsInColombia: boolean;
  isInTaxHaven: boolean;
  qualifiesForForeignDomicileException: boolean;
  isTaxResident: boolean;
  
  // Monetary Thresholds (Año Gravable 2025)
  patrimonioBruto: number;
  ingresosBrutos: number;
  consumosTarjeta: number;
  comprasTotales: number;
  consignacionesBancarias: number;
  
  // Special modules
  hasHomeImprovements: boolean;
  improvementCost: number;
  hasElectronicInvoices: boolean;
  electronicInvoiceExpenses: number;
  hasLentBankAccount: boolean;
  
  // Inventory Checklist
  collectedDocuments: string[];
  
  // Tax Health Score (0 - 100)
  taxHealth: number;
}

export interface ThresholdItem {
  id: string;
  label: string;
  description: string;
  uvtCount: number;
  limitCop: number;
  valueKey: keyof Pick<TaxUserData, 'patrimonioBruto' | 'ingresosBrutos' | 'consumosTarjeta' | 'comprasTotales' | 'consignacionesBancarias'>;
  icon: string;
  explanation: string;
  dangerTip: string;
}

export interface CalendarEntry {
  digits: string; // e.g. "01 - 02"
  startDigit: number;
  endDigit: number;
  dueDate: string; // e.g. "Agosto 12, 2026"
  month: 'Agosto' | 'Septiembre' | 'Octubre';
  isoDate: string; // e.g. "2026-08-12"
}

export interface DocumentItem {
  id: string;
  title: string;
  category: 'Ingresos' | 'Bienes' | 'Deducciones' | 'Bancos' | 'DIAN';
  description: string;
  importance: 'Crítico' | 'Recomendado' | 'Beneficio 1%';
  iconName: string;
}

export type GameStage = 
  | 'welcome' 
  | 'classification' 
  | 'residency' 
  | 'thresholds' 
  | 'improvements' 
  | 'results';
