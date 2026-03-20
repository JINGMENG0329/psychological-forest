import { motion, AnimatePresence } from 'framer-motion';
import { Achievement } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  achievements: Achievement[];
}

export default function AchievementsModal({ isOpen, onClose, achievements }: Props) {
  const unlocked = achievements.filter(a => a.unlockedAt);
  const locked = achievements.filter(a => !a.unlockedAt);

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
            <h2 className="text-2xl font-bold mb-4 text-stone-800">🏆 我的成就</h2>
            {unlocked.length === 0 ? (
              <p className="text-stone-500 text-center py-8">还没有解锁成就，快去照料小树吧 🌱</p>
            ) : (
              <div className="space-y-3">
                {unlocked.map(ach => (
                  <div key={ach.id} className="flex items-center gap-3 p-3 bg-green-50 rounded-xl">
                    <span className="text-3xl">{ach.icon}</span>
                    <div className="flex-1">
                      <p className="font-medium text-stone-800">{ach.name}</p>
                      <p className="text-sm text-stone-600">{ach.description}</p>
                      <p className="text-xs text-stone-400 mt-1">
                        解锁于 {new Date(ach.unlockedAt!).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {locked.length > 0 && (
              <>
                <h3 className="text-lg font-semibold mt-6 mb-2 text-stone-700">未解锁</h3>
                <div className="space-y-2 opacity-60">
                  {locked.map(ach => (
                    <div key={ach.id} className="flex items-center gap-3 p-3 bg-stone-100 rounded-xl">
                      <span className="text-3xl grayscale">{ach.icon}</span>
                      <div>
                        <p className="font-medium text-stone-500">{ach.name}</p>
                        <p className="text-sm text-stone-400">{ach.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </>
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
