export type ProductCategory = 'ALL' | 'HYBRID' | 'IR_VIS_WHITE' | 'IR_VIS_RED' | 'WARNING_ROUND';

export interface ProductItem {
  id: string;
  category: 'HYBRID' | 'IR_VIS_WHITE' | 'IR_VIS_RED' | 'WARNING_ROUND';
  name: string;
  brand: string;
  shape: string; // 외형 (원형 Circular)
  diameter: string; // 외경 지름 (Ø 100mm 이상)
  type: string;
  power: string;
  wattage: string;
  irWavelength: string; // IR 파장 (740nm ~ 850nm)
  visWavelength: string; // 경고용 가시광 (백색 White / 적색 Red)
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
