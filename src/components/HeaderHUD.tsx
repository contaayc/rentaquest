import React, { useState } from 'react';
import { Shield, Heart, Volume2, VolumeX, RotateCcw, Sparkles, AlertCircle, X } from 'lucide-react';
import { GameStage, TaxUserData } from '../types';
import { sounds } from '../utils/audio';

interface HeaderHUDProps {
  stage: GameStage;
  userData: TaxUserData;
  isMuted: boolean;
  onToggleMute: () => void;
  onReset: () => void;
  onNavigateStage?: (stage: GameStage) => void;
}

export const HeaderHUD: React.FC<HeaderHUDProps> = ({
  stage,
  userData,
  isMuted,
  onToggleMute,
  onReset,
}) => {
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const getStageIndex = (s: GameStage) => {
    switch (s) {
      case 'welcome': return 0;
      case 'classification': return 1;
      case 'residency': return 2;
      case 'thresholds': return 3;
      case 'improvements': return 4;
      case 'results': return 5;
    }
  };

  const currentStep = getStageIndex(stage);
  const totalSteps = 5;
  const progressPercent = (currentStep / totalSteps) * 100;

  // Tax health color
  const getHealthBarColor = (health: number) => {
    if (health >= 80) return 'from-teal-500 to-emerald-400';
    if (health >= 50) return 'from-amber-500 to-yellow-400';
    return 'from-rose-600 to-red-500';
  };

  const getStageTitle = (s: GameStage) => {
    switch (s) {
      case 'welcome': return 'Lobby de Inicio';
      case 'classification': return 'Nivel 1: Clasificación';
      case 'residency': return 'Nivel 2: Residencia Fiscal';
      case 'thresholds': return 'Nivel 3: Escudo de Topes';
      case 'improvements': return 'Nivel 4: Mejoras & Beneficios';
      case 'results': return 'Nivel 5: El Oráculo';
    }
  };

  const confirmResetAction = () => {
    sounds.playClick();
    setShowResetConfirm(false);
    onReset();
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-700/80 text-white shadow-lg">
        <div className="max-w-4xl mx-auto px-3 sm:px-4 py-2.5">
          <div className="flex items-center justify-between gap-2">
            {/* Logo & Stage info */}
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => {
                  if (stage !== 'welcome') {
                    setShowResetConfirm(true);
                  }
                }}
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-teal-600 to-emerald-400 p-0.5 shadow-md flex items-center justify-center flex-shrink-0 cursor-pointer text-left"
                title="Ir al inicio"
              >
                <div className="w-full h-full bg-slate-900 rounded-[10px] flex items-center justify-center hover:bg-slate-800 transition-colors">
                  <Shield className="w-5 h-5 text-teal-400" />
                </div>
              </button>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-sm sm:text-base tracking-wide bg-gradient-to-r from-teal-300 via-emerald-200 to-amber-300 bg-clip-text text-transparent">
                    RENTA QUEST
                  </span>
                  <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold px-1.5 py-0.2 rounded">
                    2026
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
                  <span>{getStageTitle(stage)}</span>
                  {userData.playerName && (
                    <span className="text-teal-300 font-semibold truncate max-w-[90px] sm:max-w-[140px]">
                      • {userData.playerName}
                    </span>
                  )}
                </p>
              </div>
            </div>

            {/* Right Action Bar: Tax Health + Controls */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Tax Health Bar (Gamification) */}
              {stage !== 'welcome' && (
                <div className="flex flex-col items-end">
                  <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-300">
                    <Heart className={`w-3.5 h-3.5 ${userData.taxHealth < 50 ? 'text-rose-500 animate-pulse' : 'text-rose-400'}`} fill="currentColor" />
                    <span className="text-[11px]">{userData.taxHealth}%</span>
                  </div>
                  <div className="w-16 sm:w-24 h-2 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
                    <div 
                      className={`h-full bg-gradient-to-r ${getHealthBarColor(userData.taxHealth)} transition-all duration-500 ease-out`}
                      style={{ width: `${Math.max(5, userData.taxHealth)}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Audio Toggle */}
              <button
                type="button"
                onClick={() => {
                  onToggleMute();
                  sounds.playClick();
                }}
                title={isMuted ? 'Activar sonido' : 'Silenciar'}
                className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
              >
                {isMuted ? <VolumeX className="w-4 h-4 text-slate-400" /> : <Volume2 className="w-4 h-4 text-teal-400" />}
              </button>

              {/* Restart Button */}
              {stage !== 'welcome' && (
                <button
                  type="button"
                  onClick={() => {
                    sounds.playClick();
                    setShowResetConfirm(true);
                  }}
                  title="Reiniciar aventura"
                  className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-slate-400 hover:text-rose-400 transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span className="hidden sm:inline text-xs font-semibold">Reiniciar</span>
                </button>
              )}
            </div>
          </div>

          {/* Global Progress Bar */}
          {stage !== 'welcome' && (
            <div className="mt-2 w-full h-1 bg-slate-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-teal-500 via-emerald-400 to-amber-400 transition-all duration-300 ease-out"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          )}
        </div>
      </header>

      {/* In-app Reset Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-sm w-full p-5 text-white shadow-2xl animate-fadeIn">
            <div className="flex items-start justify-between gap-2 mb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-amber-500/20 text-amber-400 rounded-xl">
                  <AlertCircle className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-base text-white">
                  ¿Reiniciar Aventura?
                </h3>
              </div>
              <button
                onClick={() => setShowResetConfirm(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              Se restablecerán todos los datos y respuestas ingresadas para comenzar un diagnóstico desde cero.
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setShowResetConfirm(false)}
                className="py-2.5 px-3 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl border border-slate-700 transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={confirmResetAction}
                className="py-2.5 px-3 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-rose-950/50 transition-colors cursor-pointer flex items-center justify-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Sí, reiniciar</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
