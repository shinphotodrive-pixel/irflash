import React from 'react';
import { FileText, ExternalLink } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 py-6 px-4 text-xs mt-12">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-center md:text-left">
          <p className="font-bold text-slate-200 text-sm">
            DC 12V 기반 지능형 교통 단속 & 과속 경고 하이브리드 시스템 분석 리포트
          </p>
          <p className="text-[11px] text-slate-500">
            참고 표준: 도로교통법 스쿨존(민식이법) 단속 규격, IEC 62471 광생물학적 안전성, Dahua TiOC, Hanwha Vision, 네오텍, ABi Korea 공식 유통가 기준
          </p>
        </div>

        <div className="flex items-center space-x-3 text-[11px] text-slate-500">
          <span className="flex items-center space-x-1">
            <FileText className="w-3.5 h-3.5 text-amber-500" />
            <span>Interactive Web Report v3.2</span>
          </span>
          <span>•</span>
          <span className="text-slate-400">견적가 · 영상 · 스토어 구매 링크 통합</span>
        </div>
      </div>
    </footer>
  );
};
