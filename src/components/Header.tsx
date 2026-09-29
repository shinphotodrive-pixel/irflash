import React from 'react';
import { Lightbulb, Zap, BatteryCharging, ShieldAlert, Cpu } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="bg-slate-900 text-white sticky top-0 z-50 shadow-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <div className="bg-amber-500 text-slate-950 font-black px-2.5 py-1 rounded-lg text-sm tracking-wider shadow flex items-center space-x-1">
              <Cpu className="w-4 h-4" />
              <span>ITS 12V</span>
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-bold text-slate-100 leading-tight">
                지능형 야간 교통 단속 & 과속 경고 하이브리드 시스템
              </h1>
              <p className="text-xs text-slate-400 hidden sm:block">
                DC 12V 기반 IR 플래시 · 시각 경고등 · LPR 카메라 통합 기술 및 견적 분석
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2 text-xs">
            <span className="bg-emerald-950 text-emerald-400 border border-emerald-700/60 px-2.5 py-1 rounded-full font-medium flex items-center space-x-1.5 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>DC 12V 전력 최적화</span>
            </span>
          </div>
        </div>
      </div>

      {/* Global Metrics Summary Ribbon */}
      <div className="bg-slate-800/95 text-slate-200 border-t border-slate-700/80 py-2.5 px-4 backdrop-blur">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
          <div className="bg-slate-900/90 p-2.5 rounded-lg border border-slate-700/70 flex items-center justify-between">
            <div>
              <span className="text-slate-400 block text-[11px]">권장 IR 표준 파장</span>
              <span className="text-sm sm:text-base font-bold text-amber-400">850 nm / 740 nm</span>
            </div>
            <Lightbulb className="w-5 h-5 text-amber-400" />
          </div>

          <div className="bg-slate-900/90 p-2.5 rounded-lg border border-slate-700/70 flex items-center justify-between">
            <div>
              <span className="text-slate-400 block text-[11px]">트리거 응답 요구속도</span>
              <span className="text-sm sm:text-base font-bold text-emerald-400">≤ 20 µs (TTL)</span>
            </div>
            <Zap className="w-5 h-5 text-emerald-400" />
          </div>

          <div className="bg-slate-900/90 p-2.5 rounded-lg border border-slate-700/70 flex items-center justify-between">
            <div>
              <span className="text-slate-400 block text-[11px]">일체형 피크 전력</span>
              <span className="text-sm sm:text-base font-bold text-cyan-400">7.8 W (TiOC 기준)</span>
            </div>
            <BatteryCharging className="w-5 h-5 text-cyan-400" />
          </div>

          <div className="bg-slate-900/90 p-2.5 rounded-lg border border-slate-700/70 flex items-center justify-between">
            <div>
              <span className="text-slate-400 block text-[11px]">광생물학적 안전 규격</span>
              <span className="text-sm sm:text-base font-bold text-rose-400">IEC 62471 ≤ RG1</span>
            </div>
            <ShieldAlert className="w-5 h-5 text-rose-400" />
          </div>
        </div>
      </div>
    </header>
  );
};
