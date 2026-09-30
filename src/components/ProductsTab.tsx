import React, { useState, useMemo } from 'react';
import { ProductItem, ProductCategory } from '../types';
import { PRODUCTS_DATA } from '../data/products';
import {
  Search,
  Video,
  ShoppingCart,
  Info,
  X,
  CheckCircle,
  AlertCircle,
  CircleDot,
  Zap,
  ShieldAlert,
  Eye,
  SlidersHorizontal,
  RotateCcw,
  LayoutGrid,
  Table as TableIcon,
  Sparkles,
  ArrowUpDown,
  CheckSquare,
  Square,
  Maximize2,
  Compass,
  Thermometer,
  Droplets,
  Clock,
  Layers
} from 'lucide-react';

type SortOption =
  | 'DEFAULT'
  | 'DIAMETER_ASC'
  | 'DIAMETER_DESC'
  | 'POWER_ASC'
  | 'POWER_DESC'
  | 'PRICE_ASC'
  | 'PRICE_DESC';

type WavelengthFilter = 'ALL' | '740nm' | '850nm' | 'DUAL';
type WarningColorFilter = 'ALL' | 'WHITE' | 'RED' | 'SELECTABLE';
type SizeFilter = 'ALL' | 'SMALL' | 'MEDIUM' | 'LARGE'; // SMALL: <=120, MEDIUM: 150-165, LARGE: >=200
type PowerFilter = 'ALL' | 'LOW' | 'MEDIUM' | 'HIGH'; // LOW: <=15W, MEDIUM: 15-30W, HIGH: >30W
type ViewMode = 'table' | 'card';

interface TooltipData {
  product: ProductItem;
  x: number;
  y: number;
  placement: 'top' | 'bottom';
}

