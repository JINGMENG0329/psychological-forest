import { useEffect, useState } from 'react';
import { Seed, HealthState, SeedHistoryItem, Message, Stats, Achievement, ALL_ACHIEVEMENTS, TreeType, GrowthStage } from '../types';

const STORAGE_KEY = 'psychologicalForest';

const NEGATIVE_THOUGHTS = [
  '我做不到',
  '没人喜欢我',
  '我总把事情搞砸',
  '一切都没有意义',
  '我不够好',
  '别人都比我强',
  '我永远无法改变',
];

const MOCK_CONTENTS = [
  '工作压力好大',
  '和朋友吵架了',
  '总是失眠焦虑',
  '对未来感到迷茫',
  '感觉自己不够优秀',
  '担心家人健康',
];

const TREE_TYPES: TreeType[] = ['oak', 'cherry', 'maple', 'pine', 'willow', 'blossom'];

const getStageFromGrowth = (growth: number): GrowthStage => {
  if (growth < 20) return 0;
  if (growth < 40) return 1;
  if (growth < 60) return 2;
  if (growth < 80) return 3;
  return 4;
};

const generateMockSeeds = (): Seed[] => {
  const count = Math.floor(Math.random() * 3) + 3;
  const seeds: Seed[] = [];
  for (let i = 0; i < count; i++) {
    const content = MOCK_CONTENTS[Math.floor(Math.random() * MOCK_CONTENTS.length)];
    const growth = Math.floor(Math.random() * 100);
    const treeType = TREE_TYPES[Math.floor(Math.random() * TREE_TYPES.length)];
    const healthState: HealthState = ['healthy', 'pests', 'thirsty', 'overcrowded'][Math.floor(Math.random() * 4)] as HealthState;
    const messages: Message[] = [
      { nick: '森林伙伴', content: '加油，一切都会好起来的', timestamp: Date.now() - 86400000 },
      { nick: '阳光使者', content: '我也有同样的感受 🌞', timestamp: Date.now() - 43200000 },
    ].slice(0, Math.floor(Math.random() * 2) + 1);
    seeds.push({
      id: `mock-${Date.now()}-${i}-${Math.random()}`,
      content,
      treeType,
      growth,
      stage: getStageFromGrowth(growth),
      health: 80 + Math.floor(Math.random() * 20),
      dead: false,
      messages,
      healthState,
      negativeThoughts: healthState === 'pests' ? ['我做不到'] : [],
      lastStateChange: Date.now(),
      history: [],
      isMock: true,
      stats: { water: 0, fertilize: 0, sun: 0, pest: 0, trim: 0, loosen: 0 },
      achievements: [],
      lastUpdateTime: Date.now(),
    });
  }
  return seeds;
};

const migrateSeed = (seed: any): Seed => {
  if (!seed.history) seed.history = [];
  if (Array.isArray(seed.messages) && seed.messages.length > 0 && typeof seed.messages[0] === 'string') {
    seed.messages = seed.messages.map((msg: string) => ({
      nick: '森林伙伴',
      content: msg,
      timestamp: Date.now(),
    }));
  }
  if (!seed.negativeThoughts) seed.negativeThoughts = [];
  if (!seed.lastStateChange) seed.lastStateChange = Date.now();
  if (!seed.stats) seed.stats = { water: 0, fertilize: 0, sun: 0, pest: 0, trim: 0, loosen: 0 };
  if (!seed.achievements) seed.achievements = [];
  if (!seed.treeType) seed.treeType = 'oak';
  if (seed.health === undefined) seed.health = 100;
  if (seed.dead === undefined) seed.dead = false;
  if (!seed.stage) seed.stage = getStageFromGrowth(seed.growth || 0);
  if (!seed.lastUpdateTime) seed.lastUpdateTime = Date.now();
  return seed as Seed;
};

