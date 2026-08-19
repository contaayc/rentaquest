import React, { useState } from 'react';
import { Globe, Plane, Home, Users, Landmark, AlertCircle, HelpCircle, Check, X, ShieldAlert, ChevronRight, ArrowLeft } from 'lucide-react';
import { TaxUserData } from '../types';
import { sounds } from '../utils/audio';

interface ResidencyTestProps {
  userData: TaxUserData;
  onUpdateUserData: (data: Partial<TaxUserData>) => void;
  onNext: () => void;
  onPrev: () => void;
}

export const ResidencyTest: React.FC<ResidencyTestProps> = ({
  userData,
  onUpdateUserData,
  onNext,
  onPrev,
}) => {
  const [stayed183, setStayed183] = useState<boolean | null>(userData.stayedMoreThan183Days);
  const [isColombian, setIsColombian] = useState<boolean | null>(userData.hasColombianNationality);
  const [familyTies, setFamilyTies] = useState<boolean>(userData.hasFamilyInColombia);
  const [incomeTies, setIncomeTies] = useState<boolean>(userData.has50PercentIncomeInColombia);
  const [assetsTies, setAssetsTies] = useState<boolean>(userData.has50PercentAssetsInColombia);
  const [taxHaven, setTaxHaven] = useState<boolean>(userData.isInTaxHaven);
  const [foreignException, setForeignException] = useState<boolean>(userData.qualifiesForForeignDomicileException);

  const [show183Help, setShow183Help] = useState(false);
  const [showExceptionHelp, setShowExceptionHelp] = useState(false);

  // Compute residency based on Art. 10 E.T.
  const computeIsResident = (): boolean => {
    if (stayed183 === true) return true;
    if (stayed183 === false) {
      if (isColombian === false) return false;
      if (isColombian === true) {
        const hasTies = familyTies || incomeTies || assetsTies || taxHaven;
        if (!hasTies) return false;
        // Check Parágrafo 2 exception
        if (foreignException) return false;
        return true;
      }
    }
    return true;
  };

  const isResident = computeIsResident();

  const handleContinue = () => {
    sounds.playLevelUp();
    onUpdateUserData({
      stayedMoreThan183Days: stayed183 ?? true,
      hasColombianNationality: isColombian ?? true,
      hasFamilyInColombia: familyTies,
      has50PercentIncomeInColombia: incomeTies,
      has50PercentAssetsInColombia: assetsTies,
      isInTaxHaven: taxHaven,
      qualifiesForForeignDomicileException: foreignException,
      isTaxResident: isResident,
      taxHealth: isResident ? userData.taxHealth : Math.max(70, userData.taxHealth),
    });
    onNext();
  };

  return (
    <div className="w-full max-w-xl mx-auto py-2 px-3 sm:px-4">
      {/* Stage Badge */}
      <div className="text-center mb-4">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-800 text-teal-300 border border-teal-500/30">
          <Globe className="w-3.5 h-3.5 text-teal-400" />
          NIVEL 2: TEST DE RESIDENCIA FISCAL (ART. 10 E.T.)
        </span>
        <h2 className="text-xl sm:text-2xl font-black text-white mt-1.5">
          ¿Eres Residente Fiscal en Colombia?
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          La residencia fiscal determina si declaras sobre tus ingresos mundiales (Formulario 210) o solo colombianos (Formulario 110).
        </p>
      </div>

      <div className="space-y-4">
        {/* Step 1: Presencia Física */}
        <div className="bg-slate-900/90 border border-slate-700/80 rounded-2xl p-4 shadow-xl">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-teal-500/20 border border-teal-500/40 text-teal-300 text-xs font-black flex items-center justify-center">
                1
              </span>
              <h3 className="text-sm sm:text-base font-bold text-white">
                Presencia Física en Colombia (&gt;183 días)
              </h3>
            </div>
            <button
              type="button"
              onClick={() => {
                setShow183Help(!show183Help);
                sounds.playClick();
              }}
              className="text-xs text-teal-400 hover:text-teal-300 flex items-center gap-1 bg-slate-800 px-2 py-1 rounded-lg border border-slate-700"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>¿Cómo se cuenta?</span>
            </button>
          </div>

          <p className="text-xs text-slate-300 mt-2 leading-relaxed">
            ¿Permaneciste física y continuamente (o de forma discontinua) en Colombia por <strong>más de 183 días calendario</strong> dentro de cualquier periodo de 365 días consecutivos durante 2025?
          </p>

          {show183Help && (
            <div className="mt-2.5 p-3 bg-slate-800/90 border border-teal-500/30 rounded-xl text-xs text-slate-300 space-y-1.5 animate-fadeIn">
              <p className="font-semibold text-teal-300">📌 Regla de los 183 días:</p>
              <p>• Se cuentan tanto los días continuos como discontinuos (entradas y salidas del país registradas en Migración Colombia).</p>
              <p>• Los días de entrada y de salida se computan como días completos en Colombia.</p>
              <p>• Si estuviste 184 días o más, automáticamente eres <strong>Residente Fiscal</strong>.</p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-2.5 mt-3">
            <button
              type="button"
              onClick={() => {
                setStayed183(true);
                sounds.playClick();
              }}
              className={`py-2.5 px-3 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all ${
                stayed183 === true
                  ? 'bg-teal-600 text-white shadow-lg shadow-teal-900/50'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <Check className="w-4 h-4" />
              <span>SÍ (Más de 183 días)</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setStayed183(false);
                sounds.playClick();
              }}
              className={`py-2.5 px-3 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all ${
                stayed183 === false
                  ? 'bg-amber-600 text-white shadow-lg shadow-amber-900/50'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <X className="w-4 h-4" />
              <span>NO (183 días o menos)</span>
            </button>
          </div>
        </div>

        {/* Step 2: Evaluación de Nacionalidad y Vínculos (si respondió NO al paso 1) */}
        {stayed183 === false && (
          <div className="bg-slate-900/90 border border-slate-700/80 rounded-2xl p-4 shadow-xl animate-fadeIn space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-black flex items-center justify-center">
                2
              </span>
              <h3 className="text-sm sm:text-base font-bold text-white">
                Nacionalidad y Vínculos con Colombia
              </h3>
            </div>

            {/* Nationality Check */}
            <div>
              <p className="text-xs text-slate-300 mb-2">¿Tienes nacionalidad colombiana?</p>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsColombian(true);
                    sounds.playClick();
                  }}
                  className={`py-2 px-3 rounded-xl font-bold text-xs transition-all ${
                    isColombian === true
                      ? 'bg-teal-600 text-white'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  Sí, soy colombiano
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsColombian(false);
                    sounds.playClick();
                  }}
                  className={`py-2 px-3 rounded-xl font-bold text-xs transition-all ${
                    isColombian === false
                      ? 'bg-slate-700 text-amber-300'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  No, soy extranjero
                </button>
              </div>
            </div>

            {/* Sub-conditions if Colombian */}
            {isColombian === true && (
              <div className="pt-2 border-t border-slate-800 space-y-2">
                <p className="text-xs font-bold text-slate-200">
                  Marca si cumples alguna de estas condiciones en 2025:
                </p>

                <label className="flex items-start gap-2.5 p-2.5 bg-slate-800/60 rounded-xl cursor-pointer hover:bg-slate-800">
                  <input
                    type="checkbox"
                    checked={familyTies}
                    onChange={(e) => {
                      setFamilyTies(e.target.checked);
                      sounds.playClick();
                    }}
                    className="mt-0.5 w-4 h-4 rounded text-teal-600 focus:ring-teal-500 bg-slate-700 border-slate-600"
                  />
                  <div className="text-xs">
                    <span className="font-semibold text-white block">Vínculo Familiar en Colombia:</span>
                    <span className="text-slate-400">Tu cónyuge o compañero permanente, o tus hijos menores dependientes, tienen residencia fiscal en Colombia.</span>
                  </div>
                </label>

                <label className="flex items-start gap-2.5 p-2.5 bg-slate-800/60 rounded-xl cursor-pointer hover:bg-slate-800">
                  <input
                    type="checkbox"
                    checked={incomeTies}
                    onChange={(e) => {
                      setIncomeTies(e.target.checked);
                      sounds.playClick();
                    }}
                    className="mt-0.5 w-4 h-4 rounded text-teal-600 focus:ring-teal-500 bg-slate-700 border-slate-600"
                  />
                  <div className="text-xs">
                    <span className="font-semibold text-white block">50% o más de Ingresos Nacionales:</span>
                    <span className="text-slate-400">La mitad o más de tus ingresos totales del año provienen de fuente colombiana.</span>
                  </div>
                </label>

                <label className="flex items-start gap-2.5 p-2.5 bg-slate-800/60 rounded-xl cursor-pointer hover:bg-slate-800">
                  <input
                    type="checkbox"
                    checked={assetsTies}
                    onChange={(e) => {
                      setAssetsTies(e.target.checked);
                      sounds.playClick();
                    }}
                    className="mt-0.5 w-4 h-4 rounded text-teal-600 focus:ring-teal-500 bg-slate-700 border-slate-600"
                  />
                  <div className="text-xs">
                    <span className="font-semibold text-white block">50% o más de Patrimonio en Colombia:</span>
                    <span className="text-slate-400">La mitad o más de tus bienes son administrados o poseídos en el territorio nacional.</span>
                  </div>
                </label>

                <label className="flex items-start gap-2.5 p-2.5 bg-slate-800/60 rounded-xl cursor-pointer hover:bg-slate-800">
                  <input
                    type="checkbox"
                    checked={taxHaven}
                    onChange={(e) => {
                      setTaxHaven(e.target.checked);
                      sounds.playClick();
                    }}
                    className="mt-0.5 w-4 h-4 rounded text-teal-600 focus:ring-teal-500 bg-slate-700 border-slate-600"
                  />
                  <div className="text-xs">
                    <span className="font-semibold text-white block">Jurisdicción No Cooperante / Paraíso Fiscal:</span>
                    <span className="text-slate-400">Tienes residencia fiscal en una jurisdicción calificada como paraíso fiscal.</span>
                  </div>
                </label>

                {/* Excepción Legal (Parágrafo 2 Art. 10 E.T.) */}
                {(familyTies || incomeTies || assetsTies || taxHaven) && (
                  <div className="mt-3 p-3 bg-amber-950/40 border border-amber-500/40 rounded-xl space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                        <ShieldAlert className="w-4 h-4" />
                        Excepción Legal (Parágrafo 2 Art. 10 E.T.)
                      </span>
                      <button
                        type="button"
                        onClick={() => setShowExceptionHelp(!showExceptionHelp)}
                        className="text-[11px] text-amber-400 underline"
                      >
                        Ver detalle
                      </button>
                    </div>

                    {showExceptionHelp && (
                      <p className="text-[11px] text-amber-200/90 leading-relaxed">
                        Aunque cumplas vínculos en Colombia, la ley indica que serás <strong>NO RESIDENTE</strong> si el 50% o más de tus ingresos provienen de la jurisdicción extranjera de tu domicilio o el 50% de tus activos están en dicho país extranjero y pagan impuestos allí.
                      </p>
                    )}

                    <label className="flex items-start gap-2 bg-slate-900/80 p-2.5 rounded-lg cursor-pointer">
                      <input
                        type="checkbox"
                        checked={foreignException}
                        onChange={(e) => {
                          setForeignException(e.target.checked);
                          sounds.playClick();
                        }}
                        className="mt-0.5 w-4 h-4 rounded text-amber-500 focus:ring-amber-400 bg-slate-800 border-slate-700"
                      />
                      <span className="text-xs text-slate-200">
                        Acredito que el 50% o más de mis ingresos o activos están en mi país de residencia en el exterior y tributo allí.
                      </span>
                    </label>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Live Diagnosis Banner */}
        {stayed183 !== null && (
          <div className={`p-4 rounded-2xl border-2 transition-all ${
            isResident 
              ? 'bg-teal-950/60 border-teal-500 text-teal-100'
              : 'bg-indigo-950/60 border-indigo-500 text-indigo-100'
          }`}>
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold uppercase tracking-wider text-slate-300">
                Resultado de Residencia Fiscal:
              </span>
              <span className={`text-xs font-black px-2.5 py-0.5 rounded-full ${
                isResident ? 'bg-teal-500 text-slate-950' : 'bg-indigo-500 text-white'
              }`}>
                {isResident ? 'RESIDENTE FISCAL' : 'NO RESIDENTE'}
              </span>
            </div>

            <div className="mt-2 text-xs leading-relaxed">
              {isResident ? (
                <p>
                  📌 Declaras en el <strong>Formulario 210</strong> sobre todos tus bienes e ingresos mundiales (en Colombia y en el extranjero). Pasas a evaluar los topes monetarios.
                </p>
              ) : (
                <p>
                  📌 Declaras en el <strong>Formulario 110</strong> únicamente si tuviste ingresos en Colombia a los que <strong>no</strong> se les practicó la retención en la fuente especial (Art. 407-411 E.T.). Si todos tuvieron retención o no tuviste ingresos en el país, no estás obligado a declarar sin importar tu patrimonio.
                </p>
              )}
            </div>
          </div>
        )}
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
          disabled={stayed183 === null}
          onClick={handleContinue}
          className="flex-1 py-3.5 px-4 bg-gradient-to-r from-teal-600 to-emerald-500 hover:from-teal-500 hover:to-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed text-white font-black text-sm sm:text-base rounded-xl shadow-lg shadow-teal-950/60 flex items-center justify-center gap-2 transition-all active:scale-[0.98] cursor-pointer"
        >
          <span>CONTINUAR AL ESCUDO DE TOPES</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
