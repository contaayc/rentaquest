import React, { useState, useEffect } from 'react';
import { 
  Award, 
  Calendar, 
  Clock, 
  Download, 
  FileText, 
  MessageCircle, 
  Mail, 
  Phone, 
  ShieldCheck, 
  ShieldAlert, 
  AlertTriangle, 
  CheckCircle2, 
  Sparkles, 
  Check, 
  X, 
  ChevronRight, 
  RotateCcw, 
  Share2, 
  Info,
  ExternalLink,
  Flame,
  Coins,
  Search
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { TaxUserData } from '../types';
import { TAX_CONSTANTS, THRESHOLD_LIMITS } from '../data/constants';
import { DIAN_CALENDAR_2026, getDueDateByCedula, extractLastTwoDigits } from '../data/calendarData';
import { HERO_DOCUMENTS } from '../data/inventoryData';
import { generateTaxReportPDF } from '../utils/pdfGenerator';
import { sounds } from '../utils/audio';

interface OracleResultsProps {
  userData: TaxUserData;
  onUpdateUserData: (data: Partial<TaxUserData>) => void;
  onReset: () => void;
}

export const OracleResults: React.FC<OracleResultsProps> = ({
  userData,
  onUpdateUserData,
  onReset,
}) => {
  const [activeTab, setActiveTab] = useState<'verdict' | 'calendar' | 'inventory'>('verdict');
  const [searchCedula, setSearchCedula] = useState<string>(userData.cedula || '');
  const [selectedDocs, setSelectedDocs] = useState<string[]>(userData.collectedDocuments || ['form_220', 'extractos_bancarios', 'rut_actualizado']);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Trigger celebration on load
  useEffect(() => {
    sounds.playSuccess();
    try {
      confetti({
        particleCount: 70,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#0f766e', '#14b8a6', '#f59e0b', '#38bdf8', '#fbbf24'],
      });
    } catch {
      // Confetti fallback
    }
  }, []);

  const formatCOP = (val: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      maximumFractionDigits: 0,
    }).format(val || 0);
  };

  const checkThreshold = (val: number, limit: number) => (val || 0) >= limit;

  const isOverPatrimonio = checkThreshold(userData.patrimonioBruto, 224095500);
  const isOverIngresos = checkThreshold(userData.ingresosBrutos, 69718600);
  const isOverTarjetas = checkThreshold(userData.consumosTarjeta, 69718600);
  const isOverCompras = checkThreshold(userData.comprasTotales, 69718600);
  const isOverConsignaciones = checkThreshold(userData.consignacionesBancarias, 69718600);

  const hasExceededAny = isOverPatrimonio || isOverIngresos || isOverTarjetas || isOverCompras || isOverConsignaciones;

  // Determine overall status
  const isSimple = userData.isSimpleRegime;
  const isNonResident = !userData.isTaxResident && !isSimple;
  const isObligated = isSimple ? false : isNonResident ? false : hasExceededAny;

  const applicableForm = isSimple
    ? 'Formulario 260 (RST)'
    : userData.isTaxResident
      ? 'Formulario 210 (Personas Naturales Residentes)'
      : 'Formulario 110 (No Residentes con ingresos sin retención)';

  // Calendar info
  const currentCalendarEntry = getDueDateByCedula(searchCedula || userData.cedula || '01');

  // Document toggle
  const toggleDoc = (id: string) => {
    sounds.playClick();
    const nextDocs = selectedDocs.includes(id)
      ? selectedDocs.filter(d => d !== id)
      : [...selectedDocs, id];
    
    setSelectedDocs(nextDocs);
    onUpdateUserData({ collectedDocuments: nextDocs });
  };

  const toggleAllDocs = () => {
    sounds.playClick();
    if (selectedDocs.length === HERO_DOCUMENTS.length) {
      setSelectedDocs([]);
      onUpdateUserData({ collectedDocuments: [] });
    } else {
      const allIds = HERO_DOCUMENTS.map(d => d.id);
      setSelectedDocs(allIds);
      onUpdateUserData({ collectedDocuments: allIds });
    }
  };

  // PDF Export
  const handleDownloadPDF = () => {
    sounds.playLevelUp();
    setIsGeneratingPdf(true);
    try {
      generateTaxReportPDF({
        ...userData,
        collectedDocuments: selectedDocs,
      });
    } catch (err) {
      console.error('Error generating PDF:', err);
    } finally {
      setTimeout(() => setIsGeneratingPdf(false), 800);
    }
  };

  // WhatsApp Message Generator
  const getWhatsAppURL = () => {
    const pName = userData.playerName || 'Contribuyente';
    const statusText = isSimple
      ? 'Régimen Simple (Formulario 260)'
      : isObligated
        ? 'OBLIGADO A DECLARAR RENTA'
        : 'NO OBLIGADO POR TOPES';

    const message = `Hola Contabilidad A&C 👋, acabo de realizar el diagnóstico en Renta Quest 2026.
    
*Nombre:* ${pName}
*Perfil/Categoría:* ${userData.playerProfileCategory || 'No especificada'}
*Cédula/NIT:* ${userData.cedula || 'No especificada'}
*Diagnóstico:* ${statusText}
*Fecha Vencimiento:* ${currentCalendarEntry.dueDate}
*Formulario sugerido:* ${applicableForm}
*Salud Tributaria:* ${userData.taxHealth}%

Me gustaría recibir asesoría personalizada para la preparación y presentación de mi declaración de renta ante la DIAN sin errores ni sanciones. ¡Muchas gracias!`;

    return `https://wa.me/${TAX_CONSTANTS.WHATSAPP_NUMBER.replace(/\+/g, '')}?text=${encodeURIComponent(message)}`;
  };

  // Email Generator
  const getEmailURL = () => {
    const pName = userData.playerName || 'Contribuyente';
    const subject = `Diagnóstico Renta Quest 2026 - ${pName}`;
    const body = `Estimado equipo de Contabilidad A&C,

He completado el diagnóstico en el aplicativo Renta Quest 2026 con los siguientes resultados:

- Nombre: ${pName}
- Perfil / Categoría: ${userData.playerProfileCategory || 'No especificada'}
- Cédula / NIT: ${userData.cedula || 'N/A'}
- Estado: ${isObligated ? 'OBLIGADO A DECLARAR' : isSimple ? 'Régimen Simple Formulario 260' : 'NO OBLIGADO POR TOPES'}
- Fecha límite asignada: ${currentCalendarEntry.dueDate}
- Formulario: ${applicableForm}
- Patrimonio informado: ${formatCOP(userData.patrimonioBruto)}
- Ingresos informados: ${formatCOP(userData.ingresosBrutos)}
- Consignaciones informadas: ${formatCOP(userData.consignacionesBancarias)}
- Soportes en inventario: ${selectedDocs.length} documentos

Deseo coordinar una cita de asesoría tributaria para la elaboración de mi declaración de renta del año gravable 2025.

Quedo atento(a) a su respuesta.`;

    return `mailto:${TAX_CONSTANTS.EMAIL_CONTACT}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const handleShare = async () => {
    sounds.playClick();
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Renta Quest 2026 - Diagnóstico Tributario DIAN',
          text: `Hice mi diagnóstico tributario en Renta Quest 2026. Mi fecha de vencimiento es el ${currentCalendarEntry.dueDate}. ¡Descubre si debes declarar renta en 3 minutos!`,
          url: window.location.href,
        });
      } catch {
        // User dismissed
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto py-2 px-3 sm:px-4 pb-12">
      {/* Top Banner with Player Profile */}
      <div className="text-center mb-3">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
          <Award className="w-3.5 h-3.5 text-amber-400" />
          NIVEL 5: EL ORÁCULO TRIBUTARIO
        </span>
        <h2 className="text-xl sm:text-2xl font-black text-white mt-1.5">
          Diagnóstico Final Renta 2026
        </h2>
        <p className="text-xs text-slate-300 mt-0.5">
          Para: <strong className="text-teal-300">{userData.playerName || 'Persona Natural'}</strong>
        </p>
      </div>

      {/* Hero Verdict Card */}
      <div className={`p-4 sm:p-5 rounded-3xl border-2 shadow-2xl relative overflow-hidden text-center mb-4 transition-all ${
        isSimple
          ? 'bg-indigo-950/80 border-indigo-500 shadow-indigo-950/50 text-indigo-100'
          : isObligated
            ? 'bg-gradient-to-b from-rose-950/90 to-slate-900 border-rose-500/90 shadow-rose-950/40 text-rose-100'
            : 'bg-gradient-to-b from-emerald-950/90 to-slate-900 border-emerald-500/90 shadow-emerald-950/40 text-emerald-100'
      }`}>
        <div className="flex items-center justify-center gap-2 mb-2">
          {isSimple ? (
            <div className="p-3 bg-indigo-500/20 rounded-2xl border border-indigo-400/40">
              <Sparkles className="w-8 h-8 text-indigo-400" />
            </div>
          ) : isObligated ? (
            <div className="p-3 bg-rose-500/20 rounded-2xl border border-rose-400/40 animate-pulse">
              <ShieldAlert className="w-8 h-8 text-rose-400" />
            </div>
          ) : (
            <div className="p-3 bg-emerald-500/20 rounded-2xl border border-emerald-400/40">
              <ShieldCheck className="w-8 h-8 text-emerald-400" />
            </div>
          )}
        </div>

        <span className={`text-[11px] font-black uppercase tracking-wider px-3 py-0.5 rounded-full border ${
          isSimple 
            ? 'bg-indigo-500/20 text-indigo-300 border-indigo-400/40' 
            : isObligated 
              ? 'bg-rose-500/20 text-rose-300 border-rose-400/40' 
              : 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40'
        }`}>
          {isSimple ? 'RÉGIMEN SIMPLE' : isObligated ? '¡ESTÁS OBLIGADO!' : '¡NO OBLIGADO POR TOPES!'}
        </span>

        <h3 className="text-xl sm:text-2xl font-black text-white mt-2">
          {isSimple
            ? 'Declaras en el Formulario 260'
            : isObligated
              ? 'Debes presentar Declaración de Renta'
              : 'No estás obligado a declarar renta ordinaria'}
        </h3>

        <p className="text-xs text-slate-300 mt-1.5 max-w-md mx-auto leading-relaxed">
          {isSimple
            ? 'Al pertenecer al Régimen Simple de Tributación (RST), no presentas el Formulario 210 ordinario. Tu obligación se consolida en la declaración anual consolidada Formulario 260.'
            : isObligated
              ? 'Tus movimientos del año gravable 2025 superaron los topes de ley. Debes diligenciar y firmar electrónicamente tu declaración antes de tu fecha límite.'
              : 'Ninguna de tus operaciones en 2025 excedió los 4.500 UVT de patrimonio ni los 1.400 UVT en ingresos, compras o consignaciones.'}
        </p>

        <div className="mt-3 pt-3 border-t border-slate-700/80 flex flex-wrap items-center justify-center gap-2 text-[11px]">
          {userData.playerProfileCategory && (
            <span className="bg-slate-800/90 px-2.5 py-1 rounded-lg text-slate-300 border border-slate-700">
              Perfil: <strong className="text-amber-300">{userData.playerProfileCategory}</strong>
            </span>
          )}
          <span className="bg-slate-800/90 px-2.5 py-1 rounded-lg text-slate-300 border border-slate-700">
            Formulario: <strong className="text-teal-300">{applicableForm}</strong>
          </span>
          <span className="bg-slate-800/90 px-2.5 py-1 rounded-lg text-slate-300 border border-slate-700">
            Residencia: <strong className="text-amber-300">{userData.isTaxResident ? 'Residente' : 'No Residente'}</strong>
          </span>
          <span className="bg-slate-800/90 px-2.5 py-1 rounded-lg text-slate-300 border border-slate-700">
            Salud: <strong className="text-teal-300">{userData.taxHealth}%</strong>
          </span>
        </div>
      </div>

      {/* Navigation Tabs (Mobile Friendly) */}
      <div className="flex items-center bg-slate-900/90 p-1 rounded-2xl border border-slate-800 mb-4">
        <button
          onClick={() => {
            setActiveTab('verdict');
            sounds.playClick();
          }}
          className={`flex-1 py-2 px-2 text-xs font-extrabold rounded-xl transition-all ${
            activeTab === 'verdict'
              ? 'bg-teal-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          📊 Topes & Cifras
        </button>
        <button
          onClick={() => {
            setActiveTab('calendar');
            sounds.playClick();
          }}
          className={`flex-1 py-2 px-2 text-xs font-extrabold rounded-xl transition-all ${
            activeTab === 'calendar'
              ? 'bg-teal-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          🗓️ Calendario NIT
        </button>
        <button
          onClick={() => {
            setActiveTab('inventory');
            sounds.playClick();
          }}
          className={`flex-1 py-2 px-2 text-xs font-extrabold rounded-xl transition-all ${
            activeTab === 'inventory'
              ? 'bg-teal-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          🎒 Inventario ({selectedDocs.length})
        </button>
      </div>

      {/* TAB 1: VERDICT & THRESHOLDS DETAIL */}
      {activeTab === 'verdict' && (
        <div className="space-y-3.5 animate-fadeIn">
          {/* Thresholds Table Card */}
          <div className="bg-slate-900/90 border border-slate-700/80 rounded-2xl p-4 shadow-xl">
            <h4 className="text-xs sm:text-sm font-bold text-white mb-2 flex items-center justify-between">
              <span>Comparativo de Topes vs Tus Cifras (2025)</span>
              <span className="text-[10px] text-teal-400 font-normal">UVT: $49.799</span>
            </h4>

            <div className="space-y-2">
              {THRESHOLD_LIMITS.map((item) => {
                const userVal = Number(userData[item.valueKey]) || 0;
                const isExceeded = userVal >= item.limitCop;

                return (
                  <div
                    key={item.id}
                    className={`p-2.5 rounded-xl border flex items-center justify-between text-xs ${
                      isExceeded
                        ? 'bg-rose-950/40 border-rose-500/50 text-rose-200'
                        : 'bg-slate-800/60 border-slate-700/60 text-slate-300'
                    }`}
                  >
                    <div>
                      <span className="font-bold text-white block">{item.label}</span>
                      <span className="text-[10px] text-slate-400">
                        Tope ley: {formatCOP(item.limitCop)} ({item.uvtCount} UVT)
                      </span>
                    </div>

                    <div className="text-right">
                      <strong className={`block text-xs sm:text-sm font-extrabold ${isExceeded ? 'text-rose-400' : 'text-teal-300'}`}>
                        {formatCOP(userVal)}
                      </strong>
                      <span className={`text-[9px] font-extrabold px-1.5 py-0.2 rounded ${
                        isExceeded ? 'bg-rose-500/20 text-rose-300' : 'bg-teal-500/20 text-teal-300'
                      }`}>
                        {isExceeded ? 'SUPERA TOPE' : 'OK (DENTRO)'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Sanciones Warning Card */}
          <div className="p-3.5 bg-gradient-to-r from-amber-950/80 to-slate-900 border border-amber-500/50 rounded-2xl">
            <div className="flex items-start gap-2.5">
              <div className="p-2 bg-amber-500/20 rounded-xl border border-amber-500/40 text-amber-400">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div className="text-xs">
                <div className="flex items-center gap-1.5">
                  <h4 className="font-bold text-amber-300">
                    Sanción Mínima por Extemporaneidad 2026
                  </h4>
                  <span className="text-[10px] font-extrabold bg-amber-500/20 text-amber-300 px-1.5 py-0.2 rounded">
                    10 UVT 2026
                  </span>
                </div>
                <p className="text-slate-300 mt-1 leading-relaxed">
                  Presentar la declaración un solo día tarde genera una multa mínima de <strong className="text-amber-400 font-bold">$523.740 COP</strong> (calculada con la UVT 2026 de $52.374) más un 5% mensual sobre el impuesto y los intereses moratorios de la DIAN.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: CALENDAR NIT LOOKUP */}
      {activeTab === 'calendar' && (
        <div className="space-y-3.5 animate-fadeIn">
          <div className="bg-slate-900/90 border border-slate-700/80 rounded-2xl p-4 shadow-xl">
            <h4 className="text-xs sm:text-sm font-bold text-white mb-2 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-teal-400" />
              Calculador de Vencimiento DIAN 2026
            </h4>
            <p className="text-xs text-slate-400 mb-3">
              Ingresa tu cédula o los dos últimos dígitos para consultar tu fecha oficial de vencimiento:
            </p>

            <div className="flex items-center gap-2 mb-4">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={searchCedula}
                  onChange={(e) => setSearchCedula(e.target.value)}
                  placeholder="Ej. 1018459821 o 21"
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs font-semibold placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              </div>
            </div>

            {/* Exact Date Callout */}
            <div className="p-4 bg-gradient-to-br from-teal-950/80 to-slate-900 border-2 border-teal-500/60 rounded-2xl text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <span className="text-[10px] uppercase tracking-wider font-extrabold text-teal-400">
                  Tu Fecha Límite Oficial DIAN
                </span>
                <span className="px-2 py-0.5 bg-teal-500/20 text-teal-300 border border-teal-500/40 rounded text-[10px] font-black">
                  Dígitos: {extractLastTwoDigits(searchCedula || userData.cedula || '01')}
                </span>
              </div>
              <div className="text-xl sm:text-2xl font-black text-white my-1">
                {currentCalendarEntry.dueDate}
              </div>
              <p className="text-xs text-slate-300">
                Aplica para el rango de dígitos: <strong className="text-amber-400 font-bold">[{currentCalendarEntry.digits}]</strong>
              </p>
              <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800 text-[11px] text-slate-300 border border-slate-700">
                <Clock className="w-3.5 h-3.5 text-teal-400" />
                Mes del calendario: <strong className="text-teal-300">{currentCalendarEntry.month} 2026</strong>
              </div>
            </div>
          </div>

          {/* Quick Schedule Reference List */}
          <div className="bg-slate-900/90 border border-slate-700/80 rounded-2xl p-4 max-h-60 overflow-y-auto space-y-1.5">
            <h5 className="text-xs font-bold text-slate-300 mb-2">
              Resumen del Calendario DIAN (50 Grupos de Dígitos):
            </h5>
            {DIAN_CALENDAR_2026.map((item) => (
              <div
                key={item.digits}
                className={`flex items-center justify-between p-2 rounded-lg text-xs ${
                  item.digits === currentCalendarEntry.digits
                    ? 'bg-teal-900/60 text-teal-200 border border-teal-500/50 font-bold'
                    : 'bg-slate-800/40 text-slate-400'
                }`}
              >
                <span>Cédulas {item.digits}</span>
                <span className="font-semibold text-slate-200">{item.dueDate}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: HERO INVENTORY CHECKLIST */}
      {activeTab === 'inventory' && (
        <div className="space-y-3.5 animate-fadeIn">
          <div className="bg-slate-900/90 border border-slate-700/80 rounded-2xl p-4 shadow-xl">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-white flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-amber-400" />
                  El Inventario del Héroe Tributario
                </h4>
                <p className="text-[11px] text-slate-400">
                  Marca los soportes que ya tienes listos para tu declaración:
                </p>
              </div>
              <button
                type="button"
                onClick={toggleAllDocs}
                className="text-[11px] text-teal-400 hover:text-teal-300 font-semibold px-2 py-1 bg-slate-800 rounded-lg border border-slate-700"
              >
                {selectedDocs.length === HERO_DOCUMENTS.length ? 'Desmarcar' : 'Marcar Todos'}
              </button>
            </div>

            <div className="space-y-2">
              {HERO_DOCUMENTS.map((doc) => {
                const isSelected = selectedDocs.includes(doc.id);
                return (
                  <div
                    key={doc.id}
                    onClick={() => toggleDoc(doc.id)}
                    className={`p-3 rounded-xl border cursor-pointer transition-all flex items-start gap-2.5 ${
                      isSelected
                        ? 'bg-teal-950/40 border-teal-500/70 text-white'
                        : 'bg-slate-800/50 border-slate-700/60 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <div className={`mt-0.5 w-4 h-4 rounded flex items-center justify-center flex-shrink-0 ${
                      isSelected ? 'bg-teal-500 text-slate-950 font-bold' : 'border border-slate-600 bg-slate-800'
                    }`}>
                      {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>

                    <div className="flex-1 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white">{doc.title}</span>
                        <span className={`text-[9px] font-extrabold px-1.5 py-0.2 rounded ${
                          doc.importance === 'Crítico'
                            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                            : doc.importance === 'Beneficio 1%'
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                              : 'bg-slate-700 text-slate-300'
                        }`}>
                          {doc.importance}
                        </span>
                      </div>
                      <p className="text-slate-400 text-[11px] mt-0.5 leading-relaxed">
                        {doc.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* === BOTTOM ACTION BUTTONS (MANDATORY REQUIREMENTS) === */}
      <div className="mt-5 space-y-2.5">
        {/* 1. PDF DOWNLOAD BUTTON */}
        <button
          onClick={handleDownloadPDF}
          disabled={isGeneratingPdf}
          className="w-full py-3.5 px-4 bg-gradient-to-r from-teal-600 via-teal-500 to-emerald-500 hover:from-teal-500 hover:to-emerald-400 text-white font-extrabold text-sm sm:text-base rounded-2xl shadow-xl shadow-teal-950/60 flex items-center justify-center gap-2.5 active:scale-[0.98] transition-all cursor-pointer"
        >
          <Download className={`w-5 h-5 ${isGeneratingPdf ? 'animate-bounce' : ''}`} />
          <span>
            {isGeneratingPdf ? 'GENERANDO INFORME PDF...' : 'DESCARGAR INFORME EN PDF'}
          </span>
        </button>

        {/* 2. WHATSAPP DIRECT CONTACT */}
        <a
          href={getWhatsAppURL()}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => sounds.playClick()}
          className="w-full py-3.5 px-4 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white font-extrabold text-sm sm:text-base rounded-2xl shadow-xl shadow-emerald-950/60 flex items-center justify-center gap-2.5 active:scale-[0.98] transition-all cursor-pointer"
        >
          <MessageCircle className="w-5 h-5 fill-current" />
          <span>CONTACTAR POR WHATSAPP (+57 316 628 1699)</span>
        </a>

        {/* 3. EMAIL CONTACT */}
        <a
          href={getEmailURL()}
          onClick={() => sounds.playClick()}
          className="w-full py-3 px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-bold text-xs sm:text-sm rounded-2xl border border-slate-700 shadow-md flex items-center justify-center gap-2 active:scale-[0.98] transition-all cursor-pointer"
        >
          <Mail className="w-4 h-4 text-amber-400" />
          <span>Enviar Diagnóstico a info@contabilidadayc.com.co</span>
        </a>

        {/* Secondary helper actions (Share & Restart) */}
        <div className="grid grid-cols-2 gap-2 pt-2">
          <button
            onClick={handleShare}
            className="py-2.5 px-3 bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl border border-slate-700 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5 text-teal-400" />
            <span>{copiedLink ? '¡Enlace Copiado!' : 'Compartir Juego'}</span>
          </button>

          <button
            onClick={() => {
              sounds.playLevelUp();
              onReset();
            }}
            className="py-2.5 px-3 bg-slate-800 hover:bg-slate-700 text-amber-300 hover:text-amber-200 text-xs font-bold rounded-xl border border-amber-500/40 flex items-center justify-center gap-1.5 transition-all active:scale-[0.98] cursor-pointer shadow-md"
          >
            <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
            <span>Nuevo Diagnóstico</span>
          </button>
        </div>
      </div>

      {/* Footer Branding info */}
      <div className="mt-6 text-center text-slate-400 text-xs space-y-1">
        <p className="font-semibold text-slate-300">
          {TAX_CONSTANTS.COMPANY_NAME} • Expertos en Declaración de Renta DIAN
        </p>
        <p className="text-[10px] text-slate-400">
          Sede Principal: Colombia | PBX & WhatsApp: {TAX_CONSTANTS.WHATSAPP_DISPLAY} | {TAX_CONSTANTS.EMAIL_CONTACT}
        </p>
      </div>
    </div>
  );
};
