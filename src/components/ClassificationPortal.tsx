import React, { useState } from 'react';
import { Shield, Sparkles, Building2, User, Users2, AlertTriangle, ArrowRight, Check, HelpCircle, ChevronRight } from 'lucide-react';
import { TaxUserData } from '../types';
import { sounds } from '../utils/audio';

interface ClassificationPortalProps {
  userData: TaxUserData;
  onUpdateUserData: (data: Partial<TaxUserData>) => void;
  onNext: () => void;
  onJumpToResults: () => void;
}

export const ClassificationPortal: React.FC<ClassificationPortalProps> = ({
  userData,
  onUpdateUserData,
  onNext,
  onJumpToResults,
}) => {
  const [selectedType, setSelectedType] = useState<'ordinary' | 'simple' | 'estate' | null>(
    userData.isSimpleRegime ? 'simple' : userData.isLiquidatedEstate ? 'estate' : 'ordinary'
  );
  const [deceasedResident, setDeceasedResident] = useState<boolean>(userData.estateDeceasedResident ?? true);
  const [showRstDetail, setShowRstDetail] = useState(false);

  const handleSelect = (type: 'ordinary' | 'simple' | 'estate') => {
    setSelectedType(type);
    sounds.playClick();

    if (type === 'simple') {
      onUpdateUserData({
        isSimpleRegime: true,
        isLiquidatedEstate: false,
      });
      setShowRstDetail(true);
    } else if (type === 'estate') {
      onUpdateUserData({
        isSimpleRegime: false,
        isLiquidatedEstate: true,
        estateDeceasedResident: deceasedResident,
      });
    } else {
      onUpdateUserData({
        isSimpleRegime: false,
        isLiquidatedEstate: false,
      });
    }
  };

  const handleContinue = () => {
    sounds.playLevelUp();
    if (selectedType === 'simple') {
      // Jumps directly to results with Simple Regime diagnosis
      onJumpToResults();
    } else {
      onNext();
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto py-2 px-3 sm:px-4">
      {/* Header Badge */}
      <div className="text-center mb-4">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-800 text-teal-300 border border-teal-500/30">
          <Shield className="w-3.5 h-3.5 text-teal-400" />
          NIVEL 1: PORTAL DE CLASIFICACIÓN
        </span>
        <h2 className="text-xl sm:text-2xl font-black text-white mt-1.5">
          ¿Bajo qué calidad tributas ante la DIAN?
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Antes de evaluar cifras en dinero, descartamos regímenes especiales que cambian el formulario.
        </p>
      </div>

      {/* Interactive Options Cards */}
      <div className="space-y-3">
        {/* Option 1: Persona Natural Ordinaria */}
        <div
          onClick={() => handleSelect('ordinary')}
          className={`p-3.5 sm:p-4 rounded-2xl border-2 cursor-pointer transition-all duration-200 ${
            selectedType === 'ordinary'
              ? 'bg-teal-950/40 border-teal-500 shadow-lg shadow-teal-950/50 scale-[1.01]'
              : 'bg-slate-900/80 border-slate-800 hover:border-slate-700 hover:bg-slate-800/60'
          }`}
        >
          <div className="flex items-start gap-3">
            <div className={`p-2.5 rounded-xl ${selectedType === 'ordinary' ? 'bg-teal-500 text-slate-950 font-bold' : 'bg-slate-800 text-teal-400'}`}>
              <User className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h3 className="text-sm sm:text-base font-bold text-white">
                  Persona Natural Ordinaria
                </h3>
                {selectedType === 'ordinary' && (
                  <span className="w-5 h-5 rounded-full bg-teal-500 flex items-center justify-center text-slate-950">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                Empleado asalariado, independiente por cuenta propia, comerciante, pensionado, inversionista o rentista de capital.
              </p>
              <span className="inline-block mt-2 text-[10px] font-semibold text-teal-400 bg-teal-950/60 px-2 py-0.5 rounded border border-teal-800/40">
                Formulario 210 / 110 Ordinario
              </span>
            </div>
          </div>
        </div>

        {/* Option 2: Régimen Simple de Tributación (RST) */}
        <div
          onClick={() => handleSelect('simple')}
          className={`p-3.5 sm:p-4 rounded-2xl border-2 cursor-pointer transition-all duration-200 ${
            selectedType === 'simple'
              ? 'bg-indigo-950/50 border-indigo-500 shadow-lg shadow-indigo-950/50 scale-[1.01]'
              : 'bg-slate-900/80 border-slate-800 hover:border-slate-700 hover:bg-slate-800/60'
          }`}
        >
          <div className="flex items-start gap-3">
            <div className={`p-2.5 rounded-xl ${selectedType === 'simple' ? 'bg-indigo-500 text-white font-bold' : 'bg-slate-800 text-indigo-400'}`}>
              <Sparkles className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <h3 className="text-sm sm:text-base font-bold text-white">
                    Régimen Simple de Tributación (RST)
                  </h3>
                  <span className="text-[10px] font-extrabold bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 px-1.5 py-0.2 rounded">
                    RUT Resp. 47
                  </span>
                </div>
                {selectedType === 'simple' && (
                  <span className="w-5 h-5 rounded-full bg-indigo-500 flex items-center justify-center text-white">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                Inscrito formalmente en el RST ante la DIAN con pagos de anticipos bimestrales en el Formulario 2593.
              </p>
              <span className="inline-block mt-2 text-[10px] font-semibold text-indigo-300 bg-indigo-950/80 px-2 py-0.5 rounded border border-indigo-800/60">
                Declara en Formulario 260 (Exento de Renta Ordinaria)
              </span>
            </div>
          </div>
        </div>

        {/* Option 3: Sucesión Ilíquida */}
        <div
          onClick={() => handleSelect('estate')}
          className={`p-3.5 sm:p-4 rounded-2xl border-2 cursor-pointer transition-all duration-200 ${
            selectedType === 'estate'
              ? 'bg-amber-950/40 border-amber-500 shadow-lg shadow-amber-950/50 scale-[1.01]'
              : 'bg-slate-900/80 border-slate-800 hover:border-slate-700 hover:bg-slate-800/60'
          }`}
        >
          <div className="flex items-start gap-3">
            <div className={`p-2.5 rounded-xl ${selectedType === 'estate' ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-slate-800 text-amber-400'}`}>
              <Users2 className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <h3 className="text-sm sm:text-base font-bold text-white">
                    Sucesión Ilíquida
                  </h3>
                  <span className="text-[10px] font-extrabold bg-amber-500/20 text-amber-300 border border-amber-500/40 px-1.5 py-0.2 rounded">
                    RUT Resp. 22
                  </span>
                </div>
                {selectedType === 'estate' && (
                  <span className="w-5 h-5 rounded-full bg-amber-500 flex items-center justify-center text-slate-950">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                Bienes y deudas de una persona fallecida que aún no han sido repartidos ni adjudicados judicial o notarialmente.
              </p>

              {selectedType === 'estate' && (
                <div className="mt-3 p-2.5 bg-slate-900/90 rounded-xl border border-amber-500/40">
                  <p className="text-[11px] font-semibold text-amber-300 mb-2">
                    ¿El causante (la persona fallecida) era residente fiscal en Colombia al momento del deceso?
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeceasedResident(true);
                        onUpdateUserData({ estateDeceasedResident: true });
                        sounds.playClick();
                      }}
                      className={`py-1.5 px-2 rounded-lg text-xs font-bold transition-colors ${
                        deceasedResident
                          ? 'bg-amber-500 text-slate-950'
                          : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      Sí, era Residente
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeceasedResident(false);
                        onUpdateUserData({ estateDeceasedResident: false });
                        sounds.playClick();
                      }}
                      className={`py-1.5 px-2 rounded-lg text-xs font-bold transition-colors ${
                        !deceasedResident
                          ? 'bg-amber-500 text-slate-950'
                          : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      No Residente
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Info Callout for Simple Regime */}
      {selectedType === 'simple' && (
        <div className="mt-4 p-3.5 bg-indigo-950/80 border border-indigo-500/50 rounded-xl text-indigo-200 text-xs leading-relaxed animate-fadeIn">
          <div className="flex items-center gap-2 font-bold text-indigo-300 mb-1">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            ¡Ruta Exclusiva Régimen Simple activada!
          </div>
          Al pertenecer al Régimen Simple, no te aplican los topes de la cédula ordinaria ni el Formulario 210. Declaras anualmente en el <strong>Formulario 260</strong>. Al continuar, te mostraremos tu informe y recomendaciones especiales.
        </div>
      )}

      {/* Action Button */}
      <div className="mt-5">
        <button
          onClick={handleContinue}
          className="w-full py-3.5 px-4 bg-gradient-to-r from-teal-600 to-emerald-500 hover:from-teal-500 hover:to-emerald-400 text-white font-black text-sm sm:text-base rounded-xl shadow-lg shadow-teal-950/60 flex items-center justify-center gap-2 transition-all active:scale-[0.98] cursor-pointer"
        >
          <span>
            {selectedType === 'simple' ? 'VER RECOMENDACIONES RST' : 'CONTINUAR AL TEST DE RESIDENCIA'}
          </span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
