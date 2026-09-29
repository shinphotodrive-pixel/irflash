import React, { useState } from 'react';
import { Shield, Eye, Clock, Terminal, Zap, Check, AlertCircle } from 'lucide-react';

export const FieldGuideTab: React.FC = () => {
  const [wiringMode, setWiringMode] = useState<'dry' | 'wet'>('dry');

  return (
    <div className="space-y-6">
      {/* Section Intro Paragraph */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-3">
        <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center space-x-2">
          <span className="text-amber-500">■</span>
          <span>현장 엔지니어링 3대 기술 난제 극복 및 인터페이스 결선 지침</span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          배터리 및 태양광 기반 DC 12V 시스템 구축 시 엔지니어는 
          <strong className="text-slate-900 font-semibold"> 인러쉬 전류에 의한 전압 강하(Voltage Drop)</strong>, 
          <strong className="text-slate-900 font-semibold"> 가시광선 산란광으로 인한 카메라 화이트홀(White-hole) 현상</strong>, 그리고 
          <strong className="text-slate-900 font-semibold"> 기계식 릴레이 지연 문제</strong>를 해결해야 합니다. 
          아래 실무 엔지니어링 가이드라인과 결선도를 숙지하여 하드웨어 안정성을 극대화하십시오.
        </p>
      </div>

      {/* 3 Major Challenges Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Card 1 */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-3 flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-2 border-b border-slate-100 pb-2.5">
              <Zap className="w-5 h-5 text-amber-500" />
              <h3 className="font-bold text-xs sm:text-sm text-slate-900">1. 인러쉬 전류 & 전압강하 방어</h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed mt-2">
              스트로보 플래시 기동 시 순간 피크 전류가 수십 A까지 치솟아 DC 12V 버스 전압이 순간 9V 이하로 드롭되어 메인 SBC 및 카메라가 재부팅되는 현상이 빈번합니다.
            </p>
          </div>
          
          <div className="bg-amber-50 p-3 rounded-lg border border-amber-200 text-xs text-amber-900 space-y-1">
            <strong className="block text-amber-950 flex items-center space-x-1">
              <Check className="w-3.5 h-3.5 text-amber-700" />
              <span>실무 엔지니어링 솔루션:</span>
            </strong>
            <p className="leading-snug text-[11px]">
              배터리 PDU 단에서 카메라 전원과 조명 전원을 독립 분기하고, 조명 입력단에 10,000µF Low-ESR 커패시터 뱅크와 DC-DC 자동 승강압(Buck-Boost) 스태빌라이저를 필수 구성합니다.
            </p>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-3 flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-2 border-b border-slate-100 pb-2.5">
              <Eye className="w-5 h-5 text-emerald-600" />
              <h3 className="font-bold text-xs sm:text-sm text-slate-900">2. 광학 간섭 & 화이트홀 방지</h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed mt-2">
              시각 경고등의 강렬한 가시광선이 렌즈로 직접 역입사되거나 도로 번호판 반사체에서 반사되어 LPR 센서의 번호판 영역이 완전히 하얗게 포화(Blowout)되는 현상입니다.
            </p>
          </div>

          <div className="bg-emerald-50 p-3 rounded-lg border border-emerald-200 text-xs text-emerald-900 space-y-1">
            <strong className="block text-emerald-950 flex items-center space-x-1">
              <Check className="w-3.5 h-3.5 text-emerald-700" />
              <span>실무 엔지니어링 솔루션:</span>
            </strong>
            <p className="leading-snug text-[11px]">
              경광등을 카메라 FOV 밖인 폴대 하단부(2.5m 높이)에 이격 마운트하고, 루버(Louver/후드)를 장착하여 운전자 시선 전방(수평 하향 5도)으로만 가시광선을 차광 제어합니다.
            </p>
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-3 flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-2 border-b border-slate-100 pb-2.5">
              <Clock className="w-5 h-5 text-indigo-600" />
              <h3 className="font-bold text-xs sm:text-sm text-slate-900">3. 릴레이 기계 지연시간 분리</h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed mt-2">
              일반 기계식 무전압 릴레이 코일 구동 시 5~15ms 구조적 지연 및 바운싱이 발생하여 마이크로초(µs) 단위 카메라 셔터 타이밍과 싱크가 어긋나는 문제입니다.
            </p>
          </div>

          <div className="bg-indigo-50 p-3 rounded-lg border border-indigo-200 text-xs text-indigo-900 space-y-1">
            <strong className="block text-indigo-950 flex items-center space-x-1">
              <Check className="w-3.5 h-3.5 text-indigo-700" />
              <span>실무 엔지니어링 솔루션:</span>
            </strong>
            <p className="leading-snug text-[11px]">
              속도 레이더와 카메라 간은 포토커플러 또는 반도체 SSR(Solid-State Relay)로 나노초 즉시 트리거하고, 시각 경광등은 기계식 릴레이로 50ms 후단 시차를 두어 작동시킵니다.
            </p>
          </div>
        </div>

      </div>

      {/* Interface Wiring Diagram View Tabs */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
        <div className="border-b border-slate-100 pb-3 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <Terminal className="w-4 h-4 text-slate-700" />
            <h3 className="font-bold text-sm text-slate-800">
              카메라 후면 알람 포트(Alarm IN) 유선 결선 인터페이스
            </h3>
          </div>

          <div className="flex space-x-2 text-xs">
            <button
              onClick={() => setWiringMode('dry')}
              className={`px-3 py-1.5 rounded-lg font-bold transition ${
                wiringMode === 'dry'
                  ? 'bg-emerald-700 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Dry Contact (무전압 접점 - 권장)
            </button>
            <button
              onClick={() => setWiringMode('wet')}
              className={`px-3 py-1.5 rounded-lg font-bold transition ${
                wiringMode === 'wet'
                  ? 'bg-amber-700 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Wet Contact (유전압 펄스 신호)
            </button>
          </div>
        </div>

        {/* Dry Contact Wiring Diagram */}
        {wiringMode === 'dry' && (
          <div className="space-y-3 text-xs animate-in fade-in duration-150">
            <div className="bg-emerald-50 p-3 rounded-lg border border-emerald-200 text-emerald-950 leading-relaxed">
              <strong className="text-emerald-900 block mb-1">
                ✓ Dry Contact (무전압 건접점 방식 - ITS 현장 절대 권장 표준):
              </strong>
              속도 제어 보드 또는 레이더의 무전압 릴레이 스위치가 단락(Closed/Short)될 때, 카메라 내부의 풀업 저항(Pull-up) 전압이 GND로 흘러 접지되면서 셔터가 작동하는 방식입니다. 
              외부 전압 혼입으로 인한 카메라 메인보드 소손 위험이 전혀 없습니다.
            </div>

            <div className="bg-slate-950 text-slate-100 p-4 rounded-xl font-mono space-y-3 border border-slate-800 shadow-inner">
              <div className="text-emerald-400 font-bold flex items-center justify-between">
                <span>[ Dry Contact 무전압 결선 터미널 핀맵 가이드 ]</span>
                <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-slate-300">내부 5V Pull-up 활성화</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[11px]">
                <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 space-y-1.5">
                  <span className="text-amber-400 block font-bold">1. 레이더 / 속도 컨트롤러 단자</span>
                  <div className="text-slate-300 font-mono">
                    <p>• Relay OUT (COM) ──[도선 1]──┐</p>
                    <p>• Relay OUT (NO)  ──[도선 2]──┼┐</p>
                    <p className="text-slate-500 text-[10px] mt-1">* 평상시 상시 개방(Normally Open)</p>
                  </div>
                </div>

                <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 space-y-1.5">
                  <span className="text-cyan-400 block font-bold">2. LPR 카메라 Alarm IN 단자대</span>
                  <div className="text-slate-300 font-mono">
                    <p>└──────&gt; [ ALARM IN 1 (Pin 1) ]</p>
                    <p> └────&gt; [ ALARM GND  (Pin 2) ]</p>
                    <p className="text-slate-500 text-[10px] mt-1">* 쇼트 시 카메라 Low-active 트리거</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Wet Contact Wiring Diagram */}
        {wiringMode === 'wet' && (
          <div className="space-y-3 text-xs animate-in fade-in duration-150">
            <div className="bg-amber-50 p-3 rounded-lg border border-amber-200 text-amber-950 leading-relaxed">
              <strong className="text-amber-900 block mb-1">
                ⚠️ Wet Contact (유전압 펄스 방식 - 절연 필수):
              </strong>
              속도 제어 보드에서 DC 5V~12V 전압 펄스 신호를 직접 출력할 때 사용합니다. 
              반드시 머신비전 카메라의 포토커플러 절연 GPIO(Line0+ / Line0-)에 인입해야 하며, 비절연 TTL 포트에 직접 12V를 인가하면 카메라 칩셋이 즉시 파손됩니다.
            </div>

            <div className="bg-slate-950 text-slate-100 p-4 rounded-xl font-mono space-y-3 border border-slate-800 shadow-inner">
              <div className="text-amber-400 font-bold flex items-center justify-between">
                <span>[ Wet Contact 유전압 결선 핀맵 및 전압 레벨 변환 ]</span>
                <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-amber-300">Opto-Isolated GPIO</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[11px]">
                <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 space-y-1.5">
                  <span className="text-rose-400 block font-bold">1. 속도 제어 보드 전압 펄스 출력</span>
                  <div className="text-slate-300 font-mono">
                    <p>• Pulse (+) 12V ──[1kΩ 저항]──┐</p>
                    <p>• Pulse (-) GND ─────────────┼┐</p>
                    <p className="text-slate-500 text-[10px] mt-1">* 펄스 폭: 20µs ~ 1ms 설정</p>
                  </div>
                </div>

                <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 space-y-1.5">
                  <span className="text-cyan-400 block font-bold">2. 산업용 LPR 카메라 Opto GPIO</span>
                  <div className="text-slate-300 font-mono">
                    <p>└──────&gt; [ Line0 (+) Opto IN ]</p>
                    <p> └────&gt; [ Line0 (-) Opto GND ]</p>
                    <p className="text-slate-500 text-[10px] mt-1">* 포토다이오드 절연 입력단</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Surge Protection & Grounding Checklist */}
      <div className="bg-slate-900 text-slate-200 p-5 rounded-xl border border-slate-800 text-xs space-y-3">
        <div className="flex items-center space-x-2 text-amber-400 font-bold text-sm">
          <Shield className="w-4 h-4" />
          <span>실외 도로 마운트 폴(Pole) 접지 및 서지 프로텍터(SPD) 필수 체크리스트</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-[11px]">
          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-1">
            <span className="text-slate-100 font-bold block">1. 1종 단독 접지 (≤ 10Ω)</span>
            <p className="text-slate-400 leading-snug">
              금속 폴대 하단에 동봉 접지봉 3조 이상을 매설하여 낙뢰 서지 유입 시 신속 방전 경로를 확보합니다.
            </p>
          </div>
          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-1">
            <span className="text-slate-100 font-bold block">2. DC 12V 라인 서지 보호기</span>
            <p className="text-slate-400 leading-snug">
              배터리 및 솔라 컨트롤러와 카메라 전원 입력단 사이에 10kA급 DC 전용 SPD를 직렬 결선합니다.
            </p>
          </div>
          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-1">
            <span className="text-slate-100 font-bold block">3. 실드 차폐 UTP 케이블</span>
            <p className="text-slate-400 leading-snug">
              STP(Shielded Twisted Pair) 케이블과 메탈 RJ45 커넥터를 사용하여 차량 점화 코일의 전자파 유도를 차단합니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
