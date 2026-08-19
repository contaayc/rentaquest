import React, { useState } from 'react';
import { Hammer, Sparkles, TrendingUp, Coins, ShieldCheck, FileCheck, ArrowLeft, ChevronRight, Calculator, CheckCircle2 } from 'lucide-react';
import { TaxUserData } from '../types';
import { TAX_CONSTANTS } from '../data/constants';
import { sounds } from '../utils/audio';

interface ImprovementModuleProps {
  userData: TaxUserData;
  onUpdateUserData: (data: Partial<TaxUserData>) => void;
  onNext: () => void;
  onPrev: () => void;
}

export const ImprovementModule: React.FC<ImprovementModuleProps> = ({
  userData,
  onUpdateUserData,
  onNext,
  onPrev,
}) => {
  const [hasImprovements, setHasImprovements] = useState<boolean>(userData.hasHomeImprovements || false);
  const [improvementAmount, setImprovementAmount] = useState<number>(userData.improvementCost || 25000000);
  
  const [hasElectronicInvoices, setHasElectronicInvoices] = useState<boolean>(userData.hasElectronicInvoices || false);
  const [invoiceAmount, setInvoiceAmount] = useState<number>(userData.electronicInvoiceExpenses || 15000000);

  const formatCOP = (val: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      maximumFractionDigits: 0,
    }).format(val || 0);
  };

  // 15% saved on future capital gains (Ganancia Ocasional)
  const estimatedTaxSaved = improvementAmount * TAX_CONSTANTS.GANANCIA_OCASIONAL_RATE;

  // 1% electronic invoice deduction (Art. 336 E.T.) max 240 UVT 2025 = $11.951.760
  const max1PctDeduction = TAX_CONSTANTS.FACTURA_ELECTRONICA_MAX_UVT * TAX_CONSTANTS.UVT_2025;
  const raw1PctDeduction = invoiceAmount * 0.01;
  const effective1PctDeduction = Math.min(raw1PctDeduction, max1PctDeduction);

  const handleContinue = () => {
    sounds.playLevelUp();
    
    // Reward bonus health points for good tax documentation practices
    let bonusHealth = userData.taxHealth;
    if (hasElectronicInvoices) bonusHealth = Math.min(100, bonusHealth + 10);
    if (hasImprovements) bonusHealth = Math.min(100, bonusHealth + 5);

    onUpdateUserData({
      hasHomeImprovements: hasImprovements,
      improvementCost: hasImprovements ? improvementAmount : 0,
      hasElectronicInvoices: hasElectronicInvoices,
      electronicInvoiceExpenses: hasElectronicInvoices ? invoiceAmount : 0,
      taxHealth: bonusHealth,
    });

    onNext();
  };

  return (
    <div className="w-full max-w-xl mx-auto py-2 px-3 sm:px-4">
      {/* Header */}
      <div className="text-center mb-4">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-800 text-teal-300 border border-teal-500/30">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          NIVEL 4: MEJORAS & ESTRATEGIA PATRIMONIAL
        </span>
        <h2 className="text-xl sm:text-2xl font-black text-white mt-1.5">
          Beneficios y Protección de tu Patrimonio
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Aprende cómo ahorrar legalmente en impuestos y activar beneficios tributarios antes de ver tu diagnóstico.
        </p>
      </div>

      <div className="space-y-4">
        {/* Module 1: Reformas y Mejoras de Inmuebles */}
        <div className="bg-slate-900/90 border border-slate-700/80 rounded-2xl p-4 shadow-xl">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-amber-500/20 text-amber-300 rounded-xl border border-amber-500/30">
                <Hammer className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-bold text-white">
                  Reformas y Mejoras de Inmuebles
                </h3>
                <span className="text-[10px] text-amber-400 font-semibold">
                  Ahorro en Ganancia Ocasional (Tarifa 15%)
                </span>
              </div>
            </div>
          </div>

          <p className="text-xs text-slate-300 mt-2.5 leading-relaxed">
            ¿Hiciste remodelaciones, pisos, cocina o ampliaciones en tu casa/apartamento durante 2025?
          </p>

          <label className="mt-3 flex items-center gap-2.5 p-2.5 bg-slate-800/80 rounded-xl cursor-pointer hover:bg-slate-800">
            <input
              type="checkbox"
              checked={hasImprovements}
              onChange={(e) => {
                setHasImprovements(e.target.checked);
                sounds.playCoin();
              }}
              className="w-4 h-4 rounded text-teal-600 focus:ring-teal-500 bg-slate-700 border-slate-600"
            />
            <span className="text-xs font-bold text-white">
              Sí, realicé mejoras o remodelaciones en un inmueble
            </span>
          </label>

          {hasImprovements && (
            <div className="mt-3 p-3 bg-slate-800/90 rounded-xl border border-amber-500/30 space-y-3 animate-fadeIn">
              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-slate-300">Valor invertido en mejoras:</span>
                  <strong className="text-amber-300 font-bold">{formatCOP(improvementAmount)}</strong>
                </div>
                <input
                  type="range"
                  min={5000000}
                  max={150000000}
                  step={5000000}
                  value={improvementAmount}
                  onChange={(e) => setImprovementAmount(Number(e.target.value))}
                  className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
                />
              </div>

              {/* Tax Shield Calculation */}
              <div className="p-2.5 bg-amber-950/40 rounded-lg border border-amber-500/40 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-amber-400 block">
                    Escudo Fiscal Ganancia Ocasional (15%):
                  </span>
                  <span className="text-[11px] text-slate-300">
                    Ahorro futuro de impuesto al vender la propiedad:
                  </span>
                </div>
                <span className="text-sm font-black text-amber-300">
                  {formatCOP(estimatedTaxSaved)}
                </span>
              </div>

              <div className="text-[11px] text-slate-400 space-y-1">
                <p className="font-semibold text-teal-300">📋 Soporte legal indispensable:</p>
                <p>• Requiere <strong>Facturas Electrónicas</strong> de materiales y <strong>Documentos Soporte Electrónicos</strong> para mano de obra (maestros de obra no obligados a facturar).</p>
                <p>• Estas mejoras incrementan el <strong>Costo Fiscal</strong> en tu patrimonio sin alterar la escritura pública.</p>
              </div>
            </div>
          )}
        </div>

        {/* Module 2: El Cofre del 1% por Factura Electrónica */}
        <div className="bg-slate-900/90 border border-slate-700/80 rounded-2xl p-4 shadow-xl">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-teal-500/20 text-teal-300 rounded-xl border border-teal-500/30">
                <Coins className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-bold text-white">
                  Cofre del 1% por Factura Electrónica
                </h3>
                <span className="text-[10px] text-teal-400 font-semibold">
                  Beneficio Art. 336 Estatuto Tributario
                </span>
              </div>
            </div>
          </div>

          <p className="text-xs text-slate-300 mt-2.5 leading-relaxed">
            ¿Exigiste factura electrónica a tu nombre en supermercados, restaurantes y tiendas pagando con tarjeta o transferencia?
          </p>

          <label className="mt-3 flex items-center gap-2.5 p-2.5 bg-slate-800/80 rounded-xl cursor-pointer hover:bg-slate-800">
            <input
              type="checkbox"
              checked={hasElectronicInvoices}
              onChange={(e) => {
                setHasElectronicInvoices(e.target.checked);
                sounds.playCoin();
              }}
              className="w-4 h-4 rounded text-teal-600 focus:ring-teal-500 bg-slate-700 border-slate-600"
            />
            <span className="text-xs font-bold text-white">
              Sí, tengo facturas electrónicas con pagos bancarizados
            </span>
          </label>

          {hasElectronicInvoices && (
            <div className="mt-3 p-3 bg-slate-800/90 rounded-xl border border-teal-500/30 space-y-3 animate-fadeIn">
              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-slate-300">Estimado en compras facturadas:</span>
                  <strong className="text-teal-300 font-bold">{formatCOP(invoiceAmount)}</strong>
                </div>
                <input
                  type="range"
                  min={2000000}
                  max={80000000}
                  step={2000000}
                  value={invoiceAmount}
                  onChange={(e) => setInvoiceAmount(Number(e.target.value))}
                  className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-teal-500"
                />
              </div>

              {/* 1% Deduction Result */}
              <div className="p-2.5 bg-teal-950/40 rounded-lg border border-teal-500/40 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-teal-400 block">
                    Deducción Imputable en Renta (1%):
                  </span>
                  <span className="text-[11px] text-slate-300">
                    Monto deducible directo en tu declaración:
                  </span>
                </div>
                <span className="text-sm font-black text-teal-300">
                  {formatCOP(effective1PctDeduction)}
                </span>
              </div>

              <p className="text-[11px] text-slate-400">
                ⭐ <strong>Tope máximo de ley:</strong> Hasta 240 UVT (${formatCOP(max1PctDeduction)}) sin importar si tienes o no relación de causalidad con tu trabajo.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="flex items-center gap-3 mt-5">
        <button
          onClick={() => {
            sounds.playClick();
            onPrev();
          }}
          className="py-3 px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs sm:text-sm rounded-xl border border-slate-700 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Atrás</span>
        </button>

        <button
          onClick={handleContinue}
          className="flex-1 py-3.5 px-4 bg-gradient-to-r from-teal-600 via-teal-500 to-emerald-500 hover:from-teal-500 hover:to-emerald-400 text-white font-black text-sm sm:text-base rounded-xl shadow-lg shadow-teal-950/60 flex items-center justify-center gap-2 transition-all active:scale-[0.98] cursor-pointer"
        >
          <span>VER DIAGNÓSTICO EN EL ORÁCULO</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
