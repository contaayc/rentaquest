import { ThresholdItem } from '../types';

export const TAX_CONSTANTS = {
  TAX_YEAR: 2025,
  FILING_YEAR: 2026,
  UVT_2025: 49799,
  UVT_2026: 52374,
  SANCIÓN_MINIMA_2026: 523740, // 10 UVT 2026
  GANANCIA_OCASIONAL_RATE: 0.15, // 15%
  FACTURA_ELECTRONICA_MAX_UVT: 240, // 240 UVT (1% deduction max)
  WHATSAPP_NUMBER: '+573166281699',
  WHATSAPP_DISPLAY: '+57 316 628 1699',
  EMAIL_CONTACT: 'info@contabilidadayc.com.co',
  COMPANY_NAME: 'Contabilidad A&C',
  APP_TITLE: 'Renta Quest 2026',
};

// Thresholds for Tax Year 2025 evaluated in 2026
export const THRESHOLD_LIMITS: ThresholdItem[] = [
  {
    id: 'patrimonio',
    label: 'Patrimonio Bruto',
    description: 'Suma de todos tus bienes, inmuebles, vehículos, saldos en cuentas y ahorros al 31 de diciembre de 2025 (sin restar deudas).',
    uvtCount: 4500,
    limitCop: 224095500, // 4.500 UVT * $49.799
    valueKey: 'patrimonioBruto',
    icon: 'Building2',
    explanation: 'Incluye valor de compra o avalúo catastral de casas, fincas, apartamentos, vehículos a valor comercial/fiscal y saldos bancarios.',
    dangerTip: '¡Ojo! Las deudas no se restan para evaluar si debes declarar. Se mide el valor bruto total.'
  },
  {
    id: 'ingresos',
    label: 'Ingresos Brutos Anuales',
    description: 'Suma acumulada de salarios, honorarios, comisiones, pensiones, arriendos, rendimientos o dividendos en 2025.',
    uvtCount: 1400,
    limitCop: 69718600, // 1.400 UVT * $49.799
    valueKey: 'ingresosBrutos',
    icon: 'WalletCards',
    explanation: 'Total antes de descuentos de salud, pensión, retenciones en la fuente o gastos de negocio.',
    dangerTip: 'Un promedio mensual aproximado de $5.809.883 en 2025 te hace superar este tope.'
  },
  {
    id: 'tarjetas',
    label: 'Consumos con Tarjeta de Crédito',
    description: 'Total de consumos y avances realizados con todas tus tarjetas de crédito nacionales e internacionales durante 2025.',
    uvtCount: 1400,
    limitCop: 69718600, // 1.400 UVT * $49.799
    valueKey: 'consumosTarjeta',
    icon: 'CreditCard',
    explanation: 'Las compras a cuotas, pagos de tiquetes, suscripciones y compras diferidas suman el valor total consumido en el año.',
    dangerTip: 'Pagar con la tarjeta de crédito de otra persona o prestar la tuya sumará a tu historial en la DIAN.'
  },
  {
    id: 'compras',
    label: 'Compras y Consumos Totales',
    description: 'Suma acumulada de todos tus pagos, gastos o compras efectuadas por cualquier medio (efectivo, débito, transferencia) en 2025.',
    uvtCount: 1400,
    limitCop: 69718600, // 1.400 UVT * $49.799
    valueKey: 'comprasTotales',
    icon: 'ShoppingBag',
    explanation: 'Si compraste un vehículo, lote, pagaste colegios, insumos o remodelaciones, se acumula el valor total.',
    dangerTip: 'Aunque no hayas ganado esa suma, si compraste bienes que sumen este valor, debes declarar.'
  },
  {
    id: 'consignaciones',
    label: 'Consignaciones y Depósitos Bancarios',
    description: 'Total acumulado de transferencias recibidas, depósitos, Nequi, Daviplata, giros, préstamos y aportes en tus cuentas.',
    uvtCount: 1400,
    limitCop: 69718600, // 1.400 UVT * $49.799
    valueKey: 'consignacionesBancarias',
    icon: 'ArrowDownToDot',
    explanation: '¡El tope más peligroso! Suma TODO el dinero que entró a tus cuentas bancarias, billeteras digitales y CDT.',
    dangerTip: '¡PELIGRO TRIBUTARIO! Si le hiciste el favor a un amigo o familiar de recibirle dinero en tu Nequi o cuenta, la DIAN lo cuenta como tu consignación.'
  }
];
