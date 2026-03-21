export type HealthState = 'healthy' | 'pests' | 'thirsty' | 'overcrowded';
export type TreeType = 'oak' | 'cherry' | 'maple' | 'pine' | 'willow' | 'blossom';
export type GrowthStage = 0 | 1 | 2 | 3 | 4;

export interface SeedHistoryItem {
  id: string;
  action: 'water' | 'fertilize' | 'sun' | 'pest' | 'trim' | 'loosen';
  description: string;
  growthChange: number;
  timestamp: number;
}

export interface Message {
  nick: string;
  content: string;
  timestamp: number;
}

export interface Stats {
  water: number;
  fertilize: number;
  sun: number;
  pest: number;
  trim: number;
  loosen: number;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  unlockedAt?: number;
  icon: string;
}

export const ALL_ACHIEVEMENTS: Achievement[] = [
  { id: 'first_water', name: '第一滴水', description: '第一次浇水', icon: '💧' },
  { id: 'first_fertilize', name: '第一把肥', description: '第一次施肥', icon: '🌿' },
  { id: 'first_sun', name: '第一缕阳光', description: '第一次晒太阳', icon: '☀️' },
  { id: 'first_pest', name: '除虫新手', description: '第一次驱虫', icon: '🐞' },
  { id: 'first_trim', name: '修剪大师', description: '第一次修剪', icon: '✂️' },
  { id: 'first_loosen', name: '松土专家', description: '第一次松土', icon: '🪴' },
  { id: 'water_10', name: '灌溉使者', description: '浇水10次', icon: '💧💧' },
  { id: 'fertilize_10', name: '肥沃土地', description: '施肥10次', icon: '🌿🌿' },
  { id: 'pest_5', name: '驱虫勇士', description: '驱虫5次', icon: '🐞🐞' },
  { id: 'growth_100', name: '茁壮成长', description: '一棵树成长到100%', icon: '🌳' },
];

export interface Seed {
  id: string;
  user_id?: string;                 // 新增
  content: string;
  treeType: TreeType;
  growth: number;
  stage: GrowthStage;
  health: number;
  dead: boolean;
  messages: Message[];
  healthState: HealthState;
  negativeThoughts: string[];
  lastStateChange: number;
  history: SeedHistoryItem[];
  isMock?: boolean;
  stats: Stats;
  achievements: Achievement[];
  lastWaterTime?: number;
  lastFertilizeTime?: number;
  lastSunTime?: number;
  lastPestTime?: number;
  lastTrimTime?: number;
  lastLoosenTime?: number;
  lastUpdateTime: number;
}
