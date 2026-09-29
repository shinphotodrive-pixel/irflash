import React, { useState } from 'react';
import { TabType } from './types';
import { Header } from './components/Header';
import { MechanismTab } from './components/MechanismTab';
import { ProductsTab } from './components/ProductsTab';
import { SimulatorTab } from './components/SimulatorTab';
import { FieldGuideTab } from './components/FieldGuideTab';
import { Footer } from './components/Footer';
import { Microscope, ListFilter, SlidersHorizontal, Wrench } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('mechanism');

  return (
    <div className="bg-slate-100 text-slate-800 font-sans antialiased min-h-screen flex flex-col">
      {/* Header & Global Status Bar */}
      <Header />

      {/* Navigation Tab Bar */}
      <nav className="bg-white border-b border-slate-200 sticky top-16 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 flex space-x-1 sm:space-x-3 overflow-x-auto text-xs sm:text-sm font-medium py-2.5">
          <button
            onClick={() => setActiveTab('mechanism')}
            className={`px-3.5 py-2 rounded-lg transition flex items-center space-x-1.5 whitespace-nowrap ${
              activeTab === 'mechanism'
                ? 'text-amber-800 bg-amber-50 font-bold border border-amber-300 shadow-sm'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Microscope className="w-4 h-4 text-amber-600" />
            <span>1. 광학 및 전기 메커니즘</span>
          </button>

          <button
            onClick={() => setActiveTab('products')}
            className={`px-3.5 py-2 rounded-lg transition flex items-center space-x-1.5 whitespace-nowrap ${
              activeTab === 'products'
                ? 'text-amber-800 bg-amber-50 font-bold border border-amber-300 shadow-sm'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <ListFilter className="w-4 h-4 text-amber-600" />
            <span>2. 하이브리드 & 모듈 비교 (가격/구매/소개)</span>
          </button>

          <button
            onClick={() => setActiveTab('simulator')}
            className={`px-3.5 py-2 rounded-lg transition flex items-center space-x-1.5 whitespace-nowrap ${
              activeTab === 'simulator'
                ? 'text-amber-800 bg-amber-50 font-bold border border-amber-300 shadow-sm'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <SlidersHorizontal className="w-4 h-4 text-amber-600" />
            <span>3. 엔지니어링 계산 & 동기화</span>
          </button>

          <button
            onClick={() => setActiveTab('field')}
            className={`px-3.5 py-2 rounded-lg transition flex items-center space-x-1.5 whitespace-nowrap ${
              activeTab === 'field'
                ? 'text-amber-800 bg-amber-50 font-bold border border-amber-300 shadow-sm'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Wrench className="w-4 h-4 text-amber-600" />
            <span>4. 현장 설치 & 결선 지침</span>
          </button>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-grow w-full">
        {activeTab === 'mechanism' && <MechanismTab />}
        {activeTab === 'products' && <ProductsTab />}
        {activeTab === 'simulator' && <SimulatorTab />}
        {activeTab === 'field' && <FieldGuideTab />}
      </main>

      {/* Footer Bar */}
      <Footer />
    </div>
  );
}
