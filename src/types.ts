export type ProductCategory = 'ALL' | 'HYBRID' | 'IR_VIS_WHITE' | 'IR_VIS_RED' | 'WARNING_ROUND';

export interface ProductItem {
  id: string;
  category: 'HYBRID' | 'IR_VIS_WHITE' | 'IR_VIS_RED' | 'WARNING_ROUND';
  name: string;
  brand: string;
  shape: string; // 외형 (원형 Circular)
  diameter: string; // 외경 지름 (Ø 100mm 이상)
  numericDiameterMm: number; // 외경 지름 숫자값 (mm)
  type: string;
  power: string;
  wattage: string;
  numericWattageW: number; // 정격/최대 소비전력 숫자값 (W)
  numericPriceKrw: number; // 기준 최저 판매가격 숫자값 (KRW)
  irWavelength: string; // IR 파장 (740nm ~ 850nm)
  irWavelengthBand: '740nm' | '850nm' | 'DUAL'; // 파장 대역 분류
  visWavelength: string; // 경고용 가시광 (백색 White / 적색 Red)
  visWarningColor: 'WHITE' | 'RED' | 'SELECTABLE'; // 경고광 색상 분류
  wavelength: string; // 종합 광원 설명
  driving: string;
  range: string;
  price: string;
  ip: string;
  officialUrl: string;
  youtubeUrl: string;
  buyUrl: string;
  desc: string;
  keySpecs: string[];
  recommendedScenario: string;
}

export type TabType = 'mechanism' | 'products' | 'simulator' | 'field';
