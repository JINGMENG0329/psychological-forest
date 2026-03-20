import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Seed, SeedHistoryItem, Message, TreeType, HealthState, GrowthStage } from '../types';

// 辅助函数：从数据库种子转换为前端 Seed 类型
const mapDbSeed = (dbSeed: any): Seed => {
  return {
    id: dbSeed.id,
    content: dbSeed.content,
    treeType: dbSeed.tree_type as TreeType,
    growth: dbSeed.growth,
    stage: dbSeed.stage,
    health: dbSeed.health,
    dead: dbSeed.dead,
    messages: [], // 留言单独加载
    healthState: dbSeed.health_state as HealthState,
    negativeThoughts: dbSeed.negative_thoughts,
    lastStateChange: dbSeed.last_state_change,
    history: dbSeed.history,
    isMock: false,
    stats: dbSeed.stats,
    achievements: dbSeed.achievements,
    lastUpdateTime: dbSeed.last_update_time,
    lastWaterTime: dbSeed.last_water_time,
    lastFertilizeTime: dbSeed.last_fertilize_time,
    lastSunTime: dbSeed.last_sun_time,
    lastPestTime: dbSeed.last_pest_time,
    lastTrimTime: dbSeed.last_trim_time,
    lastLoosenTime: dbSeed.last_loosen_time,
  };
};

// 操作基础效果
const actionBaseEffects: Record<SeedHistoryItem['action'], { growthBase: number; healthRecovery: number }> = {
  water: { growthBase: 5, healthRecovery: 3 },
  fertilize: { growthBase: 8, healthRecovery: 1 },
  sun: { growthBase: 3, healthRecovery: 4 },
  pest: { growthBase: 2, healthRecovery: 5 },
  trim: { growthBase: 3, healthRecovery: 5 },
  loosen: { growthBase: 4, healthRecovery: 3 },
};

const getStageFromGrowth = (growth: number): GrowthStage => {
  if (growth < 20) return 0;
  if (growth < 40) return 1;
  if (growth < 60) return 2;
  if (growth < 80) return 3;
  return 4;
};

const getNextHealthState = (current: HealthState, health: number): HealthState => {
  const states: HealthState[] = ['healthy', 'pests', 'thirsty', 'overcrowded'];
  if (Math.random() > (health / 100)) {
    const negativeStates = states.filter(s => s !== 'healthy');
    return negativeStates[Math.floor(Math.random() * negativeStates.length)];
  }
  return 'healthy';
};

