import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  isOpen: boolean;
  onClose: (nickname: string, mood: string) => void;
}

const moods = [
  { emoji: '😊', label: '开心' },
  { emoji: '😐', label: '平静' },
  { emoji: '😔', label: '忧郁' },
  { emoji: '😤', label: '烦躁' },
  { emoji: '😴', label: '疲惫' },
  { emoji: '🤔', label: '思考' },
];

export default function WelcomeModal({ isOpen, onClose }: Props) {
  const [nickname, setNickname] = useState('');
  const [selectedMood, setSelectedMood] = useState('');

  const handleSubmit = () => {
    if (nickname.trim() && selectedMood) {
      onClose(nickname.trim(), selectedMood);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50"
            onClick={() => {}} // 禁止点击遮罩关闭
          />
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white/90 backdrop-blur rounded-2xl p-6 shadow-xl z-50"
          >
            <h2 className="text-2xl font-bold mb-2 text-stone-800">🌳 欢迎来到心理解压森林</h2>
            <p className="text-stone-600 mb-4">在开始之前，请告诉我们一些信息（可选）</p>

            <div className="mb-4">
              <label className="block text-sm font-medium text-stone-700 mb-1">你的昵称</label>
              <input
                type="text"
                value={nickname}
                onChange={e => setNickname(e.target.value)}
                placeholder="例如：森林旅人"
                className="w-full px-3 py-2 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-300"
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-stone-700 mb-2">你此刻的心情</label>
              <div className="flex flex-wrap gap-2">
                {moods.map(mood => (
                  <button
                    key={mood.label}
                    onClick={() => setSelectedMood(mood.label)}
                    className={`px-3 py-2 rounded-full border transition ${
                      selectedMood === mood.label
                        ? 'bg-green-100 border-green-400 text-green-800'
                        : 'bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100'
                    }`}
                  >
                    {mood.emoji} {mood.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleSubmit}
                disabled={!nickname.trim() || !selectedMood}
                className="px-4 py-2 rounded-xl bg-green-600 text-white hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                进入森林
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
