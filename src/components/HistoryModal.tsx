import { motion, AnimatePresence } from 'framer-motion';
import { SeedHistoryItem } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  history: SeedHistoryItem[];
  seedContent: string;
}

const actionIcon: Record<SeedHistoryItem['action'], string> = {
  water: '💧',
  fertilize: '🌿',
  sun: '☀️',
  pest: '🐞',
  trim: '✂️',
  loosen: '🪴',
};

const formatTime = (timestamp: number) => {
  const date = new Date(timestamp);
  return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()} ${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`;
};

export default function HistoryModal({ isOpen, onClose, history, seedContent }: Props) {
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
            <h2 className="text-2xl font-bold mb-2 text-stone-800">📖 成长记录本</h2>
            <p className="text-stone-600 mb-4 text-sm truncate">种子：{seedContent}</p>
            {history.length === 0 ? (
              <p className="text-stone-500 text-center py-8">还没有照料记录，快去呵护小树吧 🌱</p>
            ) : (
              <div className="space-y-3">
                {history.map(item => (
                  <div key={item.id} className="flex items-start gap-3 p-3 bg-stone-50 rounded-xl">
                    <span className="text-2xl">{actionIcon[item.action]}</span>
                    <div className="flex-1">
                      <p className="text-stone-800">{item.description}</p>
                      <div className="flex justify-between text-xs text-stone-500 mt-1">
                        <span>成长 +{item.growthChange}</span>
                        <span>{formatTime(item.timestamp)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <div className="flex justify-end mt-4">
              <button onClick={onClose} className="px-4 py-2 rounded-xl bg-stone-200 text-stone-700 hover:bg-stone-300 transition">
                关闭
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