export function useSeeds(userId: string | null) {
  const [seeds, setSeeds] = useState<Seed[]>([]);
  const [loading, setLoading] = useState(true);

  const loadSeeds = async () => {
    if (!userId) {
      // 未登录时直接结束加载，不请求数据
      setLoading(false);
      return;
    }
    setLoading(true);
    const { data: seedsData, error } = await supabase
      .from('seeds')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) {
      console.error('加载种子失败:', error);
      setLoading(false);
      return;
    }

    const mapped = seedsData.map(mapDbSeed);
    for (const seed of mapped) {
      const { data: msgs } = await supabase
        .from('messages')
        .select('*')
        .eq('seed_id', seed.id)
        .order('timestamp', { ascending: false });
      seed.messages = msgs || [];
    }
    setSeeds(mapped);
    setLoading(false);
  };

  const addSeed = async (content: string, treeType?: TreeType) => {
    if (!userId) return;
    const now = Date.now();
    const newSeed = {
      id: now.toString(),
      user_id: userId,
      content,
      tree_type: treeType || 'oak',
      growth: 0,
      stage: 0,
      health: 100,
      dead: false,
      health_state: 'healthy',
      negative_thoughts: [],
      last_state_change: now,
      history: [],
      stats: { water: 0, fertilize: 0, sun: 0, pest: 0, trim: 0, loosen: 0 },
      achievements: [],
      last_update_time: now,
    };
    const { error } = await supabase.from('seeds').insert(newSeed);
    if (error) {
      console.error('添加种子失败:', error);
    } else {
      await loadSeeds();
    }
  };

  const updateSeed = async (id: string, updates: Partial<Seed>) => {
    if (!userId) return;
    const dbUpdates: any = {};
    if (updates.growth !== undefined) dbUpdates.growth = updates.growth;
    if (updates.stage !== undefined) dbUpdates.stage = updates.stage;
    if (updates.health !== undefined) dbUpdates.health = updates.health;
    if (updates.dead !== undefined) dbUpdates.dead = updates.dead;
    if (updates.healthState !== undefined) dbUpdates.health_state = updates.healthState;
    if (updates.negativeThoughts !== undefined) dbUpdates.negative_thoughts = updates.negativeThoughts;
    if (updates.lastStateChange !== undefined) dbUpdates.last_state_change = updates.lastStateChange;
    if (updates.history !== undefined) dbUpdates.history = updates.history;
    if (updates.stats !== undefined) dbUpdates.stats = updates.stats;
    if (updates.achievements !== undefined) dbUpdates.achievements = updates.achievements;
    if (updates.lastUpdateTime !== undefined) dbUpdates.last_update_time = updates.lastUpdateTime;
    if (updates.lastWaterTime !== undefined) dbUpdates.last_water_time = updates.lastWaterTime;
    if (updates.lastFertilizeTime !== undefined) dbUpdates.last_fertilize_time = updates.lastFertilizeTime;
    if (updates.lastSunTime !== undefined) dbUpdates.last_sun_time = updates.lastSunTime;
    if (updates.lastPestTime !== undefined) dbUpdates.last_pest_time = updates.lastPestTime;
    if (updates.lastTrimTime !== undefined) dbUpdates.last_trim_time = updates.lastTrimTime;
    if (updates.lastLoosenTime !== undefined) dbUpdates.last_loosen_time = updates.lastLoosenTime;

    const { error } = await supabase
      .from('seeds')
      .update(dbUpdates)
      .eq('id', id);
    if (error) {
      console.error('更新种子失败:', error);
    } else {
      await loadSeeds();
    }
  };

  const performAction = async (
    id: string,
    _growthIncrement: number,
    action: SeedHistoryItem['action'],
    description: string,
    modifier?: (seed: Seed) => Seed
  ) => {
    const seed = seeds.find(s => s.id === id);
    if (!seed || seed.dead) return;

    const now = Date.now();

    // 时间衰减
    const elapsedHours = (now - (seed.lastUpdateTime || now)) / (1000 * 60 * 60);
    let healthAfterDecay = seed.health;
    let deadAfterDecay = seed.dead;
    if (elapsedHours > 0) {
      const decay = Math.floor(elapsedHours / 24) * 5;
      if (decay > 0) {
        healthAfterDecay = Math.max(0, seed.health - decay);
        deadAfterDecay = healthAfterDecay <= 0;
      }
    }

    let currentSeed = {
      ...seed,
      health: healthAfterDecay,
      dead: deadAfterDecay,
      lastUpdateTime: now,
    };

    if (currentSeed.dead) return;

    const lastTimeField = `last${action.charAt(0).toUpperCase() + action.slice(1)}Time` as keyof Pick<Seed, 'lastWaterTime' | 'lastFertilizeTime' | 'lastSunTime' | 'lastPestTime' | 'lastTrimTime' | 'lastLoosenTime'>;
    const lastTime = currentSeed[lastTimeField];
    const isOverCared = lastTime && (now - (lastTime as number)) < 30 * 60 * 1000;

    const base = actionBaseEffects[action];
    let growthChange = base.growthBase;
    let healthChange = base.healthRecovery;

    if (isOverCared) {
      growthChange = Math.floor(growthChange / 2);
      healthChange = -10;
      description = description.replace('你', '你过度照料，');
    } else {
      growthChange = Math.max(1, Math.floor(growthChange * (currentSeed.health / 100)));
    }

    if (modifier) {
      currentSeed = modifier(currentSeed);
    }

    let newGrowth = Math.min(100, currentSeed.growth + growthChange);
    let newHealth = currentSeed.health + healthChange;
    if (newHealth > 100) newHealth = 100;
    const dead = newHealth <= 0;

    const newStage = getStageFromGrowth(newGrowth);
    const newStats = {
      ...currentSeed.stats,
      [action]: currentSeed.stats[action] + 1,
    };

    let newAchievements = [...currentSeed.achievements];
    if (newGrowth === 100 && !newAchievements.some(a => a.id === 'growth_100')) {
      newAchievements.push({ id: 'growth_100', name: '茁壮成长', description: '一棵树成长到100%', icon: '🌳', unlockedAt: now });
    }

    const updated: Partial<Seed> = {
      growth: newGrowth,
      stage: newStage,
      health: newHealth,
      dead,
      stats: newStats,
      achievements: newAchievements,
      lastUpdateTime: now,
      [lastTimeField]: now,
    };

    const historyItem: SeedHistoryItem = {
      id: `${now}-${Math.random()}`,
      action,
      description,
      growthChange,
      timestamp: now,
    };
    updated.history = [historyItem, ...currentSeed.history];

    const prob = Math.min(0.5, (100 - newHealth) / 200);
    if (Math.random() < prob) {
      const newHealthState = getNextHealthState(currentSeed.healthState, newHealth);
      updated.healthState = newHealthState;
      if (newHealthState === 'pests') {
        updated.negativeThoughts = ['我做不到'];
      } else {
        updated.negativeThoughts = [];
      }
      updated.lastStateChange = now;
    }

    await updateSeed(id, updated);
  };

  const addMessage = async (id: string, nick: string, content: string) => {
    const message: Message = {
      nick: nick.trim() || '森林伙伴',
      content: content.trim(),
      timestamp: Date.now(),
    };
    const { error } = await supabase
      .from('messages')
      .insert({ seed_id: id, nick: message.nick, content: message.content, timestamp: message.timestamp });
    if (error) {
      console.error('添加留言失败:', error);
    } else {
      await loadSeeds();
    }
  };

  const removeNegativeThought = async (id: string, thought: string) => {
    const seed = seeds.find(s => s.id === id);
    if (!seed) return;
    const filtered = seed.negativeThoughts.filter(t => t !== thought);
    await updateSeed(id, {
      negativeThoughts: filtered,
      healthState: filtered.length === 0 ? 'healthy' : seed.healthState,
    });
  };

  useEffect(() => {
    loadSeeds();
  }, [userId]);

  return {
    seeds,
    loading,
    addSeed,
    performAction,
    addMessage,
    removeNegativeThought,
  };
}
