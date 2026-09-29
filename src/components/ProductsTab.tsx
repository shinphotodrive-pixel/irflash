import React, { useState, useMemo } from 'react';
import { ProductItem, ProductCategory } from '../types';
import { PRODUCTS_DATA } from '../data/products';
import { Search, Video, ShoppingCart, Info, X, CheckCircle, AlertCircle, CircleDot, Zap, ShieldAlert, Eye } from 'lucide-react';

export const ProductsTab: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<ProductCategory>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<ProductItem | null>(null);

  const filteredProducts = useMemo(() => {
    return PRODUCTS_DATA.filter(item => {
      const matchesCategory = activeCategory === 'ALL' || item.category === activeCategory;
      const q = searchQuery.trim().toLowerCase();
      const matchesSearch = !q || (
        item.name.toLowerCase().includes(q) ||
        item.brand.toLowerCase().includes(q) ||
        item.type.toLowerCase().includes(q) ||
        item.diameter.toLowerCase().includes(q) ||
        item.irWavelength.toLowerCase().includes(q) ||
        item.visWavelength.toLowerCase().includes(q) ||
        item.price.toLowerCase().includes(q) ||
        item.wavelength.toLowerCase().includes(q) ||
        item.desc.toLowerCase().includes(q)
      );
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

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
          DC 12V 기반의 검증된 ITS 하이브리드 투광기 및 경광 제품군으로 업데이트하였습니다.
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

      {/* Filter and Search Toolbar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center space-x-1.5 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          <span className="font-bold text-slate-500 mr-2 whitespace-nowrap">광원 필터:</span>
          <button
            onClick={() => setActiveCategory('ALL')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-bold transition ${
              activeCategory === 'ALL' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            전체 원형 제품 ({PRODUCTS_DATA.length})
          </button>
          <button
            onClick={() => setActiveCategory('HYBRID')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-bold transition ${
              activeCategory === 'HYBRID' ? 'bg-purple-700 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            원형 복합 하이브리드 (IR+가시광)
          </button>
          <button
            onClick={() => setActiveCategory('IR_VIS_WHITE')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-bold transition ${
              activeCategory === 'IR_VIS_WHITE' ? 'bg-blue-700 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            원형 IR + 백색(White) 스트로보
          </button>
          <button
            onClick={() => setActiveCategory('IR_VIS_RED')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-bold transition ${
              activeCategory === 'IR_VIS_RED' ? 'bg-red-700 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            원형 IR + 적색(Red) 경광등
          </button>
          <button
            onClick={() => setActiveCategory('WARNING_ROUND')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-bold transition ${
              activeCategory === 'WARNING_ROUND' ? 'bg-amber-700 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            원형 Ø100mm+ 시각 경광등
          </button>
        </div>

        {/* Search Box */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="모델명, 지름(100mm), 740nm, 850nm, 백색/적색..."
            className="w-full bg-slate-50 border border-slate-300 rounded-lg pl-9 pr-3 py-1.5 text-xs focus:outline-none focus:border-amber-500 focus:bg-white transition"
          />
        </div>
      </div>

      {/* Products Matrix Table Card */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-900 text-slate-100 border-b border-slate-800">
                <th className="p-3 font-bold min-w-[170px]">제품명 / 제조사</th>
                <th className="p-3 font-bold min-w-[120px] text-amber-300">외형 및 외경 지름</th>
                <th className="p-3 font-bold min-w-[120px] text-purple-300">IR 파장 (740~850nm)</th>
                <th className="p-3 font-bold min-w-[130px] text-amber-400">경고 가시광 (백색/적색)</th>
                <th className="p-3 font-bold min-w-[110px]">소비 전력 / 전원</th>
                <th className="p-3 font-bold min-w-[120px] text-emerald-400">판매 가격 (KRW)</th>
                <th className="p-3 font-bold text-center min-w-[180px]">바로가기 (영상/구매/상세)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-slate-700">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-400">
                    검색 조건에 일치하는 제품이 없습니다.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition">
                    <td className="p-3">
                      <div className="font-bold text-slate-900 text-xs">{item.name}</div>
                      <div className="text-[10px] text-slate-500">{item.brand}</div>
                      <div className="mt-1">
                        <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${
                          item.category === 'HYBRID' ? 'bg-purple-100 text-purple-800' :
                          item.category === 'IR_VIS_WHITE' ? 'bg-blue-100 text-blue-800' :
                          item.category === 'IR_VIS_RED' ? 'bg-red-100 text-red-800' :
                          'bg-amber-100 text-amber-800'
                        }`}>
                          {item.type}
                        </span>
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="inline-flex items-center space-x-1 bg-amber-50 text-amber-950 border border-amber-200 font-black px-2 py-0.5 rounded text-[11px]">
                        <CircleDot className="w-3.5 h-3.5 text-amber-600" />
                        <span>{item.diameter}</span>
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">{item.shape}</div>
                    </td>
                    <td className="p-3">
                      <div className="font-mono font-bold text-purple-900 bg-purple-50 border border-purple-200 px-2 py-0.5 rounded text-[11px] inline-block">
                        {item.irWavelength}
                      </div>
                      <div className="text-[10px] text-slate-500 mt-1">유효거리: {item.range}</div>
                    </td>
                    <td className="p-3">
                      <div className={`font-bold px-2 py-0.5 rounded text-[11px] inline-block ${
                        item.visWavelength.includes('적색') || item.visWavelength.includes('Red')
                          ? 'bg-red-50 text-red-900 border border-red-200'
                          : 'bg-blue-50 text-blue-900 border border-blue-200'
                      }`}>
                        {item.visWavelength}
                      </div>
                      <div className="text-[10px] text-slate-400 mt-1">{item.driving}</div>
                    </td>
                    <td className="p-3 font-mono">
                      <span className="text-emerald-700 font-bold block">{item.power}</span>
                      <span className="text-[10px] text-slate-500 font-normal">({item.wattage})</span>
                    </td>
                    <td className="p-3 font-mono font-bold text-slate-900 whitespace-nowrap">
                      {item.price}
                    </td>
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

      {/* Engineering Design Insights Card */}
      <div className="bg-amber-50/90 border border-amber-200 p-4 rounded-xl text-xs text-amber-950 flex items-start space-x-3">
        <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
        <div className="space-y-1.5">
          <span className="font-bold text-amber-950 text-sm">원형(Circular Ø100mm 이상) 및 파장(740~850nm / 백색·적색) 엔지니어링 분석:</span>
          <p className="leading-relaxed text-amber-900">
            <strong>1. 원형 지름 100mm 이상 규격 채택 이유:</strong><br/>
            - <strong>풍하중(Wind Load) 감소:</strong> 사각형 투광기 대비 원형 베젤은 바람 저항 계수(Drag Coefficient)가 30% 이상 낮아 지주 폴대 흔들림을 방지합니다.<br/>
            - <strong>광학 대칭성:</strong> 원형 렌즈/리플렉터는 방사형으로 고른 원형 배광 패턴을 형성하여 차로 진입각에 구애받지 않고 일관된 조도를 제공합니다.<br/>
            <strong>2. IR 파장(740nm vs 850nm) 특성:</strong><br/>
            - <strong>740nm (딥레드 IR):</strong> 이미지 센서의 양자효율(QE)이 82%로 매우 높아 850nm 대비 동일 전력에서 약 1.5~2배 밝은 LPR 영상을 얻을 수 있습니다 (인간 육안에 은은한 붉은 광선 인지).<br/>
            - <strong>850nm (표준 LPR IR):</strong> 인간 육안에 거의 보이지 않는 비가시광선으로 야간 운전자의 눈부심이나 시야 방해를 100% 원천 차단합니다.<br/>
            <strong>3. 과속 경고 가시광(백색 vs 적색) 선택 가이드:</strong><br/>
            - <strong>백색(White 6000K) 순간 스트로보:</strong> 20~30ms 순간 펄스로 차량 차체 색상 및 탑승자 컬러 사진을 확보하면서도 과속 운전자에게 플래시 섬광으로 경각심을 줍니다.<br/>
            - <strong>적색(Red 620~630nm) 경광등:</strong> 도로교통법상 정지·경고를 상징하는 색상으로 운전자의 본능적인 감속 반응을 이끌어내며, 야간 암적응(Dark Adaptation)을 해치지 않아 안전성이 우수합니다.
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

              {/* Specs Grid */}
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
                  <strong className="text-emerald-700">{selectedProduct.wattage}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">방수방진 / 내구성</span>
                  <strong className="text-slate-900">{selectedProduct.ip}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">광원 및 파장 종합</span>
                  <strong className="text-slate-900">{selectedProduct.wavelength}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">유효 조사 / 시인 거리</span>
                  <strong className="text-slate-900">{selectedProduct.range}</strong>
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
