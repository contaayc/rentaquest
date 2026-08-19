import React, { useState, useEffect } from 'react';
import { Shield, ShieldAlert, AlertTriangle, Flame, ArrowLeft, ChevronRight, HelpCircle, Check, DollarSign, Wallet, CreditCard, ShoppingBag, ArrowDownToDot, Building2, HeartCrack, RefreshCw } from 'lucide-react';
import { TaxUserData, ThresholdItem } from '../types';
import { THRESHOLD_LIMITS, TAX_CONSTANTS } from '../data/constants';
import { sounds } from '../utils/audio';

interface ThresholdShieldProps {
  userData: TaxUserData;
  onUpdateUserData: (data: Partial<TaxUserData>) => void;
  onNext: () => void;
  onPrev: () => void;
}

export const ThresholdShield: React.FC<ThresholdShieldProps> = ({
  userData,
  onUpdateUserData,
  onNext,
  onPrev,
}) => {
  const [values, setValues] = useState({
    patrimonioBruto: userData.patrimonioBruto || 0,
    ingresosBrutos: userData.ingresosBrutos || 0,
    consumosTarjeta: userData.consumosTarjeta || 0,
    comprasTotales: userData.comprasTotales || 0,
    consignacionesBancarias: userData.consignacionesBancarias || 0,
  });

  const [hasLentAccount, setHasLentAccount] = useState<boolean>(userData.hasLentBankAccount || false);
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);
  const [showDragonAlert, setShowDragonAlert] = useState(false);
  const [lastTriggeredItem, setLastTriggeredItem] = useState<string>('');

  // Format currency
  const formatCOP = (val: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      maximumFractionDigits: 0,
    }).format(val || 0);
  };

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Building2': return <Building2 className="w-4 h-4" />;
      case 'WalletCards': return <Wallet className="w-4 h-4" />;
      case 'CreditCard': return <CreditCard className="w-4 h-4" />;
      case 'ShoppingBag': return <ShoppingBag className="w-4 h-4" />;
      case 'ArrowDownToDot': return <ArrowDownToDot className="w-4 h-4" />;
      default: return <DollarSign className="w-4 h-4" />;
    }
  };

  const handleValueChange = (key: keyof typeof values, newVal: number, limit: number, label: string) => {
    const clamped = Math.max(0, newVal);
    const wasUnder = values[key] < limit;
    const isNowOver = clamped >= limit;

    setValues(prev => ({ ...prev, [key]: clamped }));

    if (wasUnder && isNowOver) {
      sounds.playWarning();
      setLastTriggeredItem(label);
      setShowDragonAlert(true);
    }
  };

  const addPreset = (key: keyof typeof values, amount: number, limit: number, label: string) => {
    sounds.playClick();
    const current = values[key] || 0;
    handleValueChange(key, current + amount, limit, label);
  };

  const resetField = (key: keyof typeof values) => {
    sounds.playClick();
    setValues(prev => ({ ...prev, [key]: 0 }));
  };

  // Calculate health score dynamically
  useEffect(() => {
    let health = 100;
    const isOverPatrimonio = values.patrimonioBruto >= 224095500;
    const isOverIngresos = values.ingresosBrutos >= 69718600;
    const isOverTarjetas = values.consumosTarjeta >= 69718600;
    const isOverCompras = values.comprasTotales >= 69718600;
    const isOverConsignaciones = values.consignacionesBancarias >= 69718600;

    const countOver = [isOverPatrimonio, isOverIngresos, isOverTarjetas, isOverCompras, isOverConsignaciones].filter(Boolean).length;
    
    if (countOver > 0) {
      health -= countOver * 8;
    }

    if (hasLentAccount) {
      health -= 25; // Dangerous behavior
    }

    onUpdateUserData({
      ...values,
      hasLentBankAccount: hasLentAccount,
      taxHealth: Math.max(20, health),
    });
  }, [values, hasLentAccount]);

  const hasAnyExceeded = 
    values.patrimonioBruto >= 224095500 ||
    values.ingresosBrutos >= 69718600 ||
    values.consumosTarjeta >= 69718600 ||
    values.comprasTotales >= 69718600 ||
    values.consignacionesBancarias >= 69718600;

  const handleContinue = () => {
    sounds.playLevelUp();
    onNext();
  };

  return (
    <div className="w-full max-w-xl mx-auto py-2 px-3 sm:px-4">
      {/* Level Header */}
      <div className="text-center mb-4">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-800 text-teal-300 border border-teal-500/30">
          <Shield className="w-3.5 h-3.5 text-teal-400" />
          NIVEL 3: EL ESCUDO DE TOPES 2025
        </span>
        <h2 className="text-xl sm:text-2xl font-black text-white mt-1.5">
          Ingresa tus Cifras del Año 2025
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Usa los controles deslizantes o botones rápidos para aproximar tus montos del año 2025 (UVT: $49.799).
        </p>
      </div>

      {/* Dragon Warning Overlay Modal */}
      {showDragonAlert && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-slate-900 border-2 border-rose-500 rounded-3xl max-w-sm w-full p-5 text-white shadow-2xl relative overflow-hidden text-center">
            <div className="w-16 h-16 mx-auto bg-rose-600/20 border border-rose-500/50 rounded-2xl flex items-center justify-center mb-3">
              <Flame className="w-8 h-8 text-rose-500 animate-bounce" />
            </div>

            <span className="text-[10px] uppercase tracking-wider font-extrabold px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40">
              ¡ALERTA TRIBUTARIA!
            </span>

            <h3 className="text-lg font-black text-white mt-2">
              ¡Has superado el tope legal!
            </h3>

            <p className="text-xs text-slate-300 mt-2 leading-relaxed">
              En <strong className="text-rose-400">{lastTriggeredItem}</strong> has sobrepasado el límite fijado por la DIAN para el año gravable 2025. Con solo un tope superado, quedas <strong>OBLIGADO A DECLARAR RENTA</strong>.
            </p>

            <button
              onClick={() => {
                setShowDragonAlert(false);
                sounds.playClick();
              }}
              className="mt-4 w-full py-3 bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-lg shadow-rose-950/60 transition-colors cursor-pointer"
            >
              Comprendido, continuar evaluando
            </button>
          </div>
        </div>
      )}

      {/* Live Verdict Pill */}
      <div className={`mb-4 p-3 rounded-2xl border flex items-center justify-between transition-all ${
        hasAnyExceeded 
          ? 'bg-rose-950/70 border-rose-500/80 text-rose-200' 
          : 'bg-emerald-950/70 border-emerald-500/80 text-emerald-200'
      }`}>
        <div className="flex items-center gap-2">
          {hasAnyExceeded ? (
            <ShieldAlert className="w-5 h-5 text-rose-400 flex-shrink-0 animate-pulse" />
          ) : (
            <Shield className="w-5 h-5 text-emerald-400 flex-shrink-0" />
          )}
          <div>
            <div className="text-xs font-black">
              {hasAnyExceeded ? 'ESTADO: OBLIGADO A DECLARAR' : 'ESTADO: DENTRO DE LOS LÍMITES'}
            </div>
            <div className="text-[10px] text-slate-300">
              {hasAnyExceeded 
                ? 'Al menos 1 variable superó el umbral de ley.' 
                : 'Aún no superas ninguno de los 5 topes.'}
            </div>
          </div>
        </div>

        <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
          hasAnyExceeded ? 'bg-rose-500 text-white' : 'bg-emerald-500 text-slate-950'
        }`}>
          {hasAnyExceeded ? 'ALERTA' : 'A SALVO'}
        </span>
      </div>

      {/* 5 Threshold Cards */}
      <div className="space-y-3.5">
        {THRESHOLD_LIMITS.map((item) => {
          const currentVal = Number(values[item.valueKey]) || 0;
          const isOver = currentVal >= item.limitCop;
          const percent = Math.min(100, (currentVal / item.limitCop) * 100);
          const maxSliderValue = item.id === 'patrimonio' ? 600000000 : 200000000;

          return (
            <div
              key={item.id}
              className={`p-3.5 sm:p-4 rounded-2xl border transition-all ${
                isOver 
                  ? 'bg-rose-950/30 border-rose-500/60 shadow-lg shadow-rose-950/20' 
                  : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
              }`}
            >
              {/* Card Header */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className={`p-2 rounded-xl ${isOver ? 'bg-rose-600 text-white' : 'bg-slate-800 text-teal-400'}`}>
                    {getIcon(item.icon)}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h3 className="text-xs sm:text-sm font-bold text-white">
                        {item.label}
                      </h3>
                      <button
                        type="button"
                        onClick={() => {
                          setActiveTooltip(activeTooltip === item.id ? null : item.id);
                          sounds.playClick();
                        }}
                        className="text-slate-400 hover:text-teal-300"
                      >
                        <HelpCircle className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <span className="text-[10px] text-slate-400">
                      Límite: <strong className="text-amber-400">{formatCOP(item.limitCop)}</strong> ({item.uvtCount} UVT)
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className={`text-xs sm:text-sm font-extrabold ${isOver ? 'text-rose-400' : 'text-teal-300'}`}>
                    {formatCOP(currentVal)}
                  </span>
                  <div className="text-[9px] uppercase font-bold tracking-wider">
                    {isOver ? (
                      <span className="text-rose-400">Supera Tope</span>
                    ) : (
                      <span className="text-slate-500">{percent.toFixed(0)}% del límite</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Tooltip detail */}
              {activeTooltip === item.id && (
                <div className="mt-2 p-2.5 bg-slate-800 rounded-xl text-[11px] text-slate-300 space-y-1 border border-slate-700 animate-fadeIn">
                  <p>{item.description}</p>
                  <p className="text-amber-300 font-medium">⚠️ {item.dangerTip}</p>
                </div>
              )}

              {/* Progress bar indicator */}
              <div className="mt-2.5 w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${
                    isOver 
                      ? 'bg-rose-500' 
                      : percent > 75 
                        ? 'bg-amber-400' 
                        : 'bg-teal-500'
                  }`}
                  style={{ width: `${Math.max(1, percent)}%` }}
                />
              </div>

              {/* Interactive Range Slider */}
              <div className="mt-2.5 flex items-center gap-2">
                <input
                  type="range"
                  min={0}
                  max={maxSliderValue}
                  step={item.id === 'patrimonio' ? 5000000 : 2000000}
                  value={currentVal}
                  onChange={(e) => handleValueChange(item.valueKey, Number(e.target.value), item.limitCop, item.label)}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-teal-500"
                />
              </div>

              {/* Quick Preset Buttons */}
              <div className="mt-2 flex items-center justify-between gap-1 overflow-x-auto pb-1 text-[10px]">
                <button
                  type="button"
                  onClick={() => resetField(item.valueKey)}
                  className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-400 rounded-lg transition-colors flex items-center gap-0.5"
                >
                  <RefreshCw className="w-2.5 h-2.5" /> $0
                </button>
                <button
                  type="button"
                  onClick={() => addPreset(item.valueKey, 10000000, item.limitCop, item.label)}
                  className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors font-medium"
                >
                  +$10M
                </button>
                <button
                  type="button"
                  onClick={() => addPreset(item.valueKey, 50000000, item.limitCop, item.label)}
                  className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors font-medium"
                >
                  +$50M
                </button>
                <button
                  type="button"
                  onClick={() => handleValueChange(item.valueKey, item.limitCop, item.limitCop, item.label)}
                  className="px-2 py-1 bg-amber-950/60 hover:bg-amber-900/60 text-amber-300 border border-amber-500/30 rounded-lg transition-colors font-bold"
                >
                  Tope Exacto
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Special Dangerous Habit: Lending Bank Accounts (Prestar Cuenta / Nequi) */}
      <div className="mt-4 p-3.5 bg-slate-900/90 border border-amber-500/40 rounded-2xl">
        <label className="flex items-start gap-2.5 cursor-pointer">
          <input
            type="checkbox"
            checked={hasLentAccount}
            onChange={(e) => {
              setHasLentAccount(e.target.checked);
              sounds.playWarning();
            }}
            className="mt-0.5 w-4 h-4 rounded text-rose-600 focus:ring-rose-500 bg-slate-800 border-slate-700"
          />
          <div>
            <span className="text-xs font-bold text-white flex items-center gap-1.5">
              <HeartCrack className="w-3.5 h-3.5 text-rose-500" />
              ¿Le prestaste tu Nequi, Daviplata o cuenta a familiares / terceros en 2025?
            </span>
            <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
              La DIAN recibe reportes de información exógena de los bancos. <strong>Todo dinero que entre a tu nombre cuenta para el tope de $69.718.600</strong>, aunque no haya sido tuyo ni te haya dejado ganancias.
            </p>
          </div>
        </label>

        {hasLentAccount && (
          <div className="mt-2 p-2 bg-rose-950/60 border border-rose-500/50 rounded-xl text-[11px] text-rose-200 animate-fadeIn">
            ⚠️ <strong>Impacto en Salud Tributaria (-25%):</strong> Prestar la cuenta es una de las principales causas por las que personas no obligadas terminan siendo sancionadas por la DIAN. Asegúrate de sumar esos depósitos al tope de consignaciones.
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
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
          className="flex-1 py-3.5 px-4 bg-gradient-to-r from-teal-600 to-emerald-500 hover:from-teal-500 hover:to-emerald-400 text-white font-black text-sm sm:text-base rounded-xl shadow-lg shadow-teal-950/60 flex items-center justify-center gap-2 transition-all active:scale-[0.98] cursor-pointer"
        >
          <span>CONTINUAR A MEJORAS & BENEFICIOS</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
