import { motion, AnimatePresence } from 'framer-motion';
import { Seed } from '../types';

// 根据树类型和成长阶段返回图标（先用Emoji，后期可替换为SVG）
const getTreeIcon = (treeType: Seed['treeType'], growth: number): string => {
  const stage = growth < 25 ? 0 : growth < 50 ? 1 : growth < 75 ? 2 : 3;
  const icons: Record<Seed['treeType'], string[]> = {
    oak: ['🌰', '🌱', '🌿', '🌳'],
    cherry: ['🌸', '🌱', '🌿', '🌸'],
    maple: ['🍁', '🌱', '🌿', '🍁'],
    pine: ['🌰', '🌱', '🌲', '🌲'],
    willow: ['🌰', '🌱', '🌿', '🌿'],
    flower: ['🌰', '🌱', '🌿', '🌺'],
  };
  return icons[treeType][stage] || '🌱';
};

interface Props {
  seed: Seed;
  isSelected?: boolean;
  onClick: () => void;
}

export default function TreeEntity({ seed, isSelected, onClick }: Props) {
  const hasPests = seed.health === 'pests';
  const icon = getTreeIcon(seed.treeType, seed.growth);

  return (
    <motion.div
      className="relative cursor-pointer select-none"
      onClick={onClick}
      whileHover={{ scale: 1.1 }}
      transition={{ type: 'spring', stiffness: 300 }}
    >
      {/* 树图标 */}
      <div className="text-6xl">{icon}</div>

      {/* 虫子动画（当有虫害时） */}
      <AnimatePresence>
        {hasPests && seed.negativeThoughts.length > 0 && (
          <motion.div
            className="absolute -top-2 -right-2 text-2xl"
            initial={{ x: -5, y: -5, rotate: -10 }}
            animate={{
              x: [0, 5, 0, -5, 0],
              y: [0, -2, 0, 2, 0],
              rotate: [0, 10, 0, -10, 0],
            }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            🐛
          </motion.div>
        )}
      </AnimatePresence>

      {/* 选中时的发光效果 */}
      {isSelected && (
        <motion.div
          className="absolute inset-0 rounded-full bg-green-200/50"
          layoutId="selectedTree"
          transition={{ type: 'spring', stiffness: 300 }}
        />
      )}
    </motion.div>
  );
}
