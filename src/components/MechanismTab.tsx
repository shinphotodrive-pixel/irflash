import React, { useState } from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';
import { Eye, ShieldCheck, Zap, AlertTriangle, Layers, Activity } from 'lucide-react';

const wavelengthChartData = [
  {
    name: '740 nm (적색 경계)',
    sensorEfficiency: 82,
    redGlow: 65,
    note: '센서 효율 우수 + 뚜렷한 붉은 점으로 경고 효과 겸용'
  },
  {
    name: '850 nm (ITS 표준)',
    sensorEfficiency: 75,
    redGlow: 15,
    note: '센서 감도 최상 + 정면에서만 은은한 적색 (글로벌 표준)'
  },
  {
    name: '940 nm (완전 비가시)',
    sensorEfficiency: 32,
    redGlow: 0,
    note: '인간 육안 0% 감지되나 센서 감도 급감, 12V 비추천'
  }
];

const driveModeChartData = [
  {
    name: '연속 구동 (Continuous)',
    peakIllum: 100,
    avgWattage: 25,
    desc: '상시 점등 방식: LED 발열 누적 및 배터리 전력 소모 극심'
  },
  {
    name: '스트로보 펄스 (Strobe)',
    peakIllum: 750,
    avgWattage: 6,
    desc: '듀티비 1~39% 오버드라이브: 피크 조도 7.5배 폭발, 소비전력 1/4 절감'
  }
];