const getRandomNegativeThoughts = (): string[] => {
  const count = Math.floor(Math.random() * 3) + 1;
  const shuffled = [...NEGATIVE_THOUGHTS].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

const getNextHealthState = (_current: HealthState, health: number): HealthState => {
  const states: HealthState[] = ['healthy', 'pests', 'thirsty', 'overcrowded'];
  if (Math.random() > (health / 100)) {
    const negativeStates = states.filter(s => s !== 'healthy');
    return negativeStates[Math.floor(Math.random() * negativeStates.length)];
  }
  return 'healthy';
};

const checkAchievements = (seed: Seed, action: keyof Stats, increment: number): Achievement[] => {
  const newAchievements = [...seed.achievements];
  const has = (id: string) => newAchievements.some(a => a.id === id);
  const now = Date.now();

  if (seed.stats[action] === 0 && !has(`first_${action}`)) {
    const ach = ALL_ACHIEVEMENTS.find(a => a.id === `first_${action}`);
    if (ach) newAchievements.push({ ...ach, unlockedAt: now });
  }

  const count = seed.stats[action] + increment;
  if (action === 'water' && count >= 10 && !has('water_10')) {
    const ach = ALL_ACHIEVEMENTS.find(a => a.id === 'water_10');
    if (ach) newAchievements.push({ ...ach, unlockedAt: now });
  }
  if (action === 'fertilize' && count >= 10 && !has('fertilize_10')) {
    const ach = ALL_ACHIEVEMENTS.find(a => a.id === 'fertilize_10');
    if (ach) newAchievements.push({ ...ach, unlockedAt: now });
  }
  if (action === 'pest' && count >= 5 && !has('pest_5')) {
    const ach = ALL_ACHIEVEMENTS.find(a => a.id === 'pest_5');
    if (ach) newAchievements.push({ ...ach, unlockedAt: now });
  }

  return newAchievements;
};

const actionBaseEffects: Record<SeedHistoryItem['action'], { growthBase: number; healthRecovery: number }> = {
  water: { growthBase: 5, healthRecovery: 3 },
  fertilize: { growthBase: 8, healthRecovery: 1 },
  sun: { growthBase: 3, healthRecovery: 4 },
  pest: { growthBase: 2, healthRecovery: 5 },
  trim: { growthBase: 3, healthRecovery: 5 },
  loosen: { growthBase: 4, healthRecovery: 3 },
};

export function useSeeds() {
  const [seeds, setSeeds] = useState<Seed[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        return parsed.map(migrateSeed);
      } catch {
        return generateMockSeeds();
      }
    }
    return generateMockSeeds();
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seeds));
  }, [seeds]);

  const addSeed = (content: string, treeType?: TreeType) => {
    const type = treeType || TREE_TYPES[Math.floor(Math.random() * TREE_TYPES.length)];
    const now = Date.now();
    const newSeed: Seed = {
      id: now.toString(),
      content,
      treeType: type,
      growth: 0,
      stage: 0,
      health: 100,
      dead: false,
      messages: [],
      healthState: 'healthy',
      negativeThoughts: [],
      lastStateChange: now,
      history: [],
      isMock: false,
      stats: { water: 0, fertilize: 0, sun: 0, pest: 0, trim: 0, loosen: 0 },
      achievements: [],
      lastUpdateTime: now,
    };
    setSeeds(prev => [newSeed, ...prev]);
  };

  const updateSeed = (id: string, updater: (seed: Seed) => Seed) => {
    setSeeds(prev => prev.map(seed => (seed.id === id ? updater(seed) : seed)));
  };

  const addHistoryItem = (seed: Seed, action: SeedHistoryItem['action'], description: string, growthChange: number): Seed => {
    const historyItem: SeedHistoryItem = {
      id: `${Date.now()}-${Math.random()}`,
      action,
      description,
      growthChange,
      timestamp: Date.now(),
    };
    return {
      ...seed,
      history: [historyItem, ...seed.history],
    };
  };

  const applyTimeDecay = (seed: Seed, now: number): Seed => {
    if (seed.dead) return seed;
    const elapsedHours = (now - (seed.lastUpdateTime || now)) / (1000 * 60 * 60);
    if (elapsedHours <= 0) return seed;
    const decay = Math.floor(elapsedHours / 24) * 5;
    if (decay <= 0) return seed;
    const newHealth = Math.max(0, seed.health - decay);
    const dead = newHealth <= 0;
    return {
      ...seed,
      health: newHealth,
      dead,
      lastUpdateTime: now,
    };
  };

  const maybeRandomizeHealthState = (seed: Seed): Seed => {
    if (seed.dead) return seed;
    const now = Date.now();
    const prob = Math.min(0.5, (100 - seed.health) / 200);
    if (Math.random() < prob) {
      const newHealthState = getNextHealthState(seed.healthState, seed.health);
      const updated: Seed = { ...seed, healthState: newHealthState, lastStateChange: now };
      if (newHealthState === 'pests') {
        updated.negativeThoughts = getRandomNegativeThoughts();
      } else {
        updated.negativeThoughts = [];
      }
      return updated;
    }
    return seed;
  };

  const performAction = (
    id: string,
    _growthIncrement: number,
    action: SeedHistoryItem['action'],
    description: string,
    modifier?: (seed: Seed) => Seed
  ) => {
    updateSeed(id, seed => {
      if (seed.dead) return seed;

      const now = Date.now();
      let updated = applyTimeDecay(seed, now);

      const lastTimeField = `last${action.charAt(0).toUpperCase() + action.slice(1)}Time` as keyof Pick<Seed, 'lastWaterTime' | 'lastFertilizeTime' | 'lastSunTime' | 'lastPestTime' | 'lastTrimTime' | 'lastLoosenTime'>;
      const lastTime = updated[lastTimeField];
      const isOverCared = lastTime && (now - lastTime) < 30 * 60 * 1000;

      const base = actionBaseEffects[action];
      let growthChange = base.growthBase;
      let healthChange = base.healthRecovery;

      if (isOverCared) {
        growthChange = Math.floor(growthChange / 2);
        healthChange = -10;
        description = description.replace('你', '你过度照料，');
      } else {
        growthChange = Math.max(1, Math.floor(growthChange * (updated.health / 100)));
      }

      if (modifier) {
        updated = modifier(updated);
      }

      let newGrowth = Math.min(100, updated.growth + growthChange);
      let newHealth = updated.health + healthChange;
      if (newHealth > 100) newHealth = 100;
      const dead = newHealth <= 0;

      const newStage = getStageFromGrowth(newGrowth);

      const newStats = {
        ...updated.stats,
        [action]: updated.stats[action] + 1,
      };

      let newAchievements = checkAchievements({ ...updated, stats: newStats }, action, 1);
      if (newGrowth === 100 && !newAchievements.some(a => a.id === 'growth_100')) {
        const ach = ALL_ACHIEVEMENTS.find(a => a.id === 'growth_100');
        if (ach) newAchievements.push({ ...ach, unlockedAt: now });
      }

      updated = {
        ...updated,
        growth: newGrowth,
        stage: newStage,
        health: newHealth,
        dead,
        stats: newStats,
        achievements: newAchievements,
        [lastTimeField]: now,
        lastUpdateTime: now,
      };

      updated = addHistoryItem(updated, action, description, growthChange);
      updated = maybeRandomizeHealthState(updated);

      return updated;
    });
  };

  const addMessage = (id: string, nick: string, content: string) => {
    const message: Message = {
      nick: nick.trim() || '森林伙伴',
      content: content.trim(),
      timestamp: Date.now(),
    };
    updateSeed(id, seed => ({
      ...seed,
      messages: [message, ...seed.messages],
    }));
  };

  const removeNegativeThought = (id: string, thought: string) => {
    updateSeed(id, seed => {
      const filtered = seed.negativeThoughts.filter(t => t !== thought);
      const updated = { ...seed, negativeThoughts: filtered };
      if (filtered.length === 0) updated.healthState = 'healthy';
      return updated;
    });
  };

  return {
    seeds,
    addSeed,
    performAction,
    addMessage,
    removeNegativeThought,
  };
}
