import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface UserSetupData {
  forestName: string;
  mood: string;
  worry: string;
  treeType: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (data: UserSetupData) => void;
}

const MOODS = ['平静', '悲伤', '愤怒', '焦虑', '快乐'];
const TREES = [
  { id: 'oak', name: '橡树', icon: '🌳' },
  { id: 'cherry', name: '樱花树', icon: '🌸' },
  { id: 'maple', name: '枫树', icon: '🍁' },
  { id: 'pine', name: '松树', icon: '🌲' },
  { id: 'willow', name: '柳树', icon: '🌿' },
  { id: 'blossom', name: '花树', icon: '🌺' },
];

export default function UserSetupModal({ isOpen, onClose, onComplete }: Props) {
  const [forestName, setForestName] = useState('');
  const [mood, setMood] = useState('');
  const [worry, setWorry] = useState('');
  const [selectedTree, setSelectedTree] = useState('oak');

  const handleSubmit = () => {
    onComplete({
      forestName: forestName.trim() || '心灵小筑',
      mood,
      worry,
      treeType: selectedTree,
    });
    onClose();
  };

  const handleRandomTree = () => {
    const randomIndex = Math.floor(Math.random() * TREES.length);
    setSelectedTree(TREES[randomIndex].id);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.3)',
            backdropFilter: 'blur(4px)',
            zIndex: 50,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            style={{
              width: '90%',
              maxWidth: '42rem',
              maxHeight: '90vh',
              overflowY: 'auto',
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(4px)',
              borderRadius: '1.5rem',
              padding: '1.5rem',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            }}
            onClick={e => e.stopPropagation()}
          >
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '0.5rem',
                background: 'linear-gradient(to right, #4ade80, #059669)',
                borderTopLeftRadius: '1.5rem',
                borderTopRightRadius: '1.5rem',
              }}
            />
            <h2 className="text-3xl font-bold text-stone-800 mb-1 text-center">🌱 欢迎来到你的森林</h2>
            <p className="text-stone-600 text-center mb-6 text-sm">
              在开始之前，告诉我们一点关于你的事情，让森林为你而生。
            </p>

            <div className="mb-4">
              <label className="block text-stone-700 font-medium mb-1 text-sm">
                你的森林叫什么名字？ <span className="text-stone-400 text-xs">(必填)</span>
              </label>
              <input
                type="text"
                placeholder="例如：心灵小筑"
                className="w-full p-2 text-sm border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-300 transition"
                value={forestName}
                onChange={e => setForestName(e.target.value)}
              />
            </div>

            <div className="mb-4">
              <label className="block text-stone-700 font-medium mb-1 text-sm">
                你现在的心情如何？ <span className="text-stone-400 text-xs">(可选)</span>
              </label>
              <div className="flex flex-wrap gap-1">
                {MOODS.map(m => (
                  <button
                    key={m}
                    onClick={() => setMood(m)}
                    className={`px-3 py-1 text-sm rounded-full transition ${
                      mood === m
                        ? 'bg-green-600 text-white shadow-md'
                        : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-stone-700 font-medium mb-1 text-sm">
                最近有什么事情困扰你吗？ <span className="text-stone-400 text-xs">(可选)</span>
              </label>
              <textarea
                placeholder="可以简单写几句..."
                className="w-full h-20 p-2 text-sm border border-stone-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-green-300 transition"
                value={worry}
                onChange={e => setWorry(e.target.value)}
              />
            </div>

            <div className="mb-6">
              <label className="block text-stone-700 font-medium mb-2 text-sm">
                为你挑选一棵树 <span className="text-stone-400 text-xs">(可随机，也可自选)</span>
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {TREES.map(tree => (
                  <button
                    key={tree.id}
                    onClick={() => setSelectedTree(tree.id)}
                    className={`p-2 rounded-xl border-2 transition flex flex-col items-center text-sm ${
                      selectedTree === tree.id
                        ? 'border-green-500 bg-green-50'
                        : 'border-stone-200 hover:border-stone-300'
                    }`}
                  >
                    <span className="text-2xl mb-1">{tree.icon}</span>
                    <span className="text-xs font-medium">{tree.name}</span>
                  </button>
                ))}
              </div>
              <button
                onClick={handleRandomTree}
                className="mt-2 text-xs text-green-600 hover:text-green-700 transition"
              >
                🎲 随机分配一棵树
              </button>
            </div>

            <div className="flex justify-center">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSubmit}
                className="px-6 py-2 bg-green-600 text-white rounded-xl shadow-lg hover:bg-green-700 transition text-base font-medium"
              >
                开始我的森林
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
