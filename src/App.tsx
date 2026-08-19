/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { GameStage, TaxUserData } from './types';
import { HeaderHUD } from './components/HeaderHUD';
import { WelcomeScreen } from './components/WelcomeScreen';
import { ClassificationPortal } from './components/ClassificationPortal';
import { ResidencyTest } from './components/ResidencyTest';
import { ThresholdShield } from './components/ThresholdShield';
import { ImprovementModule } from './components/ImprovementModule';
import { OracleResults } from './components/OracleResults';
import { sounds } from './utils/audio';

const STORAGE_KEY = 'renta_quest_2026_data';
const STAGE_KEY = 'renta_quest_2026_stage';

const INITIAL_USER_DATA: TaxUserData = {
  playerName: '',
  playerProfileCategory: '',
  cedula: '',
  isSimpleRegime: false,
  isLiquidatedEstate: false,
  estateDeceasedResident: true,
  
  // Residency (Art. 10 E.T.)
  stayedMoreThan183Days: true,
  hasColombianNationality: true,
  hasFamilyInColombia: false,
  has50PercentIncomeInColombia: false,
  has50PercentAssetsInColombia: false,
  isInTaxHaven: false,
  qualifiesForForeignDomicileException: false,
  isTaxResident: true,
  
  // Thresholds 2025
  patrimonioBruto: 0,
  ingresosBrutos: 0,
  consumosTarjeta: 0,
  comprasTotales: 0,
  consignacionesBancarias: 0,
  
  // Special modules
  hasHomeImprovements: false,
  improvementCost: 0,
  hasElectronicInvoices: false,
  electronicInvoiceExpenses: 0,
  hasLentBankAccount: false,
  
  // Inventory
  collectedDocuments: ['form_220', 'extractos_bancarios', 'rut_actualizado'],
  
  // Health
  taxHealth: 100,
};

export default function App() {
  const [stage, setStage] = useState<GameStage>(() => {
    if (typeof window !== 'undefined') {
      const savedStage = localStorage.getItem(STAGE_KEY) as GameStage;
      if (savedStage) return savedStage;
    }
    return 'welcome';
  });

  const [userData, setUserData] = useState<TaxUserData>(() => {
    if (typeof window !== 'undefined') {
      const savedData = localStorage.getItem(STORAGE_KEY);
      if (savedData) {
        try {
          return JSON.parse(savedData);
        } catch {
          // parse error
        }
      }
    }
    return INITIAL_USER_DATA;
  });

  const [isMuted, setIsMuted] = useState(false);

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
      localStorage.setItem(STAGE_KEY, stage);
    } catch {
      // ignore
    }
  }, [userData, stage]);

  const updateUserData = (partial: Partial<TaxUserData>) => {
    setUserData(prev => ({ ...prev, ...partial }));
  };

  const handleToggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    sounds.isMuted = nextMuted;
  };

  const handleReset = () => {
    setUserData(INITIAL_USER_DATA);
    setStage('welcome');
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(STAGE_KEY);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-teal-500 selection:text-slate-950">
      {/* HUD Header */}
      <HeaderHUD
        stage={stage}
        userData={userData}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
        onReset={handleReset}
      />

      {/* Main Game Stage Container */}
      <main className="flex-1 flex flex-col justify-center max-w-4xl w-full mx-auto p-2 sm:p-4">
        {stage === 'welcome' && (
          <WelcomeScreen
            userData={userData}
            onUpdateUserData={updateUserData}
            onStartGame={() => setStage('classification')}
          />
        )}

        {stage === 'classification' && (
          <ClassificationPortal
            userData={userData}
            onUpdateUserData={updateUserData}
            onNext={() => setStage('residency')}
            onJumpToResults={() => setStage('results')}
          />
        )}

        {stage === 'residency' && (
          <ResidencyTest
            userData={userData}
            onUpdateUserData={updateUserData}
            onNext={() => setStage('thresholds')}
            onPrev={() => setStage('classification')}
          />
        )}

        {stage === 'thresholds' && (
          <ThresholdShield
            userData={userData}
            onUpdateUserData={updateUserData}
            onNext={() => setStage('improvements')}
            onPrev={() => setStage('residency')}
          />
        )}

        {stage === 'improvements' && (
          <ImprovementModule
            userData={userData}
            onUpdateUserData={updateUserData}
            onNext={() => setStage('results')}
            onPrev={() => setStage('thresholds')}
          />
        )}

        {stage === 'results' && (
          <OracleResults
            userData={userData}
            onUpdateUserData={updateUserData}
            onReset={handleReset}
          />
        )}
      </main>
    </div>
  );
}
