import React, { useState, useEffect, useRef } from 'react';
import { Play, RotateCcw, AlertTriangle, CheckCircle2, ShieldAlert, Sliders, Battery, Gauge } from 'lucide-react';

export const SimulatorTab: React.FC = () => {
  // Calculator States
  const [speedKm, setSpeedKm] = useState<number>(100);
  const [latencyMs, setLatencyMs] = useState<number>(50);

  // Battery Estimator States
  const [batteryAh, setBatteryAh] = useState<number>(100);
  const [standbyWatts, setStandbyWatts] = useState<number>(8);
  const [triggersPerDay, setTriggersPerDay] = useState<number>(300);

  // Simulation State
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [simRunning, setSimRunning] = useState<boolean>(false);
  const [simStep, setSimStep] = useState<number>(0); // 0: idle, 1: radar, 2: ir_flash, 3: warning_flash
  const animFrameId = useRef<number | null>(null);

  // Physics Calculations
  const mps = (speedKm * 1000) / 3600;
  const mmPerMs = mps;
  const cmPerMs = mmPerMs / 10;
  const totalShiftM = mps * (latencyMs / 1000);

  // Battery Life Calculations
  // Daily standby Wh = standbyWatts * 24h
  // Flash energy per trigger = approx 30W * 0.05s (50ms) = 1.5 Ws = 0.000416 Wh per trigger -> negligible, strobe warning 2.5W * 3s = 7.5 Ws = 0.002 Wh
  const dailyStandbyWh = standbyWatts * 24;
  const dailyTriggerWh = triggersPerDay * (2.5 * (3 / 3600)); // 3 seconds strobe
  const totalDailyWh = dailyStandbyWh + dailyTriggerWh;
  const batteryTotalWh = batteryAh * 12 * 0.8; // 80% DoD safety margin
  const autonomousDays = totalDailyWh > 0 ? (batteryTotalWh / totalDailyWh).toFixed(1) : '0';

  // Canvas Drawing Logic
  const drawCanvas = (xPos: number, state: 'idle' | 'radar' | 'ir_flash' | 'warning_flash') => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;

    ctx.clearRect(0, 0, w, h);

    // Dark asphalt roadway
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, h * 0.35, w, h * 0.55);

    // Road dashed center line
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 2;
    ctx.setLineDash([16, 16]);
    ctx.beginPath();
    ctx.moveTo(0, h * 0.62);
    ctx.lineTo(w, h * 0.62);
    ctx.stroke();
    ctx.setLineDash([]);

    // Line 1: Radar Detection Zone (at 30% x)
    ctx.strokeStyle = 'rgba(59, 130, 246, 0.7)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(w * 0.3, h * 0.15);
    ctx.lineTo(w * 0.3, h * 0.95);
    ctx.stroke();

    ctx.fillStyle = '#60a5fa';
    ctx.font = 'bold 11px sans-serif';
    ctx.fillText('1. 레이더 검지 존 (60m 전방)', w * 0.3 + 6, h * 0.25);

    // Line 2: Camera Shutter & IR Flash Sync Zone (at 60% x)
    ctx.strokeStyle = 'rgba(16, 185, 129, 0.7)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(w * 0.6, h * 0.15);
    ctx.lineTo(w * 0.6, h * 0.95);
    ctx.stroke();

    ctx.fillStyle = '#34d399';
    ctx.fillText('2. IR 플래시 & 번호판 캡처 (20µs)', w * 0.6 + 6, h * 0.25);

    // Line 3: Warning Strobe Flash Zone (at 82% x)
    ctx.strokeStyle = 'rgba(239, 68, 68, 0.7)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(w * 0.82, h * 0.15);
    ctx.lineTo(w * 0.82, h * 0.95);
    ctx.stroke();

    ctx.fillStyle = '#f87171';
    ctx.fillText('3. 과속 적색 스트로보 경광등', w * 0.82 + 6, h * 0.25);

    // Flash light screen bloom effects
    if (state === 'ir_flash') {
      const gradient = ctx.createRadialGradient(w * 0.65, h * 0.62, 10, w * 0.65, h * 0.62, 160);
      gradient.addColorStop(0, 'rgba(255, 255, 255, 0.75)');
      gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, w, h);
    } else if (state === 'warning_flash') {
      const gradient = ctx.createRadialGradient(w * 0.85, h * 0.62, 10, w * 0.85, h * 0.62, 180);
      gradient.addColorStop(0, 'rgba(239, 68, 68, 0.6)');
      gradient.addColorStop(1, 'rgba(239, 68, 68, 0)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, w, h);
    }

    // Vehicle Drawing
    if (xPos > 0) {
      // Vehicle shadow
      ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
      ctx.beginPath();
      ctx.ellipse(xPos + 26, h * 0.62 + 16, 28, 8, 0, 0, Math.PI * 2);
      ctx.fill();

      // Vehicle Body
      ctx.fillStyle = state === 'warning_flash' ? '#ef4444' : state === 'ir_flash' ? '#10b981' : '#3b82f6';
      ctx.beginPath();
      ctx.roundRect(xPos, h * 0.52, 54, 24, 5);
      ctx.fill();

      // Windshield & Windows
      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.roundRect(xPos + 30, h * 0.54, 14, 20, 2);
      ctx.fill();

      // Front bumper license plate
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 9px sans-serif';
      ctx.fillText('12가3456', xPos + 4, h * 0.52 + 15);

      // Headlights beam
      ctx.fillStyle = 'rgba(254, 240, 138, 0.25)';
      ctx.beginPath();
      ctx.moveTo(xPos + 54, h * 0.54);
      ctx.lineTo(xPos + 110, h * 0.48);
      ctx.lineTo(xPos + 110, h * 0.74);
      ctx.lineTo(xPos + 54, h * 0.70);
      ctx.closePath();
      ctx.fill();
    }
  };

  const handleResize = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = canvas.parentElement?.clientWidth || 700;
    canvas.height = 170;
    drawCanvas(0, 'idle');
  };

  useEffect(() => {
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      if (animFrameId.current) cancelAnimationFrame(animFrameId.current);
    };
  }, []);

  const runSimulation = () => {
    if (simRunning) return;
    setSimRunning(true);
    setSimStep(0);

    const canvas = canvasRef.current;
    if (!canvas) return;
    const w = canvas.width;
    let currentX = 0;
    const speedStep = (speedKm / 100) * 5 + 3;

    const animate = () => {
      currentX += speedStep;
      let currentState: 'idle' | 'radar' | 'ir_flash' | 'warning_flash' = 'idle';

      if (currentX >= w * 0.3 && currentX < w * 0.6) {
        currentState = 'radar';
        setSimStep(1);
      } else if (currentX >= w * 0.6 && currentX < w * 0.75) {
        currentState = 'ir_flash';
        setSimStep(2);
      } else if (currentX >= w * 0.8) {
        currentState = 'warning_flash';
        setSimStep(3);
      }

      drawCanvas(currentX, currentState);

      if (currentX < w + 60) {
        animFrameId.current = requestAnimationFrame(animate);
      } else {
        setSimRunning(false);
        setSimStep(0);
        setTimeout(() => drawCanvas(0, 'idle'), 800);
      }
    };

    animFrameId.current = requestAnimationFrame(animate);
  };

  return (
    <div className="space-y-6">
      {/* Section Intro Paragraph */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-3">
        <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center space-x-2">
          <span className="text-amber-500">■</span>
          <span>고속 차번 포착을 위한 속도별 이동 거리 및 하드웨어 동기화 시뮬레이터</span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          고속으로 주행하는 차량의 번호판을 모션 블러 없이 정확한 프레임 중앙에 포착하기 위해서는 카메라의 트리거 지연 시간(Trigger Latency)과 
          조명의 응답 속도, 그리고 레이더 신호 인입 간의 정밀 물리 계산이 필수적입니다. 
          본 도구를 통해 <strong className="text-slate-900 font-semibold">속도별 밀리초(ms) 단위 차량 이동 거리</strong>를 계산하고, 
          <strong className="text-slate-900 font-semibold">다단계 하드웨어 시퀀스(레이더 감지 → 카메라 IR 플래시 캡처 → 가시광선 경광등 점멸)</strong>를 시뮬레이션하십시오.
        </p>
      </div>

      {/* Physics Latency Calculator Card */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
        <div className="border-b border-slate-100 pb-3 flex flex-wrap items-center justify-between gap-2">
          <h3 className="font-bold text-sm text-slate-800 flex items-center space-x-1.5">
            <Sliders className="w-4 h-4 text-amber-500" />
            <span>차량 속도 & 트리거 지연시간(Latency)에 따른 포착 위치 이동 물리 계산기</span>
          </h3>
          <span className="text-xs font-mono bg-amber-100 text-amber-900 px-2 py-0.5 rounded font-bold">
            공식: 이동 거리 (m) = 주행속도 (m/s) × 지연시간 (s)
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
          {/* Sliders Controls */}
          <div className="space-y-4 text-xs">
            {/* Speed Slider */}
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-2">
              <div className="flex justify-between items-center font-bold">
                <span className="text-slate-700 flex items-center space-x-1.5">
                  <Gauge className="w-4 h-4 text-amber-600" />
                  <span>차량 주행 속도:</span>
                </span>
                <span className="text-amber-600 text-base font-mono font-black">{speedKm} km/h</span>
              </div>
              <input
                type="range"
                min="30"
                max="200"
                step="5"
                value={speedKm}
                onChange={(e) => setSpeedKm(Number(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>30 km/h (스쿨존)</span>
                <span>100 km/h (고속도로)</span>
                <span>200 km/h (초고속)</span>
              </div>
            </div>

            {/* Latency Slider */}
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-2">
              <div className="flex justify-between items-center font-bold">
                <span className="text-slate-700 flex items-center space-x-1.5">
                  <Sliders className="w-4 h-4 text-emerald-600" />
                  <span>트리거 & 셔터 누적 지연시간 (Latency):</span>
                </span>
                <span className="text-emerald-600 text-base font-mono font-black">{latencyMs} ms</span>
              </div>
              <input
                type="range"
                min="1"
                max="300"
                step="1"
                value={latencyMs}
                onChange={(e) => setLatencyMs(Number(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>1 ms (머신비전)</span>
                <span>50 ms (교통 LPR IP)</span>
                <span>300 ms (일반 웹 IP)</span>
              </div>
            </div>
          </div>

          {/* Result Calculation Card */}
          <div className="bg-slate-900 text-white p-5 rounded-xl space-y-3 font-mono border border-slate-800 shadow-inner">
            <div className="flex justify-between items-center text-xs border-b border-slate-800 pb-2">
              <span className="text-slate-400">초당 주행 거리 (m/s):</span>
              <span className="text-amber-400 font-bold text-sm">{mps.toFixed(2)} m/s</span>
            </div>
            <div className="flex justify-between items-center text-xs border-b border-slate-800 pb-2">
              <span className="text-slate-400">1 ms(밀리초) 당 이동 거리:</span>
              <span className="text-cyan-400 font-bold text-sm">{cmPerMs.toFixed(2)} cm</span>
            </div>
            <div className="bg-slate-800/90 p-3 rounded-lg text-center border border-slate-700">
              <span className="text-[11px] text-slate-400 block mb-1">설정된 지연시간({latencyMs}ms) 내 총 밀림 거리</span>
              <span className="text-3xl font-black text-rose-400 font-mono tracking-tight">
                {totalShiftM.toFixed(2)} m
              </span>
            </div>

            <div className="text-[11px] font-sans p-2 rounded bg-slate-950/80 border border-slate-800">
              {totalShiftM < 0.5 ? (
                <div className="flex items-center space-x-1.5 text-emerald-400">
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                  <span><strong>[최적 포착 구간]:</strong> 번호판이 화각 중앙 캡처 영역에 안정적으로 포착됩니다.</span>
                </div>
              ) : totalShiftM < 2.0 ? (
                <div className="flex items-center space-x-1.5 text-amber-400">
                  <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                  <span><strong>[약간 밀림 포착]:</strong> 화각 범위를 2m 이상 여유 있게 설정하고 셔터 스피드를 1/2000s 이하로 단축해야 합니다.</span>
                </div>
              ) : (
                <div className="flex items-center space-x-1.5 text-rose-400">
                  <ShieldAlert className="w-4 h-4 flex-shrink-0" />
                  <span><strong>[캡처 실패 위험]:</strong> 차량이 2m 이상 이탈하여 번호판 잘림 발생. 글로벌 셔터 또는 하드웨어 TTL 동기화가 필수적입니다.</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Trigger Sequence Timeline Simulator Card */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
        <div className="border-b border-slate-100 pb-3 flex flex-wrap items-center justify-between gap-2">
          <div>
            <h3 className="font-bold text-sm text-slate-800 flex items-center space-x-1.5">
              <Play className="w-4 h-4 text-rose-600" />
              <span>3단계 시퀀스 분리 동기화 로직 실시간 트랙 시뮬레이터</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              기계식 릴레이 지연(5~15ms)에 따른 셔터 미스매치를 방지하기 위한 SSR 초고속 IR 캡처 선작동 후 가시광선 경광등 점멸 시퀀스
            </p>
          </div>

          <button
            onClick={runSimulation}
            disabled={simRunning}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center space-x-1.5 shadow ${
              simRunning 
                ? 'bg-slate-300 text-slate-500 cursor-not-allowed' 
                : 'bg-rose-600 hover:bg-rose-500 text-white'
            }`}
          >
            {simRunning ? (
              <>
                <RotateCcw className="w-3.5 h-3.5 animate-spin" />
                <span>주행 중...</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5" />
                <span>과속 차량 진입 시뮬레이션 실행</span>
              </>
            )}
          </button>
        </div>

        {/* Dynamic Sequence Stepper Display */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs font-sans">
          
          <div className={`p-3 rounded-xl border transition-all ${
            simStep === 1 
              ? 'bg-blue-50 border-blue-400 ring-2 ring-blue-200 shadow-sm' 
              : 'bg-slate-50 border-slate-200'
          }`}>
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-bold text-slate-900">1단계: 레이더 과속 감지</span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                simStep === 1 ? 'bg-blue-600 text-white animate-pulse' : 'bg-slate-200 text-slate-600'
              }`}>
                {simStep === 1 ? '감지 활성' : '대기중'}
              </span>
            </div>
            <p className="text-slate-600 text-[11px] leading-snug">
              60m 전방에서 도플러 레이더가 설정 속도({speedKm}km/h) 초과 차량을 포착하고 즉시 무전압 반도체 SSR 신호를 발송합니다.
            </p>
          </div>

          <div className={`p-3 rounded-xl border transition-all ${
            simStep === 2 
              ? 'bg-emerald-50 border-emerald-400 ring-2 ring-emerald-200 shadow-sm' 
              : 'bg-slate-50 border-slate-200'
          }`}>
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-bold text-slate-900">2단계: TTL Sync & IR Flash</span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                simStep === 2 ? 'bg-emerald-600 text-white animate-pulse' : 'bg-slate-200 text-slate-600'
              }`}>
                {simStep === 2 ? '캡처 완료 (20µs)' : '대기중'}
              </span>
            </div>
            <p className="text-slate-600 text-[11px] leading-snug">
              SSR을 통해 20µs 이내에 카메라 전자식 셔터와 850nm/740nm IR 플래시가 정밀 동기화되어 선명한 번호판 이미지를 저장합니다.
            </p>
          </div>

          <div className={`p-3 rounded-xl border transition-all ${
            simStep === 3 
              ? 'bg-rose-50 border-rose-400 ring-2 ring-rose-200 shadow-sm' 
              : 'bg-slate-50 border-slate-200'
          }`}>
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-bold text-slate-900">3단계: 시각 경광등 구동</span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                simStep === 3 ? 'bg-rose-600 text-white animate-pulse' : 'bg-slate-200 text-slate-600'
              }`}>
                {simStep === 3 ? '적색 스트로보 점멸' : '대기중'}
              </span>
            </div>
            <p className="text-slate-600 text-[11px] leading-snug">
              번호판 캡처 완료 후 기계식 릴레이 접점이 닫히면서 DC 12V 2.5W 적색 스트로보가 강력 점멸하여 운전자에게 감속을 유도합니다.
            </p>
          </div>

        </div>

        {/* Animated Road Track Canvas */}
        <div className="relative w-full bg-slate-950 rounded-xl overflow-hidden border border-slate-800 shadow-inner">
          <canvas ref={canvasRef} className="w-full block" />
        </div>
      </div>

      {/* Standalone DC 12V Battery Autonomy Estimator Card */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
        <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
          <h3 className="font-bold text-sm text-slate-800 flex items-center space-x-1.5">
            <Battery className="w-4 h-4 text-cyan-600" />
            <span>[현장 필수 툴] DC 12V 태양광/배터리 자립 일수(Autonomy) 계산기</span>
          </h3>
          <span className="text-xs text-slate-500 font-mono">태양광 무충전 비상 연속 가동 보장 시간</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="space-y-1.5">
            <label className="text-slate-600 font-bold block">12V 배터리 용량 (Ah):</label>
            <input
              type="number"
              value={batteryAh}
              onChange={(e) => setBatteryAh(Math.max(10, Number(e.target.value)))}
              className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-1.5 font-mono text-slate-900 font-bold"
            />
            <span className="text-[10px] text-slate-400">일반 산업용 LiFePO4: 100Ah (1200Wh)</span>
          </div>

          <div className="space-y-1.5">
            <label className="text-slate-600 font-bold block">상시 대기 소비전력 (W):</label>
            <input
              type="number"
              value={standbyWatts}
              onChange={(e) => setStandbyWatts(Math.max(1, Number(e.target.value)))}
              className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-1.5 font-mono text-slate-900 font-bold"
            />
            <span className="text-[10px] text-slate-400">Dahua TiOC: ~7.8W, 한화LPR+모뎀: ~12W</span>
          </div>

          <div className="space-y-1.5">
            <label className="text-slate-600 font-bold block">일일 과속 단속 트리거 횟수:</label>
            <input
              type="number"
              value={triggersPerDay}
              onChange={(e) => setTriggersPerDay(Math.max(0, Number(e.target.value)))}
              className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-1.5 font-mono text-slate-900 font-bold"
            />
            <span className="text-[10px] text-slate-400">1일 평균 300회 경광등 점멸 기준</span>
          </div>
        </div>

        <div className="p-3 bg-cyan-50 border border-cyan-200 rounded-lg flex items-center justify-between text-xs font-mono">
          <div>
            <span className="text-cyan-900 font-bold block">연속 흐린 날(무일조) 자립 유지 일수:</span>
            <span className="text-[11px] text-cyan-800">일일 소비량: {totalDailyWh.toFixed(1)} Wh/day (방전심도 DoD 80% 안전 반영)</span>
          </div>
          <div className="text-right">
            <span className="text-2xl font-black text-cyan-700">{autonomousDays} 일</span>
            <span className="text-[10px] text-cyan-800 block">({(Number(autonomousDays) * 24).toFixed(0)} 시간 연속 동작)</span>
          </div>
        </div>
      </div>
    </div>
  );
};
