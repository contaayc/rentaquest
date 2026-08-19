import React, { useState } from 'react';
import { ShieldCheck, Play, Sparkles, Clock, Calendar, FileText, CheckCircle2, ChevronRight, HelpCircle, PhoneCall, Mail, Hash, Check, Briefcase, User, UserCheck } from 'lucide-react';
import confetti from 'canvas-confetti';
import { TaxUserData } from '../types';
import { TAX_CONSTANTS } from '../data/constants';
import { extractLastTwoDigits, getDueDateByCedula } from '../data/calendarData';
import { sounds } from '../utils/audio';

interface WelcomeScreenProps {
  userData: TaxUserData;
  onUpdateUserData: (data: Partial<TaxUserData>) => void;
  onStartGame: () => void;
}

const PROFILE_CATEGORIES = [
  {
    id: 'asalariado',
    title: 'Empleado / Asalariado',
    icon: '👔',
    subtitle: 'Nómina, cesantías y salarios',
  },
  {
    id: 'independiente',
    title: 'Profesional Independiente',
    icon: '💼',
    subtitle: 'Honorarios, servicios y contratos',
  },
  {
    id: 'comerciante',
    title: 'Comerciante / Negocio',
    icon: '🏪',
    subtitle: 'Venta de bienes y productos',
  },
  {
    id: 'inversionista',
    title: 'Inversionista / Rentista',
    icon: '📈',
    subtitle: 'Arriendos, rendimientos y dividendos',
  },
  {
    id: 'pensionado',
    title: 'Pensionado / Jubilado',
    icon: '🌴',
    subtitle: 'Mesadas pensionales y ahorros',
  },
  {
    id: 'otro',
    title: 'Otro / Mixto',
    icon: '👤',
    subtitle: 'Múltiples fuentes de ingresos',
  },
];

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  userData,
  onUpdateUserData,
  onStartGame,
}) => {
  const [name, setName] = useState(userData.playerName || '');
  const [selectedCategory, setSelectedCategory] = useState(userData.playerProfileCategory || 'Empleado / Asalariado');
  const [cedula, setCedula] = useState(userData.cedula || '');
  const [showInfoModal, setShowInfoModal] = useState(false);

  // Real-time calculation of last 2 digits and due date
  const extractedDigits = extractLastTwoDigits(cedula);
  const calculatedDueDate = cedula.trim() ? getDueDateByCedula(cedula) : null;
  const hasHyphenDv = cedula.includes('-');

  const handleNameChange = (val: string) => {
    setName(val);
    onUpdateUserData({ playerName: val });
  };

  const handleCategorySelect = (categoryTitle: string) => {
    setSelectedCategory(categoryTitle);
    onUpdateUserData({ playerProfileCategory: categoryTitle });
    sounds.playClick();
  };

  const handleCedulaChange = (val: string) => {
    setCedula(val);
    onUpdateUserData({ cedula: val });
  };

  const handleStart = (e: React.FormEvent) => {
    e.preventDefault();
    sounds.playLevelUp();

    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#0f766e', '#14b8a6', '#f59e0b', '#38bdf8'],
      });
    } catch {
      // Confetti fallback
    }

    onUpdateUserData({
      playerName: name.trim() || 'Héroe Tributario',
      playerProfileCategory: selectedCategory,
      cedula: cedula.trim(),
    });

    onStartGame();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] py-4 px-3 sm:px-6">
      <div className="w-full max-w-xl bg-slate-900/90 border border-slate-700/80 rounded-2xl sm:rounded-3xl p-4 sm:p-7 shadow-2xl backdrop-blur-xl relative overflow-hidden">
        {/* Decorative background glow */}
        <div className="absolute -top-24 -right-24 w-60 h-60 bg-teal-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-60 h-60 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Top Badges */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-teal-950/80 text-teal-300 border border-teal-600/40">
            <Sparkles className="w-3.5 h-3.5 text-teal-400" />
            DIAN Colombia • Año Gravable 2025
          </span>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700">
            <Clock className="w-3 h-3 text-amber-400" />
            ~3 Minutos
          </span>
        </div>

        {/* Title */}
        <div className="text-center my-3">
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white leading-tight">
            RENTA QUEST <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 via-emerald-300 to-amber-400">2026</span>
          </h1>
          <p className="mt-1.5 text-xs sm:text-sm text-slate-300 font-normal leading-relaxed">
            Descubre de forma rápida, interactiva y gamificada si estás <strong className="text-teal-300">obligado a declarar renta</strong>, tu fecha oficial de vencimiento y descarga tu reporte tributario en PDF.
          </p>
        </div>

        {/* Key Rules Highlight Banner */}
        <div className="my-4 p-3 bg-gradient-to-r from-slate-800/90 to-slate-800/60 border border-slate-700/80 rounded-xl">
          <div className="grid grid-cols-2 gap-2 text-[11px] sm:text-xs">
            <div className="p-2 bg-slate-900/60 rounded-lg border border-slate-800">
              <span className="text-slate-400 block font-medium">UVT 2025 (Topes):</span>
              <strong className="text-teal-300 font-bold text-xs sm:text-sm">$49.799 COP</strong>
            </div>
            <div className="p-2 bg-slate-900/60 rounded-lg border border-slate-800">
              <span className="text-slate-400 block font-medium">Sanción Mínima 2026:</span>
              <strong className="text-amber-400 font-bold text-xs sm:text-sm">$523.740 COP</strong>
            </div>
          </div>
        </div>

        {/* Form to enter user details */}
        <form onSubmit={handleStart} className="space-y-4">
          {/* FIELD 1: Player Name (Independent) */}
          <div>
            <label className="block text-xs font-semibold text-slate-200 mb-1 flex items-center justify-between">
              <span>Nombre o Apodo del Jugador <span className="text-slate-400 font-normal">(Opcional)</span></span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="Ej. Carlos Mendoza o María Gómez"
                className="w-full px-3.5 py-2.5 bg-slate-800/90 border border-slate-700 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          {/* FIELD 2: Profile Category / Segmentation (Independent) */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5 text-amber-400" />
                <span>Perfil / Categoría del Contribuyente</span>
              </label>
              <span className="text-[10px] text-teal-400 font-semibold">
                (Segmentación)
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mb-2 leading-tight">
              Selecciona tu actividad principal para personalizar el análisis tributario:
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 text-[11px]">
              {PROFILE_CATEGORIES.map((cat) => {
                const isSelected = selectedCategory === cat.title;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => handleCategorySelect(cat.title)}
                    className={`p-2 rounded-xl text-left transition-all cursor-pointer border flex flex-col justify-between ${
                      isSelected
                        ? 'bg-teal-950/70 border-teal-500 text-teal-200 shadow-md shadow-teal-950/40 ring-1 ring-teal-500/40'
                        : 'bg-slate-800/80 hover:bg-slate-700/80 border-slate-700/80 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full mb-1">
                      <span className="text-base">{cat.icon}</span>
                      {isSelected && (
                        <span className="w-4 h-4 rounded-full bg-teal-500 text-slate-950 flex items-center justify-center">
                          <Check className="w-2.5 h-2.5 stroke-[3]" />
                        </span>
                      )}
                    </div>
                    <div>
                      <span className={`font-bold block leading-tight ${isSelected ? 'text-teal-300' : 'text-white'}`}>
                        {cat.title}
                      </span>
                      <span className="text-[9px] text-slate-400 block mt-0.5 leading-tight">
                        {cat.subtitle}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* FIELD 3: Cédula / NIT (Independent) */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-slate-200">
                Número de Cédula o NIT <span className="text-teal-400 font-normal">(Para tu calendario exacto)</span>
              </label>
              <button
                type="button"
                onClick={() => {
                  setShowInfoModal(true);
                  sounds.playClick();
                }}
                className="text-[11px] text-teal-400 hover:text-teal-300 flex items-center gap-0.5 cursor-pointer"
              >
                <HelpCircle className="w-3 h-3" /> ¿Por qué la pedimos?
              </button>
            </div>
            <input
              type="text"
              value={cedula}
              onChange={(e) => handleCedulaChange(e.target.value)}
              placeholder="Ej. 1.020.304.050, 900123456-1 o últimos 2 dígitos (ej. 52)"
              className="w-full px-3.5 py-2.5 bg-slate-800/90 border border-slate-700 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
            />
            
            {/* Real-time calculated digits feedback */}
            {cedula.trim() ? (
              <div className="mt-2 p-2.5 bg-gradient-to-r from-teal-950/80 to-slate-800 border border-teal-500/40 rounded-xl animate-fadeIn text-xs">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-slate-300 font-medium flex items-center gap-1">
                    <Hash className="w-3.5 h-3.5 text-teal-400" />
                    Últimos 2 dígitos calculados:
                  </span>
                  <span className="px-2 py-0.5 bg-teal-500 text-slate-950 font-black rounded text-xs tracking-wider">
                    {extractedDigits || '00'}
                  </span>
                </div>
                {calculatedDueDate && (
                  <div className="mt-1.5 pt-1.5 border-t border-slate-700/60 flex items-center justify-between text-[11px]">
                    <span className="text-amber-300 font-medium flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-amber-400" />
                      Fecha de Vencimiento DIAN:
                    </span>
                    <strong className="text-white font-bold">
                      {calculatedDueDate.dueDate}
                    </strong>
                  </div>
                )}
                {hasHyphenDv && (
                  <p className="mt-1 text-[10px] text-teal-300/80">
                    ✓ Dígito de verificación detectado: se calcula sobre los 2 últimos dígitos del NIT principal.
                  </p>
                )}
              </div>
            ) : (
              <p className="mt-1 text-[10px] text-slate-400">
                Tus datos se procesan 100% en tu propio navegador (privacidad total).
              </p>
            )}
          </div>

          {/* Feature Checklist */}
          <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80 space-y-1.5 text-[11px] text-slate-300">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-teal-400 flex-shrink-0" />
              <span>Diagnóstico de Régimen Simple & Sucesiones Ilíquidas</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-teal-400 flex-shrink-0" />
              <span>Algoritmo de Residencia Fiscal (Art. 10 Estatuto Tributario)</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-teal-400 flex-shrink-0" />
              <span>Calculadora de topes monetarios con sliders en tiempo real</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-teal-400 flex-shrink-0" />
              <span>Descarga en PDF de tu inventario tributario y soporte profesional</span>
            </div>
          </div>

          {/* Start CTA Button */}
          <button
            type="submit"
            className="w-full py-3.5 px-4 bg-gradient-to-r from-teal-600 via-teal-500 to-emerald-500 hover:from-teal-500 hover:to-emerald-400 text-white font-extrabold text-sm sm:text-base rounded-xl shadow-lg shadow-teal-900/40 flex items-center justify-center gap-2 transform active:scale-[0.98] transition-all cursor-pointer"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>INICIAR AVENTURA TRIBUTARIA</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </form>

        {/* Footer info note */}
        <div className="mt-4 pt-3 border-t border-slate-800 text-center">
          <p className="text-[10px] sm:text-[11px] text-slate-400 flex items-center justify-center gap-1">
            <span>Desarrollado con base en la normativa oficial de la DIAN por</span>
            <strong className="text-amber-400 font-semibold">{TAX_CONSTANTS.COMPANY_NAME}</strong>
          </p>
        </div>
      </div>

      {/* Info Modal */}
      {showInfoModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-sm w-full p-5 text-white shadow-2xl">
            <h3 className="font-bold text-base text-teal-300 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-amber-400" />
              ¿Para qué sirve tu cédula?
            </h3>
            <p className="mt-2 text-xs text-slate-300 leading-relaxed">
              En Colombia, el calendario tributario de la DIAN asigna la fecha límite de presentación y pago según los <strong>dos últimos dígitos del NIT o Cédula</strong> (del 12 de agosto al 26 de octubre de 2026).
            </p>
            <p className="mt-2 text-xs text-slate-400">
              No guardamos ni enviamos tu cédula a ningún servidor externo. Solo se usa para calcular tu día de vencimiento.
            </p>
            <button
              onClick={() => {
                setShowInfoModal(false);
                sounds.playClick();
              }}
              className="mt-4 w-full py-2 bg-slate-800 hover:bg-slate-700 text-teal-300 font-semibold text-xs rounded-xl border border-slate-600 transition-colors"
            >
              Entendido
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