export const ProductsTab: React.FC = () => {
  // Category & Search
  const [activeCategory, setActiveCategory] = useState<ProductCategory>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Engineering Filters
  const [irFilter, setIrFilter] = useState<WavelengthFilter>('ALL');
  const [warningFilter, setWarningFilter] = useState<WarningColorFilter>('ALL');
  const [sizeFilter, setSizeFilter] = useState<SizeFilter>('ALL');
  const [powerFilter, setPowerFilter] = useState<PowerFilter>('ALL');

  // Sorting & View Mode
  const [sortOption, setSortOption] = useState<SortOption>('DEFAULT');
  const [viewMode, setViewMode] = useState<ViewMode>('table');

  // Modals & Comparison State
  const [selectedProduct, setSelectedProduct] = useState<ProductItem | null>(null);
  const [compareList, setCompareList] = useState<string[]>([]);
  const [showCompareModal, setShowCompareModal] = useState<boolean>(false);

  // Hover Tooltip State (배광 곡선, 발열량, 방수 등급 등 상세 스펙 툴팁)
  const [tooltipData, setTooltipData] = useState<TooltipData | null>(null);

  // Tooltip Handlers
  const handleMouseEnter = (product: ProductItem, e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom;
    const placement = spaceBelow < 380 ? 'top' : 'bottom';
    const width = 380;
    const centerX = rect.left + rect.width / 2;
    const x = Math.min(Math.max(16, centerX - width / 2), window.innerWidth - width - 16);
    const y = placement === 'bottom' ? rect.bottom + 8 : rect.top - 8;
    setTooltipData({ product, x, y, placement });
  };

  const handleMouseLeave = () => {
    setTooltipData(null);
  };

  // Check if any filter is active
  const isFiltered = useMemo(() => {
    return (
      activeCategory !== 'ALL' ||
      irFilter !== 'ALL' ||
      warningFilter !== 'ALL' ||
      sizeFilter !== 'ALL' ||
      powerFilter !== 'ALL' ||
      searchQuery.trim() !== '' ||
      sortOption !== 'DEFAULT'
    );
  }, [activeCategory, irFilter, warningFilter, sizeFilter, powerFilter, searchQuery, sortOption]);

  // Reset all filters
  const resetFilters = () => {
    setActiveCategory('ALL');
    setIrFilter('ALL');
    setWarningFilter('ALL');
    setSizeFilter('ALL');
    setPowerFilter('ALL');
    setSearchQuery('');
    setSortOption('DEFAULT');
  };

  // Quick Preset Handlers
  const applyPreset = (preset: 'solar' | 'whiteFlash' | 'redWarning' | 'ir740') => {
    resetFilters();
    if (preset === 'solar') {
      setPowerFilter('LOW');
      setSortOption('POWER_ASC');
    } else if (preset === 'whiteFlash') {
      setWarningFilter('WHITE');
      setIrFilter('850nm');
    } else if (preset === 'redWarning') {
      setWarningFilter('RED');
      setSizeFilter('MEDIUM');
    } else if (preset === 'ir740') {
      setIrFilter('740nm');
    }
  };

  // Compare Checkbox toggle
  const toggleCompare = (id: string) => {
    setCompareList(prev => {
      if (prev.includes(id)) {
        return prev.filter(item => item !== id);
      }
      if (prev.length >= 3) {
        alert('최대 3개 제품까지 비교할 수 있습니다.');
        return prev;
      }
      return [...prev, id];
    });
  };

  // Filter & Sort Logic
  const filteredAndSortedProducts = useMemo(() => {
    // 1. Filtering
    const result = PRODUCTS_DATA.filter(item => {
      // Category Filter
      if (activeCategory !== 'ALL' && item.category !== activeCategory) {
        return false;
      }

      // IR Wavelength Filter
      if (irFilter === '740nm') {
        if (item.irWavelengthBand !== '740nm' && item.irWavelengthBand !== 'DUAL') return false;
      } else if (irFilter === '850nm') {
        if (item.irWavelengthBand !== '850nm' && item.irWavelengthBand !== 'DUAL') return false;
      } else if (irFilter === 'DUAL') {
        if (item.irWavelengthBand !== 'DUAL') return false;
      }

      // Warning Visible Light Filter
      if (warningFilter === 'WHITE') {
        if (item.visWarningColor !== 'WHITE' && item.visWarningColor !== 'SELECTABLE') return false;
      } else if (warningFilter === 'RED') {
        if (item.visWarningColor !== 'RED' && item.visWarningColor !== 'SELECTABLE') return false;
      } else if (warningFilter === 'SELECTABLE') {
        if (item.visWarningColor !== 'SELECTABLE') return false;
      }

      // Size / Diameter Filter
      if (sizeFilter === 'SMALL') {
        if (item.numericDiameterMm > 120) return false;
      } else if (sizeFilter === 'MEDIUM') {
        if (item.numericDiameterMm < 150 || item.numericDiameterMm > 165) return false;
      } else if (sizeFilter === 'LARGE') {
        if (item.numericDiameterMm < 200) return false;
      }

      // Power / Wattage Filter
      if (powerFilter === 'LOW') {
        if (item.numericWattageW > 15) return false;
      } else if (powerFilter === 'MEDIUM') {
        if (item.numericWattageW <= 15 || item.numericWattageW > 30) return false;
      } else if (powerFilter === 'HIGH') {
        if (item.numericWattageW <= 30) return false;
      }

      // Search Query
      const q = searchQuery.trim().toLowerCase();
      if (q) {
        const matchesSearch =
          item.name.toLowerCase().includes(q) ||
          item.brand.toLowerCase().includes(q) ||
          item.type.toLowerCase().includes(q) ||
          item.diameter.toLowerCase().includes(q) ||
          item.irWavelength.toLowerCase().includes(q) ||
          item.visWavelength.toLowerCase().includes(q) ||
          item.price.toLowerCase().includes(q) ||
          item.wavelength.toLowerCase().includes(q) ||
          item.beamAngle.toLowerCase().includes(q) ||
          item.thermalManagement.toLowerCase().includes(q) ||
          item.protectionRating.toLowerCase().includes(q) ||
          item.desc.toLowerCase().includes(q);
        if (!matchesSearch) return false;
      }

      return true;
    });

    // 2. Sorting
    const sorted = [...result];
    switch (sortOption) {
      case 'DIAMETER_ASC':
        sorted.sort((a, b) => a.numericDiameterMm - b.numericDiameterMm);
        break;
      case 'DIAMETER_DESC':
        sorted.sort((a, b) => b.numericDiameterMm - a.numericDiameterMm);
        break;
      case 'POWER_ASC':
        sorted.sort((a, b) => a.numericWattageW - b.numericWattageW);
        break;
      case 'POWER_DESC':
        sorted.sort((a, b) => b.numericWattageW - a.numericWattageW);
        break;
      case 'PRICE_ASC':
        sorted.sort((a, b) => a.numericPriceKrw - b.numericPriceKrw);
        break;
      case 'PRICE_DESC':
        sorted.sort((a, b) => b.numericPriceKrw - a.numericPriceKrw);
        break;
      case 'DEFAULT':
      default:
        // maintain initial ordering
        break;
    }

    return sorted;
  }, [activeCategory, irFilter, warningFilter, sizeFilter, powerFilter, searchQuery, sortOption]);

  const compareProducts = useMemo(() => {
    return PRODUCTS_DATA.filter(p => compareList.includes(p.id));
  }, [compareList]);

  return (
    <div className="space-y-6">
      {/* Requirement Compliance Banner */}
      <div className="bg-slate-900 text-slate-100 p-5 rounded-xl border border-slate-800 shadow-md space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <h2 className="text-base sm:text-lg font-bold flex items-center space-x-2 text-white">
            <CircleDot className="w-5 h-5 text-amber-400 animate-pulse" />
            <span>원형(Circular) 지름 100mm 이상 · IR(740~850nm) 및 백색/적색 경고 하이브리드 제품군</span>
          </h2>
          <span className="bg-amber-500/20 text-amber-300 border border-amber-400/40 text-[11px] px-2.5 py-1 rounded-full font-bold">
            규격: 원형 Ø 100mm~200mm · IR: 740nm~850nm · 경고광: 백색(White) 또는 적색(Red)
          </span>
        </div>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          요청하신 물리적 및 광학적 조건에 부합하도록 <strong className="text-white">① 제품 외형이 원형(Circular)</strong>이고, 
          <strong className="text-amber-300"> ② 외경 지름이 100mm 이상(Ø100mm ~ Ø200mm)</strong>이며, 
          <strong className="text-white"> ③ 차번 식별용 IR 파장(740nm ~ 850nm)</strong> 및 
          <strong className="text-white"> 과속 시각 경고용 가시광선(백색 White 6000K 또는 적색 Red 620~630nm)</strong>을 탑재한 
          DC 12V 기반의 검증된 ITS 하이브리드 투광기 및 경광 제품군으로 구성되어 있습니다.
          <span className="text-amber-300 font-semibold block mt-1">
            ✨ 표와 카드 내 각 제품명 또는 [배광·발열·방수] 뱃지에 마우스를 올리시면(호버) 정밀 배광 곡선, 발열량 및 방열 기구, 방수/내구성 등급을 즉시 확인하실 수 있습니다.
          </span>
        </p>

        {/* Wavelength & Warning Matrix Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 pt-1 text-[11px]">
          <div className="bg-slate-800/80 p-2.5 rounded-lg border border-slate-700/60 flex items-start space-x-2">
            <CircleDot className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-slate-200 block">원형 외경 규격 (Ø 100mm 이상)</span>
              <span className="text-slate-400">Ø100mm 콤팩트부터 Ø120, Ø150, Ø160, Ø165, Ø200mm까지 풍하중 저감 및 전방위 배광 보장</span>
            </div>
          </div>
          <div className="bg-slate-800/80 p-2.5 rounded-lg border border-slate-700/60 flex items-start space-x-2">
            <Eye className="w-4 h-4 text-purple-400 flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-slate-200 block">IR 파장 (740nm ~ 850nm)</span>
              <span className="text-slate-400">740nm(딥레드, 센서 양자효율 82% 극대화) 및 850nm(야간 운전자 완전 무눈부심 표준 LPR)</span>
            </div>
          </div>
          <div className="bg-slate-800/80 p-2.5 rounded-lg border border-slate-700/60 flex items-start space-x-2">
            <ShieldAlert className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-slate-200 block">경고 가시광 (백색 / 적색)</span>
              <span className="text-slate-400">백색(White 6000K 20~30ms 고속 스트로보 채증) 및 적색(Red 625nm 심리적 제동 유도)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Primary Category Switcher */}
      <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between gap-3 text-xs overflow-x-auto">
        <div className="flex items-center space-x-1.5 flex-wrap gap-y-1.5">
          <span className="font-bold text-slate-500 mr-1 whitespace-nowrap flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>제품 카테고리:</span>
          </span>
          <button
            onClick={() => setActiveCategory('ALL')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-bold transition ${
              activeCategory === 'ALL' ? 'bg-slate-900 text-white shadow-sm' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            전체 원형 제품 ({PRODUCTS_DATA.length})
          </button>
          <button
            onClick={() => setActiveCategory('HYBRID')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-bold transition ${
              activeCategory === 'HYBRID' ? 'bg-purple-700 text-white shadow-sm' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            원형 복합 하이브리드 (IR+가시광)
          </button>
          <button
            onClick={() => setActiveCategory('IR_VIS_WHITE')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-bold transition ${
              activeCategory === 'IR_VIS_WHITE' ? 'bg-blue-700 text-white shadow-sm' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            원형 IR + 백색(White) 스트로보
          </button>
          <button
            onClick={() => setActiveCategory('IR_VIS_RED')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-bold transition ${
              activeCategory === 'IR_VIS_RED' ? 'bg-red-700 text-white shadow-sm' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            원형 IR + 적색(Red) 경광등
          </button>
          <button
            onClick={() => setActiveCategory('WARNING_ROUND')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-bold transition ${
              activeCategory === 'WARNING_ROUND' ? 'bg-amber-700 text-white shadow-sm' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            원형 Ø100mm+ 시각 경광등
          </button>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-lg border border-slate-200 flex-shrink-0">
          <button
            onClick={() => setViewMode('table')}
            title="상세 표 형태 보기"
            className={`p-1.5 rounded ${viewMode === 'table' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-500 hover:text-slate-800'}`}
          >
            <TableIcon className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('card')}
            title="카드 그리드 형태 보기"
            className={`p-1.5 rounded ${viewMode === 'card' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-500 hover:text-slate-800'}`}
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Advanced Engineering Filter & Sort Controls Panel */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 space-y-3.5">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 flex-wrap gap-2">
          <div className="flex items-center space-x-2">
            <SlidersHorizontal className="w-4 h-4 text-amber-600" />
            <h3 className="font-bold text-sm text-slate-900">엔지니어링 사양 필터 & 정렬 컨트롤</h3>
            <span className="text-[11px] text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full font-mono">
              파장 · 크기 · 소비전력 기준 맞춤 탐색
            </span>
          </div>

          {/* Quick Scenario Presets */}
          <div className="flex items-center space-x-1.5 text-[11px] flex-wrap gap-y-1">
            <span className="text-slate-400 font-semibold mr-1">추천 시나리오 프리셋:</span>
            <button
              onClick={() => applyPreset('solar')}
              className="bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 px-2 py-1 rounded font-bold transition flex items-center gap-1"
            >
              <Zap className="w-3 h-3 text-emerald-600" />
              <span>태양광 저전력(≤15W)</span>
            </button>
            <button
              onClick={() => applyPreset('whiteFlash')}
              className="bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200 px-2 py-1 rounded font-bold transition flex items-center gap-1"
            >
              <Eye className="w-3 h-3 text-blue-600" />
              <span>백색 스트로보(850nm+White)</span>
            </button>
            <button
              onClick={() => applyPreset('redWarning')}
              className="bg-red-50 hover:bg-red-100 text-red-800 border border-red-200 px-2 py-1 rounded font-bold transition flex items-center gap-1"
            >
              <ShieldAlert className="w-3 h-3 text-red-600" />
              <span>적색 감속 경고(Red)</span>
            </button>
            <button
              onClick={() => applyPreset('ir740')}
              className="bg-purple-50 hover:bg-purple-100 text-purple-800 border border-purple-200 px-2 py-1 rounded font-bold transition flex items-center gap-1"
            >
              <CircleDot className="w-3 h-3 text-purple-600" />
              <span>740nm 딥레드 고감도</span>
            </button>
          </div>
        </div>

        {/* 4 Core Control Selectors Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-xs">
          {/* 1. IR Wavelength Filter */}
          <div className="space-y-1">
            <label className="font-bold text-slate-700 flex items-center space-x-1">
              <Eye className="w-3.5 h-3.5 text-purple-600" />
              <span>① IR 파장 필터</span>
            </label>
            <select
              value={irFilter}
              onChange={(e) => setIrFilter(e.target.value as WavelengthFilter)}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-amber-500 focus:bg-white transition"
            >
              <option value="ALL">전체 IR 파장 (740~850nm)</option>
              <option value="740nm">740nm 전용 (딥레드/양자효율 82%)</option>
              <option value="850nm">850nm 전용 (비가시 무눈부심 표준)</option>
              <option value="DUAL">740/850nm 가변 및 릴레이 연동</option>
            </select>
          </div>

          {/* 2. Warning Light Color Filter */}
          <div className="space-y-1">
            <label className="font-bold text-slate-700 flex items-center space-x-1">
              <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
              <span>② 경고 가시광 필터</span>
            </label>
            <select
              value={warningFilter}
              onChange={(e) => setWarningFilter(e.target.value as WarningColorFilter)}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-amber-500 focus:bg-white transition"
            >
              <option value="ALL">전체 경고광 (백색 / 적색)</option>
              <option value="WHITE">백색 가시광 (White 6000K 스트로보)</option>
              <option value="RED">적색 가시광 (Red 625~630nm 경고등)</option>
              <option value="SELECTABLE">적색 / 백색 선택 옵션형</option>
            </select>
          </div>

          {/* 3. Size / Diameter Filter */}
          <div className="space-y-1">
            <label className="font-bold text-slate-700 flex items-center space-x-1">
              <CircleDot className="w-3.5 h-3.5 text-amber-600" />
              <span>③ 외경 크기 필터</span>
            </label>
            <select
              value={sizeFilter}
              onChange={(e) => setSizeFilter(e.target.value as SizeFilter)}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-amber-500 focus:bg-white transition"
            >
              <option value="ALL">전체 크기 (Ø100mm ~ Ø200mm)</option>
              <option value="SMALL">소형: Ø100mm ~ Ø120mm (하중 저감)</option>
              <option value="MEDIUM">중형: Ø150mm ~ Ø165mm (표준 규격)</option>
              <option value="LARGE">대형: Ø200mm (도로교통 표준 규격)</option>
            </select>
          </div>

          {/* 4. Power / Wattage Filter */}
          <div className="space-y-1">
            <label className="font-bold text-slate-700 flex items-center space-x-1">
              <Zap className="w-3.5 h-3.5 text-emerald-600" />
              <span>④ 출력 전력 필터</span>
            </label>
            <select
              value={powerFilter}
              onChange={(e) => setPowerFilter(e.target.value as PowerFilter)}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-amber-500 focus:bg-white transition"
            >
              <option value="ALL">전체 소비 전력</option>
              <option value="LOW">초저전력형 (≤ 15W 태양광 최적)</option>
              <option value="MEDIUM">표준 출력형 (15W ~ 30W)</option>
              <option value="HIGH">고출력형 (&gt; 30W 장거리 조사)</option>
            </select>
          </div>

          {/* 5. Sort By Control */}
          <div className="space-y-1">
            <label className="font-bold text-slate-700 flex items-center space-x-1">
              <ArrowUpDown className="w-3.5 h-3.5 text-blue-600" />
              <span>⑤ 정렬 기준 (Sort)</span>
            </label>
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value as SortOption)}
              className="w-full bg-amber-50/70 border border-amber-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 font-semibold focus:outline-none focus:border-amber-500 focus:bg-white transition"
            >
              <option value="DEFAULT">기본 추천순</option>
              <option value="DIAMETER_ASC">크기: 지름 작은 순 (Ø 100mm → 200mm)</option>
              <option value="DIAMETER_DESC">크기: 지름 큰 순 (Ø 200mm → 100mm)</option>
              <option value="POWER_ASC">전력: 소비전력 낮은 순 (6W → 36W)</option>
              <option value="POWER_DESC">전력: 소비전력 높은 순 (36W → 6W)</option>
              <option value="PRICE_ASC">가격: 판매가 낮은 순 (KRW ↑)</option>
              <option value="PRICE_DESC">가격: 판매가 높은 순 (KRW ↓)</option>
            </select>
          </div>
        </div>

        {/* Search, Active Filter Tags & Reset Action Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1 border-t border-slate-100 text-xs">
          {/* Search Box */}
          <div className="relative flex-grow max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="모델명, 지름, 740nm, 850nm, 배광각, 방열, IP67..."
              className="w-full bg-slate-50 border border-slate-300 rounded-lg pl-9 pr-3 py-1.5 text-xs focus:outline-none focus:border-amber-500 focus:bg-white transition"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Status Counter & Reset Button */}
          <div className="flex items-center space-x-2 justify-end flex-wrap gap-y-1">
            <span className="text-slate-600 font-medium">
              선택 결과: <strong className="text-amber-600 font-black">{filteredAndSortedProducts.length}</strong> / {PRODUCTS_DATA.length}개 제품
            </span>

            {isFiltered && (
              <button
                onClick={resetFilters}
                className="inline-flex items-center space-x-1 text-slate-600 hover:text-red-700 bg-slate-100 hover:bg-red-50 border border-slate-200 hover:border-red-200 px-2.5 py-1 rounded-lg font-bold transition text-[11px]"
              >
                <RotateCcw className="w-3 h-3 text-red-500" />
                <span>필터 초기화</span>
              </button>
            )}
          </div>
        </div>

        {/* Active Filter Chips */}
        {isFiltered && (
          <div className="flex items-center flex-wrap gap-1.5 pt-1 text-[11px]">
            <span className="text-slate-400 font-semibold mr-1">적용된 조건:</span>
            {activeCategory !== 'ALL' && (
              <span className="bg-slate-100 text-slate-700 border border-slate-200 px-2 py-0.5 rounded-full flex items-center gap-1 font-medium">
                분류: {activeCategory}
                <button onClick={() => setActiveCategory('ALL')} className="hover:text-red-600"><X className="w-3 h-3" /></button>
              </span>
            )}
            {irFilter !== 'ALL' && (
              <span className="bg-purple-50 text-purple-800 border border-purple-200 px-2 py-0.5 rounded-full flex items-center gap-1 font-medium">
                IR: {irFilter}
                <button onClick={() => setIrFilter('ALL')} className="hover:text-red-600"><X className="w-3 h-3" /></button>
              </span>
            )}
            {warningFilter !== 'ALL' && (
              <span className="bg-amber-50 text-amber-900 border border-amber-200 px-2 py-0.5 rounded-full flex items-center gap-1 font-medium">
                경고광: {warningFilter === 'WHITE' ? '백색(White)' : warningFilter === 'RED' ? '적색(Red)' : '선택형'}
                <button onClick={() => setWarningFilter('ALL')} className="hover:text-red-600"><X className="w-3 h-3" /></button>
              </span>
            )}
            {sizeFilter !== 'ALL' && (
              <span className="bg-blue-50 text-blue-800 border border-blue-200 px-2 py-0.5 rounded-full flex items-center gap-1 font-medium">
                크기: {sizeFilter === 'SMALL' ? 'Ø100~120mm' : sizeFilter === 'MEDIUM' ? 'Ø150~165mm' : 'Ø200mm'}
                <button onClick={() => setSizeFilter('ALL')} className="hover:text-red-600"><X className="w-3 h-3" /></button>
              </span>
            )}
            {powerFilter !== 'ALL' && (
              <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-full flex items-center gap-1 font-medium">
                전력: {powerFilter === 'LOW' ? '≤15W(저전력)' : powerFilter === 'MEDIUM' ? '15~30W(표준)' : '>30W(고출력)'}
                <button onClick={() => setPowerFilter('ALL')} className="hover:text-red-600"><X className="w-3 h-3" /></button>
              </span>
            )}
            {sortOption !== 'DEFAULT' && (
              <span className="bg-amber-100/70 text-amber-900 border border-amber-300 px-2 py-0.5 rounded-full flex items-center gap-1 font-medium">
                정렬: {sortOption.replace('_', ' ')}
                <button onClick={() => setSortOption('DEFAULT')} className="hover:text-red-600"><X className="w-3 h-3" /></button>
              </span>
            )}
          </div>
        )}
      </div>

      {/* View Mode 1: Products Matrix Table View */}
      {viewMode === 'table' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-900 text-slate-100 border-b border-slate-800">
                  <th className="p-3 font-bold w-10 text-center">비교</th>
                  <th className="p-3 font-bold min-w-[190px]">제품명 / 제조사 (호버 툴팁)</th>
                  <th className="p-3 font-bold min-w-[130px] text-amber-300">
                    <button
                      onClick={() => setSortOption(prev => prev === 'DIAMETER_ASC' ? 'DIAMETER_DESC' : 'DIAMETER_ASC')}
                      className="hover:underline flex items-center gap-1"
                      title="지름 크기 정렬 전환"
                    >
                      <span>외형 및 외경 지름</span>
                      <ArrowUpDown className="w-3 h-3 inline" />
                    </button>
                  </th>
                  <th className="p-3 font-bold min-w-[125px] text-purple-300">IR 파장 (740~850nm)</th>
                  <th className="p-3 font-bold min-w-[130px] text-amber-400">경고 가시광 (백색/적색)</th>
                  <th className="p-3 font-bold min-w-[120px]">
                    <button
                      onClick={() => setSortOption(prev => prev === 'POWER_ASC' ? 'POWER_DESC' : 'POWER_ASC')}
                      className="hover:underline flex items-center gap-1 text-emerald-300"
                      title="소비 전력 정렬 전환"
                    >
                      <span>소비 전력 / 전원</span>
                      <ArrowUpDown className="w-3 h-3 inline" />
                    </button>
                  </th>
                  <th className="p-3 font-bold min-w-[120px] text-emerald-400">
                    <button
                      onClick={() => setSortOption(prev => prev === 'PRICE_ASC' ? 'PRICE_DESC' : 'PRICE_ASC')}
                      className="hover:underline flex items-center gap-1"
                      title="판매 가격 정렬 전환"
                    >
                      <span>판매 가격 (KRW)</span>
                      <ArrowUpDown className="w-3 h-3 inline" />
                    </button>
                  </th>
                  <th className="p-3 font-bold text-center min-w-[175px]">바로가기 (영상/구매/상세)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-slate-700">
                {filteredAndSortedProducts.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="p-12 text-center text-slate-400">
                      <div className="flex flex-col items-center justify-center space-y-2">
                        <AlertCircle className="w-8 h-8 text-slate-300" />
                        <span className="font-medium text-sm">설정하신 필터 및 검색 조건에 일치하는 제품이 없습니다.</span>
                        <button
                          onClick={resetFilters}
                          className="mt-2 text-xs bg-slate-900 text-white px-3 py-1.5 rounded-lg hover:bg-slate-800 transition"
                        >
                          필터 전체 초기화
                        </button>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredAndSortedProducts.map((item) => (
                    <tr
                      key={item.id}
                      className={`hover:bg-amber-50/40 transition ${
                        compareList.includes(item.id) ? 'bg-amber-50/70 border-l-4 border-l-amber-500' : ''
                      }`}
                    >
                      {/* Compare Checkbox */}
                      <td className="p-3 text-center">
                        <button
                          onClick={() => toggleCompare(item.id)}
                          className="text-slate-400 hover:text-amber-600 focus:outline-none"
                          title="비교 목록에 추가/제거"
                        >
                          {compareList.includes(item.id) ? (
                            <CheckSquare className="w-4 h-4 text-amber-600" />
                          ) : (
                            <Square className="w-4 h-4" />
                          )}
                        </button>
                      </td>

                      {/* Product Name & Brand with Hover Tooltip Trigger */}
                      <td className="p-3">
                        <div
                          onMouseEnter={(e) => handleMouseEnter(item, e)}
                          onMouseLeave={handleMouseLeave}
                          className="cursor-pointer group/item hover:opacity-95"
                        >
                          <div className="font-bold text-slate-900 text-xs group-hover/item:text-amber-700 transition flex items-center gap-1.5">
                            <span>{item.name}</span>
                          </div>
                          <div className="text-[10px] text-slate-500 flex items-center justify-between mt-0.5">
                            <span>{item.brand}</span>
                          </div>

                          {/* Hover Spec Quick Badge */}
                          <div className="mt-1 flex items-center space-x-1.5 flex-wrap gap-y-1">
                            <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${
                              item.category === 'HYBRID' ? 'bg-purple-100 text-purple-800' :
                              item.category === 'IR_VIS_WHITE' ? 'bg-blue-100 text-blue-800' :
                              item.category === 'IR_VIS_RED' ? 'bg-red-100 text-red-800' :
                              'bg-amber-100 text-amber-800'
                            }`}>
                              {item.type}
                            </span>
                            <span className="inline-flex items-center text-[9px] text-slate-600 bg-slate-100 hover:bg-amber-100 border border-slate-200 px-1.5 py-0.5 rounded font-medium transition gap-1">
                              <Layers className="w-2.5 h-2.5 text-amber-600" />
                              <span>배광·발열·방수 툴팁</span>
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Diameter & Shape */}
                      <td className="p-3">
                        <div className="inline-flex items-center space-x-1 bg-amber-50 text-amber-950 border border-amber-200 font-black px-2 py-0.5 rounded text-[11px]">
                          <CircleDot className="w-3.5 h-3.5 text-amber-600" />
                          <span>{item.diameter}</span>
                        </div>
                        <div className="text-[10px] text-slate-400 mt-0.5">{item.shape}</div>
                      </td>

                      {/* IR Wavelength */}
                      <td className="p-3">
                        <div className="font-mono font-bold text-purple-900 bg-purple-50 border border-purple-200 px-2 py-0.5 rounded text-[11px] inline-block">
                          {item.irWavelength}
                        </div>
                        <div className="text-[10px] text-slate-500 mt-1">유효거리: {item.range}</div>
                      </td>

                      {/* Visible Warning Wavelength */}
                      <td className="p-3">
                        <div className={`font-bold px-2 py-0.5 rounded text-[11px] inline-block ${
                          item.visWarningColor === 'RED'
                            ? 'bg-red-50 text-red-900 border border-red-200'
                            : item.visWarningColor === 'WHITE'
                            ? 'bg-blue-50 text-blue-900 border border-blue-200'
                            : 'bg-amber-50 text-amber-900 border border-amber-200'
                        }`}>
                          {item.visWavelength}
                        </div>
                        <div className="text-[10px] text-slate-400 mt-1">{item.driving}</div>
                      </td>

                      {/* Power / Wattage */}
                      <td className="p-3 font-mono">
                        <div className="flex items-center space-x-1">
                          <Zap className="w-3 h-3 text-emerald-600" />
                          <span className="text-emerald-700 font-bold block">{item.power}</span>
                        </div>
                        <span className="text-[10px] text-slate-600 font-medium block">
                          소비전력: <strong className="text-slate-900">{item.numericWattageW}W</strong>
                        </span>
                      </td>

                      {/* Price */}
                      <td className="p-3 font-mono font-bold text-slate-900 whitespace-nowrap">
                        {item.price}
                      </td>

                      {/* Actions */}
                      <td className="p-3 text-center">
                        <div className="flex items-center justify-center space-x-1.5">
                          <a
                            href={item.youtubeUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            title="유튜브 소개/시연 영상 보기"
                            className="bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 font-bold px-2 py-1 rounded text-[11px] transition flex items-center space-x-1"
                          >
                            <Video className="w-3 h-3 text-red-600" />
                            <span>영상</span>
                          </a>
                          <a
                            href={item.buyUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            title="스토어에서 구매하기"
                            className="bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 font-bold px-2 py-1 rounded text-[11px] transition flex items-center space-x-1"
                          >
                            <ShoppingCart className="w-3 h-3 text-emerald-600" />
                            <span>구매</span>
                          </a>
                          <button
                            onClick={() => setSelectedProduct(item)}
                            className="bg-slate-800 hover:bg-slate-700 text-white font-bold px-2.5 py-1 rounded text-[11px] transition flex items-center space-x-1"
                          >
                            <Info className="w-3 h-3" />
                            <span>상세</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* View Mode 2: Card Grid View */}
      {viewMode === 'card' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAndSortedProducts.length === 0 ? (
            <div className="col-span-full bg-white p-12 rounded-xl border border-slate-200 text-center text-slate-400">
              <AlertCircle className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <span>설정하신 필터 및 검색 조건에 일치하는 제품이 없습니다.</span>
            </div>
          ) : (
            filteredAndSortedProducts.map((item) => (
              <div
                key={item.id}
                className={`bg-white rounded-xl border transition shadow-sm hover:shadow-md flex flex-col justify-between overflow-hidden ${
                  compareList.includes(item.id) ? 'border-amber-500 ring-2 ring-amber-400/40' : 'border-slate-200'
                }`}
              >
                {/* Card Top Header */}
                <div className="p-4 border-b border-slate-100 bg-slate-50/50">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] text-slate-500 font-semibold">{item.brand}</span>
                    <button
                      onClick={() => toggleCompare(item.id)}
                      className="text-xs text-slate-400 hover:text-amber-600 flex items-center space-x-1"
                    >
                      {compareList.includes(item.id) ? (
                        <>
                          <CheckSquare className="w-3.5 h-3.5 text-amber-600" />
                          <span className="text-amber-700 font-bold text-[10px]">비교 선택됨</span>
                        </>
                      ) : (
                        <>
                          <Square className="w-3.5 h-3.5" />
                          <span className="text-[10px]">비교 담기</span>
                        </>
                      )}
                    </button>
                  </div>
                  <h4
                    onMouseEnter={(e) => handleMouseEnter(item, e)}
                    onMouseLeave={handleMouseLeave}
                    className="font-bold text-slate-900 text-sm leading-snug hover:text-amber-700 cursor-pointer transition flex items-center justify-between"
                  >
                    <span>{item.name}</span>
                  </h4>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="inline-flex items-center space-x-1 bg-amber-50 text-amber-950 border border-amber-200 font-black px-2 py-0.5 rounded text-[11px]">
                      <CircleDot className="w-3.5 h-3.5 text-amber-600" />
                      <span>{item.diameter}</span>
                    </span>
                    <span className="font-mono font-black text-slate-900 text-xs">{item.price}</span>
                  </div>
                </div>

                {/* Card Body Specs */}
                <div className="p-4 space-y-3 text-xs flex-grow">
                  {/* Wavelength badges */}
                  <div className="space-y-1.5 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 text-[10px] flex items-center gap-1">
                        <Eye className="w-3 h-3 text-purple-600" />
                        <span>IR 파장:</span>
                      </span>
                      <span className="font-mono font-bold text-purple-950 text-[11px]">{item.irWavelengthBand}</span>
                    </div>
                    <div className="text-[11px] text-slate-700 truncate" title={item.irWavelength}>
                      {item.irWavelength}
                    </div>

                    <div className="pt-1 border-t border-slate-200 flex items-center justify-between">
                      <span className="text-slate-500 text-[10px] flex items-center gap-1">
                        <ShieldAlert className="w-3 h-3 text-amber-600" />
                        <span>경고 가시광:</span>
                      </span>
                      <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                        item.visWarningColor === 'RED' ? 'bg-red-100 text-red-800' :
                        item.visWarningColor === 'WHITE' ? 'bg-blue-100 text-blue-800' :
                        'bg-amber-100 text-amber-800'
                      }`}>
                        {item.visWarningColor === 'WHITE' ? '백색 플래시' : item.visWarningColor === 'RED' ? '적색 경고등' : '선택 가능'}
                      </span>
                    </div>
                  </div>

                  {/* Power & Range */}
                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <div className="bg-slate-50 p-2 rounded border border-slate-100">
                      <span className="text-slate-400 block text-[9px]">소비 전력</span>
                      <strong className="text-emerald-700 font-bold">{item.numericWattageW}W ({item.power.split(' ')[0]})</strong>
                    </div>
                    <div className="bg-slate-50 p-2 rounded border border-slate-100">
                      <span className="text-slate-400 block text-[9px]">식별/시인 거리</span>
                      <strong className="text-slate-800 font-bold">{item.range.split('/')[0]}</strong>
                    </div>
                  </div>

                  {/* Interactive Spec Hover Trigger Bar */}
                  <div
                    onMouseEnter={(e) => handleMouseEnter(item, e)}
                    onMouseLeave={handleMouseLeave}
                    className="bg-amber-50/70 hover:bg-amber-100/90 border border-amber-200 text-amber-950 p-2 rounded-lg transition cursor-pointer flex items-center justify-between text-[11px]"
                  >
                    <div className="flex items-center space-x-1.5 font-bold">
                      <Layers className="w-3.5 h-3.5 text-amber-700" />
                      <span>배광 곡선 · 발열량 · 방수 등급</span>
                    </div>
                    <span className="text-[10px] text-amber-800 font-semibold">호버 툴팁 보기 🔍</span>
                  </div>

                  <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed">
                    {item.desc}
                  </p>
                </div>

                {/* Card Footer Actions */}
                <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-1 text-[11px]">
                  <div className="flex space-x-1">
                    <a
                      href={item.youtubeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 px-2 py-1 rounded font-bold transition flex items-center gap-1"
                    >
                      <Video className="w-3 h-3" />
                      <span>영상</span>
                    </a>
                    <a
                      href={item.buyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 px-2 py-1 rounded font-bold transition flex items-center gap-1"
                    >
                      <ShoppingCart className="w-3 h-3" />
                      <span>구매</span>
                    </a>
                  </div>
                  <button
                    onClick={() => setSelectedProduct(item)}
                    className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-2.5 py-1 rounded transition flex items-center gap-1"
                  >
                    <Info className="w-3 h-3" />
                    <span>상세보기</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Floating Dynamic Spec Hover Tooltip (배광 곡선, 발열량, 방수 등급 상세) */}
      {tooltipData && (
        <div
          style={{
            position: 'fixed',
            left: `${tooltipData.x}px`,
            top: tooltipData.placement === 'bottom' ? `${tooltipData.y}px` : undefined,
            bottom: tooltipData.placement === 'top' ? `${window.innerHeight - tooltipData.y}px` : undefined,
            width: '380px',
            zIndex: 9999,
          }}
          className="pointer-events-none bg-slate-950/95 backdrop-blur-md text-slate-100 border border-slate-700 rounded-xl shadow-2xl p-4 space-y-3 animate-in fade-in zoom-in-95 duration-100"
        >
          {/* Tooltip Header */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <div>
              <span className="text-[10px] font-mono text-amber-400 font-bold block">{tooltipData.product.brand}</span>
              <h4 className="text-xs font-bold text-white line-clamp-1">{tooltipData.product.name}</h4>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold">
              {tooltipData.product.diameter}
            </span>
          </div>

          {/* Spec 1: 배광 곡선 및 조사 각도 (Beam Angle & Light Distribution) */}
          <div className="bg-slate-900/90 rounded-lg p-2.5 border border-amber-500/30 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-amber-300 flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-amber-400" />
                <span>광학 배광 곡선 & 조사 각도</span>
              </span>
              <span className="text-[9px] bg-amber-400/20 text-amber-200 px-1.5 py-0.2 rounded font-mono font-bold">
                광학 렌즈 배광
              </span>
            </div>
            <p className="text-[11px] text-slate-200 leading-snug">
              {tooltipData.product.beamAngle}
            </p>
          </div>

          {/* Spec 2: 발열량 및 방열 설계 (Thermal Dissipation & Heat Sink) */}
          <div className="bg-slate-900/90 rounded-lg p-2.5 border border-red-500/30 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-red-300 flex items-center gap-1.5">
                <Thermometer className="w-3.5 h-3.5 text-red-400" />
                <span>발열량 & 방열 구조 (Heat Sink)</span>
              </span>
              <span className="text-[9px] bg-red-400/20 text-red-200 px-1.5 py-0.2 rounded font-mono font-bold">
                {tooltipData.product.numericWattageW <= 15 ? '초저발열형' : tooltipData.product.numericWattageW <= 25 ? '표준 방열' : '고효율 핀 방열'}
              </span>
            </div>
            <p className="text-[11px] text-slate-200 leading-snug">
              {tooltipData.product.thermalManagement}
            </p>
          </div>

          {/* Spec 3: 방수방진 및 기계적 내구성 (Protection & Durability) */}
          <div className="bg-slate-900/90 rounded-lg p-2.5 border border-sky-500/30 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-sky-300 flex items-center gap-1.5">
                <Droplets className="w-3.5 h-3.5 text-sky-400" />
                <span>방수방진 & 기계적 충격 등급</span>
              </span>
              <span className="text-[9px] bg-sky-400/20 text-sky-200 px-1.5 py-0.2 rounded font-mono font-bold">
                {tooltipData.product.ip}
              </span>
            </div>
            <p className="text-[11px] text-slate-200 leading-snug">
              {tooltipData.product.protectionRating}
            </p>
          </div>

          {/* Spec 4: LED 수명 & 권장 설치 사양 */}
          <div className="grid grid-cols-2 gap-2 text-[10px] pt-0.5">
            <div className="bg-slate-900/60 p-1.5 rounded border border-slate-800">
              <span className="text-slate-400 flex items-center gap-1">
                <Clock className="w-3 h-3 text-emerald-400" />
                <span>LED 광원 수명</span>
              </span>
              <strong className="text-emerald-300 block truncate mt-0.5">{tooltipData.product.lifespan}</strong>
            </div>
            <div className="bg-slate-900/60 p-1.5 rounded border border-slate-800">
              <span className="text-slate-400 flex items-center gap-1">
                <CircleDot className="w-3 h-3 text-purple-400" />
                <span>권장 설치 사양</span>
              </span>
              <strong className="text-purple-300 block truncate mt-0.5">{tooltipData.product.recommendedMount}</strong>
            </div>
          </div>

          <div className="text-[9px] text-slate-400 text-center pt-1 border-t border-slate-800/80">
            💡 클릭 시 전체 세부 사양, 결선도 및 추천 시나리오 확인
          </div>
        </div>
      )}

      {/* Floating Compare Action Bar (Shown when products are selected for comparison) */}
      {compareList.length > 0 && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-40 bg-slate-900 text-white px-5 py-3 rounded-full shadow-2xl border border-slate-700 flex items-center space-x-4 animate-in slide-in-from-bottom-5">
          <div className="flex items-center space-x-2">
            <span className="bg-amber-500 text-slate-950 font-black text-xs w-5 h-5 rounded-full flex items-center justify-center">
              {compareList.length}
            </span>
            <span className="text-xs font-bold">개 제품 비교 선택됨 (최대 3개)</span>
          </div>

          <button
            onClick={() => setShowCompareModal(true)}
            className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold px-3.5 py-1.5 rounded-full text-xs transition flex items-center space-x-1.5 shadow"
          >
            <Maximize2 className="w-3.5 h-3.5" />
            <span>1:1 스펙 대조 비교하기</span>
          </button>

          <button
            onClick={() => setCompareList([])}
            className="text-slate-400 hover:text-white text-xs underline"
          >
            선택 해제
          </button>
        </div>
      )}

      {/* 1:1 Comparison Modal */}
      {showCompareModal && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-4xl w-full overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <SlidersHorizontal className="w-5 h-5 text-amber-400" />
                <h3 className="font-bold text-sm sm:text-base">선택 제품 1:1 엔지니어링 스펙 정밀 비교</h3>
              </div>
              <button
                onClick={() => setShowCompareModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 overflow-x-auto overflow-y-auto">
              <table className="w-full text-xs text-left border-collapse border border-slate-200">
                <thead>
                  <tr className="bg-slate-100">
                    <th className="p-3 border border-slate-200 font-bold text-slate-700 w-36">비교 항목</th>
                    {compareProducts.map(p => (
                      <th key={p.id} className="p-3 border border-slate-200 font-bold text-slate-900 min-w-[200px]">
                        <div className="text-amber-700 text-[10px]">{p.brand}</div>
                        <div className="text-sm font-black">{p.name}</div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-slate-800">
                  <tr>
                    <td className="p-2.5 font-bold bg-slate-50 border border-slate-200 text-amber-950">
                      외형 및 외경 지름 (Ø)
                    </td>
                    {compareProducts.map(p => (
                      <td key={p.id} className="p-2.5 border border-slate-200 font-bold text-amber-900">
                        {p.diameter} ({p.shape})
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold bg-slate-50 border border-slate-200 text-purple-950">
                      IR 광원 파장
                    </td>
                    {compareProducts.map(p => (
                      <td key={p.id} className="p-2.5 border border-slate-200 font-mono font-bold text-purple-900">
                        {p.irWavelength}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold bg-slate-50 border border-slate-200 text-red-950">
                      과속 경고 가시광선
                    </td>
                    {compareProducts.map(p => (
                      <td key={p.id} className="p-2.5 border border-slate-200 font-bold">
                        {p.visWavelength}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold bg-amber-50 border border-slate-200 text-amber-950">
                      배광 곡선 및 조사 각도
                    </td>
                    {compareProducts.map(p => (
                      <td key={p.id} className="p-2.5 border border-slate-200 text-[11px] text-amber-950 font-medium">
                        {p.beamAngle}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold bg-red-50 border border-slate-200 text-red-950">
                      발열량 및 방열 구조
                    </td>
                    {compareProducts.map(p => (
                      <td key={p.id} className="p-2.5 border border-slate-200 text-[11px] text-red-950">
                        {p.thermalManagement}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold bg-sky-50 border border-slate-200 text-sky-950">
                      방수방진 & 내구성 등급
                    </td>
                    {compareProducts.map(p => (
                      <td key={p.id} className="p-2.5 border border-slate-200 text-[11px] text-sky-950 font-bold">
                        {p.protectionRating}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold bg-slate-50 border border-slate-200 text-emerald-950">
                      소비 전력 & 전원
                    </td>
                    {compareProducts.map(p => (
                      <td key={p.id} className="p-2.5 border border-slate-200 font-mono">
                        <strong className="text-emerald-700">{p.numericWattageW}W</strong> / {p.power}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold bg-slate-50 border border-slate-200">
                      식별 및 시인 거리
                    </td>
                    {compareProducts.map(p => (
                      <td key={p.id} className="p-2.5 border border-slate-200">
                        {p.range}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold bg-slate-50 border border-slate-200">
                      트리거 및 연동 방식
                    </td>
                    {compareProducts.map(p => (
                      <td key={p.id} className="p-2.5 border border-slate-200 text-[11px]">
                        {p.driving}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold bg-slate-50 border border-slate-200">
                      광원 수명 및 권장 설치
                    </td>
                    {compareProducts.map(p => (
                      <td key={p.id} className="p-2.5 border border-slate-200 text-[11px]">
                        <div>수명: {p.lifespan}</div>
                        <div className="text-slate-500 mt-0.5">설치: {p.recommendedMount}</div>
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold bg-slate-50 border border-slate-200">
                      판매 가격
                    </td>
                    {compareProducts.map(p => (
                      <td key={p.id} className="p-2.5 border border-slate-200 font-bold text-slate-900">
                        {p.price}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold bg-slate-50 border border-slate-200 text-emerald-900">
                      추천 적용 시나리오
                    </td>
                    {compareProducts.map(p => (
                      <td key={p.id} className="p-2.5 border border-slate-200 text-[11px] text-slate-600 leading-relaxed">
                        {p.recommendedScenario}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold bg-slate-50 border border-slate-200">
                      바로가기 링크
                    </td>
                    {compareProducts.map(p => (
                      <td key={p.id} className="p-2.5 border border-slate-200">
                        <div className="flex space-x-1.5">
                          <a
                            href={p.youtubeUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 px-2 py-0.5 rounded font-bold text-[10px]"
                          >
                            유튜브 영상
                          </a>
                          <a
                            href={p.buyUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 px-2 py-0.5 rounded font-bold text-[10px]"
                          >
                            구매 스토어
                          </a>
                        </div>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="p-3 bg-slate-50 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setShowCompareModal(false)}
                className="bg-slate-900 hover:bg-slate-800 text-white font-bold py-1.5 px-4 rounded text-xs transition"
              >
                창 닫기
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Engineering Design Insights Card */}
      <div className="bg-amber-50/90 border border-amber-200 p-4 rounded-xl text-xs text-amber-950 flex items-start space-x-3">
        <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
        <div className="space-y-1.5">
          <span className="font-bold text-amber-950 text-sm">원형(Circular Ø100mm 이상) 및 파장(740~850nm / 백색·적색) 엔지니어링 분석:</span>
          <p className="leading-relaxed text-amber-900">
            <strong>1. 원형 지름 100mm 이상 규격 채택 이유:</strong><br/>
            - <strong>풍하중(Wind Load) 감소:</strong> 사각형 투광기 대비 원형 베젤은 바람 저항 계수(Drag Coefficient)가 30% 이상 낮아 지주 폴대 흔들림을 방지합니다.<br/>
            - <strong>광학 대칭성:</strong> 원형 렌즈/리플렉터는 방사형으로 고른 원형 배광 패턴을 형성하여 차로 진입각에 구애받지 않고 일관된 조도를 제공합니다.<br/>
            <strong>2. 배광 곡선 · 발열량 · 방수 등급 평가 핵심:</strong><br/>
            - <strong>배광 곡선(Beam Profile):</strong> 원거리 번호판 집중 조사(20°~35°)와 운전자 과속 경고 가시광(45°~360° 광각)이 분리 또는 복합 배광되어야 불필요한 광손실을 막습니다.<br/>
            - <strong>발열량 및 방열 기구:</strong> 야간 상시 점등 시 12V 배터리 효율과 LED 수명을 위해 알루미늄 다이캐스팅 핀 구조나 과열 자동 감온 회로(SafeContour)가 필수적입니다.<br/>
            - <strong>방수방진(IP66/IP67):</strong> 지주 폴대 옥외 설치 환경에서 폭우, 태풍, 결로 현상을 원천 방지하기 위해 이중 O-링 및 고어텍스 벤트가 적용됩니다.
          </p>
        </div>
      </div>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-xl w-full overflow-hidden shadow-2xl flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
              <div>
                <span className="text-[10px] text-amber-400 font-mono block">{selectedProduct.brand}</span>
                <h3 className="font-bold text-sm sm:text-base leading-tight">{selectedProduct.name}</h3>
              </div>
              <button
                onClick={() => setSelectedProduct(null)}
                className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 overflow-y-auto space-y-4 text-xs text-slate-700">
              {/* Diameter & Shape Highlight */}
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <CircleDot className="w-5 h-5 text-amber-600" />
                  <div>
                    <span className="text-[10px] text-amber-800 font-bold block">원형 외형 및 외경 지름 (요청 규격 준수)</span>
                    <span className="text-xs font-black text-amber-950">{selectedProduct.shape} · {selectedProduct.diameter}</span>
                  </div>
                </div>
                <span className="text-base font-black text-amber-700 font-mono">{selectedProduct.price}</span>
              </div>

              {/* Optical Wavelength Highlighting */}
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-purple-50 p-2.5 rounded-lg border border-purple-200">
                  <div className="flex items-center space-x-1.5 text-purple-900 font-bold mb-1">
                    <Eye className="w-3.5 h-3.5 text-purple-700" />
                    <span>IR 파장 (740 ~ 850nm)</span>
                  </div>
                  <div className="text-xs font-bold text-purple-950">{selectedProduct.irWavelength}</div>
                </div>
                <div className="bg-amber-50 p-2.5 rounded-lg border border-amber-200">
                  <div className="flex items-center space-x-1.5 text-amber-900 font-bold mb-1">
                    <ShieldAlert className="w-3.5 h-3.5 text-amber-700" />
                    <span>경고 가시광 (백색 / 적색)</span>
                  </div>
                  <div className="text-xs font-bold text-amber-950">{selectedProduct.visWavelength}</div>
                </div>
              </div>

              {/* Engineering Deep Specs (배광 곡선, 발열량, 방수 등급) */}
              <div className="space-y-2 bg-slate-900 text-slate-100 p-3.5 rounded-xl border border-slate-800">
                <div className="text-[11px] font-bold text-amber-400 flex items-center gap-1.5 mb-1">
                  <Layers className="w-3.5 h-3.5 text-amber-400" />
                  <span>핵심 엔지니어링 광학 및 환경 내구성 사양:</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px]">
                  <div className="bg-slate-800/90 p-2.5 rounded-lg border border-slate-700">
                    <span className="text-amber-300 font-bold block flex items-center gap-1 mb-1">
                      <Compass className="w-3 h-3 text-amber-400" />
                      배광 곡선 & 각도
                    </span>
                    <p className="text-[10px] text-slate-300 leading-tight">{selectedProduct.beamAngle}</p>
                  </div>

                  <div className="bg-slate-800/90 p-2.5 rounded-lg border border-slate-700">
                    <span className="text-red-300 font-bold block flex items-center gap-1 mb-1">
                      <Thermometer className="w-3 h-3 text-red-400" />
                      발열량 & 방열 기구
                    </span>
                    <p className="text-[10px] text-slate-300 leading-tight">{selectedProduct.thermalManagement}</p>
                  </div>

                  <div className="bg-slate-800/90 p-2.5 rounded-lg border border-slate-700">
                    <span className="text-sky-300 font-bold block flex items-center gap-1 mb-1">
                      <Droplets className="w-3 h-3 text-sky-400" />
                      방수방진 등급
                    </span>
                    <p className="text-[10px] text-slate-300 leading-tight">{selectedProduct.protectionRating}</p>
                  </div>
                </div>
              </div>

              {/* General Specs Grid */}
              <div className="grid grid-cols-2 gap-2.5 bg-slate-50 p-3 rounded-lg border border-slate-200">
                <div>
                  <span className="text-slate-400 block text-[10px]">구분 / 유형</span>
                  <strong className="text-slate-900">{selectedProduct.type}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">입력 전원</span>
                  <strong className="text-emerald-700">{selectedProduct.power}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">소비 전력</span>
                  <strong className="text-emerald-700">{selectedProduct.wattage} (정격 {selectedProduct.numericWattageW}W)</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">방수방진 / 내구성</span>
                  <strong className="text-slate-900">{selectedProduct.ip}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">광원 수명 (MTBF)</span>
                  <strong className="text-slate-900">{selectedProduct.lifespan}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">권장 설치 지주</span>
                  <strong className="text-slate-900">{selectedProduct.recommendedMount}</strong>
                </div>
                <div className="col-span-2">
                  <span className="text-slate-400 block text-[10px]">트리거 및 연동 방식</span>
                  <strong className="text-slate-900">{selectedProduct.driving}</strong>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <span className="font-bold text-slate-900 block text-xs">엔지니어링 특성 분석:</span>
                <p className="text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs">
                  {selectedProduct.desc}
                </p>
              </div>

              {/* Key Specs Bullet Points */}
              <div className="space-y-1.5">
                <span className="font-bold text-slate-900 block text-xs">핵심 하드웨어 사양:</span>
                <ul className="space-y-1 bg-slate-50 p-3 rounded-lg border border-slate-200">
                  {selectedProduct.keySpecs.map((spec, idx) => (
                    <li key={idx} className="flex items-start space-x-2 text-slate-700">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-600 mt-0.5 flex-shrink-0" />
                      <span>{spec}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Recommended Scenario */}
              <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200 text-emerald-950">
                <span className="font-bold block mb-0.5 text-xs">추천 적용 시나리오:</span>
                <p className="text-[11px] leading-relaxed text-emerald-900">
                  {selectedProduct.recommendedScenario}
                </p>
              </div>
            </div>

            {/* Modal Footer Links */}
            <div className="p-3 bg-slate-50 border-t border-slate-200 flex flex-wrap justify-between items-center gap-2">
              <div className="flex space-x-2">
                <a
                  href={selectedProduct.youtubeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-red-600 hover:bg-red-500 text-white font-bold py-1.5 px-3 rounded text-xs flex items-center space-x-1.5 shadow"
                >
                  <Video className="w-3.5 h-3.5" />
                  <span>소개 유튜브 영상</span>
                </a>
                <a
                  href={selectedProduct.buyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-1.5 px-3 rounded text-xs flex items-center space-x-1.5 shadow"
                >
                  <ShoppingCart className="w-3.5 h-3.5" />
                  <span>구매 스토어 이동</span>
                </a>
              </div>
              <button
                onClick={() => setSelectedProduct(null)}
                className="bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold py-1.5 px-3 rounded text-xs transition"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