export const MechanismTab: React.FC = () => {
  const [selectedWavelength, setSelectedWavelength] = useState<'740' | '850' | '940'>('850');

  return (
    <div className="space-y-6">
      {/* Section Intro Paragraph */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-3">
        <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center space-x-2">
          <span className="text-amber-500">■</span>
          <span>야간 단속의 당위성과 적외선(IR) 및 가시광선 조명 메커니즘</span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          어린이 보호구역(&apos;민식이법&apos;) 및 악천후 가변 속도 규제에 따라 야간 무인 단속 카메라는 고속 이동 차량의 번호판(LPR)을 명확히 포착해야 합니다. 
          과거 가시광선 백색 플래시는 운전자에게 순간적 눈부심(Glare) 및 플래시 블라인드니스를 유발하여 2차 사고 위험을 높였기 때문에, 
          현대 표준은 비가시 적외선(IR) 광원으로 전환되었습니다. 
          그러나 순수 적외선만으로는 과속 운전자에게 즉각적인 시각적 경고(Visual Deterrence)를 주지 못하므로, 
          <strong className="text-slate-900 font-semibold"> DC 12V 제한 전력 조건 하에서 IR 캡처 플래시와 가시광선 스트로보 경광등이 결합된 하이브리드 메커니즘</strong>이 필수적입니다.
        </p>
      </div>

      {/* Grid 1: Wavelength Spectrum & Sensor Efficiency */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Interactive Card: Wavelength Comparison */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
              <h3 className="font-bold text-sm text-slate-800 flex items-center space-x-1.5">
                <Layers className="w-4 h-4 text-amber-500" />
                <span>적외선(IR) 파장대역별 특성 비교 (740nm vs 850nm vs 940nm)</span>
              </h3>
              <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-mono">
                실리콘 센서 감도
              </span>
            </div>
            <p className="text-xs text-slate-600 mb-4">
              적외선 파장에 따라 카메라 센서의 양자 효율(Quantum Efficiency)과 육안 인지 가능성(Red Glow)이 크게 변합니다.
            </p>
            
            <div className="space-y-3 text-xs">
              <div 
                onClick={() => setSelectedWavelength('740')}
                className={`p-3 rounded-lg cursor-pointer transition border ${
                  selectedWavelength === '740' ? 'bg-amber-50 border-amber-400 ring-2 ring-amber-200' : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center justify-between font-bold text-amber-900 mb-1">
                  <span className="flex items-center space-x-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-600 inline-block"></span>
                    <span>740 nm 파장 (적색 끝부분 대역)</span>
                  </span>
                  <span className="bg-amber-200 text-amber-900 px-1.5 py-0.5 rounded text-[10px]">시각 경고 겸용</span>
                </div>
                <p className="text-slate-700 leading-snug">
                  육안 관찰 시 뚜렷한 붉은 점(Red Glow)이 보입니다. 번호판 반사체 수광 효율(82%)이 우수하면서도 운전자에게 단속 장비 가동 사실을 은연중에 전달하는 심리적 억제 효과를 제공합니다. (예: 한화비전 SPI-1225)
                </p>
              </div>

              <div 
                onClick={() => setSelectedWavelength('850')}
                className={`p-3 rounded-lg cursor-pointer transition border ${
                  selectedWavelength === '850' ? 'bg-emerald-50 border-emerald-400 ring-2 ring-emerald-200' : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center justify-between font-bold text-emerald-900 mb-1">
                  <span className="flex items-center space-x-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 inline-block"></span>
                    <span>850 nm 파장 (ITS 글로벌 표준 대역)</span>
                  </span>
                  <span className="bg-emerald-200 text-emerald-900 px-1.5 py-0.5 rounded text-[10px]">최적 효율 표준</span>
                </div>
                <p className="text-slate-700 leading-snug">
                  실리콘 센서의 수광 감도가 매우 높아서 적은 전력으로도 멀리서 선명한 노이즈 없는 이미지를 획득합니다. 정면에서 유심히 볼 때만 희미한 빛이 감지되는 균형 잡힌 파장입니다. (예: Hikvision, Neotech)
                </p>
              </div>

              <div 
                onClick={() => setSelectedWavelength('940')}
                className={`p-3 rounded-lg cursor-pointer transition border ${
                  selectedWavelength === '940' ? 'bg-slate-200 border-slate-400 ring-2 ring-slate-300' : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center justify-between font-bold text-slate-800 mb-1">
                  <span className="flex items-center space-x-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-slate-500 inline-block"></span>
                    <span>940 nm 파장 (완전 비가시 은폐 대역)</span>
                  </span>
                  <span className="bg-slate-300 text-slate-700 px-1.5 py-0.5 rounded text-[10px]">DC 12V 비추천</span>
                </div>
                <p className="text-slate-600 leading-snug">
                  육안으로 전혀 감지되지 않으나 센서 감도가 850nm 대비 50% 이하(32%)로 급감합니다. 동일 밝기를 내기 위해 2배 이상의 전력이 필요하므로 DC 12V 배터리 환경에서는 권장되지 않습니다.
                </p>
              </div>
            </div>
          </div>

          <div className="p-2.5 bg-slate-900 text-white rounded-lg text-xs flex items-center justify-between">
            <span className="text-slate-400">선택된 파장 평가:</span>
            <span className="font-mono font-bold text-amber-400">
              {selectedWavelength === '740' && '740nm: 번호판 인식율 82% + 육안 붉은점 시각 경고 효과'}
              {selectedWavelength === '850' && '850nm: ITS 글로벌 표준 (저전력 고감도 최적 밸런스)'}
              {selectedWavelength === '940' && '940nm: 군사용/보안용 (배터리 소비 과다로 비추천)'}
            </span>
          </div>
        </div>

        {/* Dynamic Chart 1: Wavelength vs Quantum Efficiency & Glow */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="border-b border-slate-100 pb-3 mb-3 flex items-center justify-between">
              <h3 className="font-bold text-sm text-slate-800 flex items-center space-x-1.5">
                <Activity className="w-4 h-4 text-emerald-600" />
                <span>파장별 센서 양자효율 vs 육안 붉은눈(Glow) 강도 (%)</span>
              </h3>
              <span className="text-[11px] text-slate-400">Recharts 분석</span>
            </div>
            <p className="text-xs text-slate-500 mb-2">
              DC 12V 제한 전력 조건에서 적은 전력으로 높은 센서 감도를 얻기 위한 850nm 및 740nm 파장의 정당성을 나타냅니다.
            </p>
          </div>

          <div className="w-full h-72 my-auto">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={wavelengthChartData} margin={{ top: 20, right: 20, left: -10, bottom: 25 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#475569' }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#475569' }} unit="%" />
                <Tooltip 
                  formatter={(value: any, name: any) => [
                    `${value}%`, 
                    name === 'sensorEfficiency' ? '센서 양자 효율' : '육안 붉은눈(Red Glow)'
                  ]}
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f8fafc', fontSize: '12px', borderRadius: '8px' }}
                />
                <Legend 
                  wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }}
                  formatter={(value) => value === 'sensorEfficiency' ? '실리콘 센서 양자 효율 (%)' : '육안 붉은빛(Red Glow) 감지도 (%)'}
                />
                <Bar dataKey="sensorEfficiency" fill="#10b981" radius={[4, 4, 0, 0]} name="sensorEfficiency" />
                <Bar dataKey="redGlow" fill="#f59e0b" radius={[4, 4, 0, 0]} name="redGlow" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Grid 2: Continuous vs Strobe Driving Mode & Photobiological Safety */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Dynamic Chart 2: Continuous vs Strobe Pulse Mode */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="border-b border-slate-100 pb-3 mb-3 flex items-center justify-between">
              <h3 className="font-bold text-sm text-slate-800 flex items-center space-x-1.5">
                <Zap className="w-4 h-4 text-amber-500" />
                <span>구동 방식별 순간 광량(상대 조도) vs 평균 소비전력(W)</span>
              </h3>
              <span className="text-[11px] text-slate-400">오버드라이브 효과</span>
            </div>
            <p className="text-xs text-slate-500 mb-2">
              스트로보 펄스 모드는 듀티 비(Duty Cycle 1~39%) 제어를 통해 평균 소비전력을 6W 수준으로 낮추면서 순간 밝기를 7.5배 폭발시킵니다.
            </p>
          </div>

          <div className="w-full h-72 my-auto">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={driveModeChartData} margin={{ top: 20, right: 20, left: -10, bottom: 25 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#475569' }} />
                <YAxis yAxisId="left" tick={{ fontSize: 11, fill: '#ef4444' }} label={{ value: '순간 조도(상대값)', angle: -90, position: 'insideLeft', fontSize: 10, fill: '#ef4444' }} />
                <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11, fill: '#3b82f6' }} label={{ value: '평균 전력(W)', angle: 90, position: 'insideRight', fontSize: 10, fill: '#3b82f6' }} />
                <Tooltip 
                  formatter={(value: any, name: any) => [
                    name === 'peakIllum' ? `${value} lx (상대값)` : `${value} W`,
                    name === 'peakIllum' ? '순간 피크 광량' : '평균 소비 전력'
                  ]}
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f8fafc', fontSize: '12px', borderRadius: '8px' }}
                />
                <Legend 
                  wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }}
                  formatter={(value) => value === 'peakIllum' ? '순간 피크 광량 (Relative lx)' : '평균 소비전력 (W)'}
                />
                <Bar yAxisId="left" dataKey="peakIllum" fill="#ef4444" radius={[4, 4, 0, 0]} name="peakIllum" />
                <Bar yAxisId="right" dataKey="avgWattage" fill="#3b82f6" radius={[4, 4, 0, 0]} name="avgWattage" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Explanatory Text Card: Strobe Mode & Photobiological Safety */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="font-bold text-sm text-slate-800 flex items-center space-x-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>초고속 스트로보 동기화 및 광생물학적 안전 규격 (IEC 62471)</span>
            </h3>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-800 text-xs">1. 하드웨어 TTL 펄스 동기화 (Trigger Sync)</span>
                <span className="bg-emerald-100 text-emerald-800 font-mono px-1.5 py-0.5 rounded text-[10px]">≤ 20 µs</span>
              </div>
              <p className="text-slate-600 leading-snug">
                도플러 레이더가 과속 차량을 감지하는 순간 4~6V TTL 고속 신호를 조명 드라이버로 전송합니다. 
                대응 지연 시간은 <strong className="text-slate-800">20 µs 이하</strong>여야 하며, 카메라의 글로벌 셔터 개방 시점과 오차 없이 일치하여 모션 블러를 0%로 동결합니다.
              </p>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-800 text-xs">2. SafeStrobe 과열/과구동 방지 하드웨어 회로</span>
                <span className="bg-amber-100 text-amber-800 font-mono px-1.5 py-0.5 rounded text-[10px]">Duty ≤ 39%</span>
              </div>
              <p className="text-slate-600 leading-snug">
                신호 배선 단락 또는 연속 트리거 오작동으로 인해 펄스 듀티 비가 40%를 초과할 경우, 내부 보호 집적회로(IC)가 개입하여 LED 소자 영구 파손을 막기 위해 펄스를 강제 차단하고 쿨다운 모드로 자동 전환합니다.
              </p>
            </div>

            <div className="p-3 bg-rose-50 rounded-lg border border-rose-200 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-rose-900 text-xs flex items-center space-x-1">
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                  <span>3. IEC 62471 광생물학적 안전 등급 준수</span>
                </span>
                <span className="bg-rose-200 text-rose-800 font-mono px-1.5 py-0.5 rounded text-[10px]">RG1 이하 필수</span>
              </div>
              <p className="text-rose-800 leading-snug">
                운전자의 안구를 향해 직접 조사되는 경고용 적색/백색 스트로보는 시력 손상 및 잔상에 의한 2차 사고를 방지하기 위해 
                <strong className="font-bold"> RG1 (Risk Group 1 - 혐오 반사 및 노출 시간 제한 시 안전)</strong> 이하 등급을 반드시 충족하도록 펄스 지속 시간을 50ms 미만으로 펌웨어 제한해야 합니다.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
