import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  currentMood: string;
  onSave: (mood: string) => void;
}

const MOODS = ['平静', '悲伤', '愤怒', '焦虑', '快乐'];

export default function MoodUpdateModal({ isOpen, onClose, currentMood, onSave }: Props) {
  const [selectedMood, setSelectedMood] = useState(currentMood);

  const handleSave = () => {
    if (selectedMood) {
      onSave(selectedMood);
      onClose();
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
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-sm bg-white/90 backdrop-blur rounded-2xl p-6 shadow-xl z-50"
          >
            <h2 className="text-2xl font-bold mb-4 text-stone-800">更新今日心情</h2>
            <div className="flex flex-wrap gap-2 justify-center mb-4">
              {MOODS.map(m => (
                <button
                  key={m}
                  onClick={() => setSelectedMood(m)}
                  className={`px-4 py-2 rounded-full transition ${
                    selectedMood === m
                      ? 'bg-green-600 text-white shadow-md'
                      : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
            <div className="flex justify-end gap-3">
              <button onClick={onClose} className="px-4 py-2 rounded-xl text-stone-600 hover:bg-stone-100">
                取消
              </button>
              <button onClick={handleSave} className="px-4 py-2 rounded-xl bg-green-600 text-white hover:bg-green-700">
                保存
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
