import { DocumentItem } from '../types';

export const HERO_DOCUMENTS: DocumentItem[] = [
  {
    id: 'form_220',
    title: 'Certificado de Ingresos y Retenciones (Formulario 220)',
    category: 'Ingresos',
    description: 'Expedido por tu empleador si trabajas como asalariado durante el año 2025.',
    importance: 'Crítico',
    iconName: 'FileText'
  },
  {
    id: 'extractos_bancarios',
    title: 'Extractos Bancarios al 31 de Diciembre de 2025',
    category: 'Bancos',
    description: 'Certificados tributarios y extractos de todas tus cuentas bancarias, Nequi, Daviplata y billeteras.',
    importance: 'Crítico',
    iconName: 'Landmark'
  },
  {
    id: 'retenciones_fuente',
    title: 'Certificados de Retención en la Fuente',
    category: 'Ingresos',
    description: 'Entregados por clientes o empresas que te practicaron retenciones por honorarios, servicios o comisiones.',
    importance: 'Crítico',
    iconName: 'Receipt'
  },
  {
    id: 'factura_electronica_1pct',
    title: 'Facturas Electrónicas con Medio Electrónico (1% Deducción)',
    category: 'Deducciones',
    description: 'Facturas a tu nombre pagadas con tarjeta/transferencia para descontar el 1% de compras (hasta 240 UVT).',
    importance: 'Beneficio 1%',
    iconName: 'Sparkles'
  },
  {
    id: 'prediales_inmuebles',
    title: 'Impuesto Predial y Avalúos Catastrales 2025',
    category: 'Bienes',
    description: 'Recibo o paz y salvo predial de casas, apartamentos, lotes o locales de tu propiedad al cierre de 2025.',
    importance: 'Crítico',
    iconName: 'Home'
  },
  {
    id: 'impuesto_vehiculos',
    title: 'Impuesto de Vehículos 2025',
    category: 'Bienes',
    description: 'Declaración y pago del impuesto de rodamiento de carros o motos de tu propiedad.',
    importance: 'Recomendado',
    iconName: 'Car'
  },
  {
    id: 'certificados_deudas',
    title: 'Certificados de Deudas y Créditos Bancarios',
    category: 'Bancos',
    description: 'Saldos de créditos hipotecarios, libranzas, tarjetas y deudas a favor de terceros al 31 de diciembre.',
    importance: 'Recomendado',
    iconName: 'CreditCard'
  },
  {
    id: 'dependientes_economicos',
    title: 'Soportes de Dependientes Económicos',
    category: 'Deducciones',
    description: 'Registros civiles o certificados de estudio de hijos menores de edad o cónyuge que dependan económicamente de ti (72 UVT por dependiente).',
    importance: 'Recomendado',
    iconName: 'Users'
  },
  {
    id: 'medicina_prepagada',
    title: 'Certificados de Medicina Prepagada o Pólizas de Salud',
    category: 'Deducciones',
    description: 'Pagos realizados a entidades de salud privada durante 2025 (deducible hasta 16 UVT mensuales).',
    importance: 'Recomendado',
    iconName: 'HeartPulse'
  },
  {
    id: 'aportes_afc_pension',
    title: 'Aportes Voluntarios a Pensión / Cuentas AFC',
    category: 'Deducciones',
    description: 'Certificados de ahorro para fomento de construcción o aportes voluntarios de pensión.',
    importance: 'Recomendado',
    iconName: 'PiggyBank'
  },
  {
    id: 'mejoras_inmuebles',
    title: 'Facturas Electrónicas y Soportes de Mejoras / Reformas',
    category: 'Bienes',
    description: 'Documentos soporte y facturas de remodelaciones que incrementan el costo fiscal y bajan la ganancia ocasional futura.',
    importance: 'Recomendado',
    iconName: 'Hammer'
  },
  {
    id: 'rut_actualizado',
    title: 'RUT Actualizado con Firma Electrónica DIAN',
    category: 'DIAN',
    description: 'Registro Único Tributario con código de actividad económica al día y firma digital habilitada en la DIAN.',
    importance: 'Crítico',
    iconName: 'ShieldCheck'
  }
];
