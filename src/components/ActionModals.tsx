import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface PestlessModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (thought: string) => void;
}

export function PestlessModal({ isOpen, onClose, onComplete }: PestlessModalProps) {
  const [thought, setThought] = useState('');

  const handleSubmit = () => {
    if (thought.trim()) {
      onComplete(thought.trim());
      setThought('');
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <ModalShell onClose={onClose} title="🐞 回顾负面想法">
          <p className="text-stone-600 mb-3">暂时没有害虫，但你可以回顾一下最近有没有冒出不合理的想法？</p>
          <input
            type="text"
            className="w-full p-2 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-300"
            placeholder="例如：我担心自己做不好..."
            value={thought}
            onChange={e => setThought(e.target.value)}
          />
          <div className="flex justify-end gap-3 mt-4">
            <button onClick={onClose} className="px-4 py-2 rounded-xl text-stone-600 hover:bg-stone-100">取消</button>
            <button onClick={handleSubmit} className="px-4 py-2 rounded-xl bg-green-600 text-white hover:bg-green-700">驱散</button>
          </div>
        </ModalShell>
      )}
    </AnimatePresence>
  );
}

interface TrimModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (selected: string[]) => void;
}

const TRIM_OPTIONS = ['过度完美主义', '反复懊悔', '担忧未来', '自我批评', '与他人比较', '苛责过去'];

export function TrimModal({ isOpen, onClose, onComplete }: TrimModalProps) {
  const [selected, setSelected] = useState<string[]>([]);

  const toggle = (opt: string) => {
    setSelected(prev =>
      prev.includes(opt) ? prev.filter(o => o !== opt) : [...prev, opt]
    );
  };

  const handleSubmit = () => {
    if (selected.length > 0) {
      onComplete(selected);
      setSelected([]);
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <ModalShell onClose={onClose} title="✂️ 修剪枯枝 - 放下负担">
          <p className="text-stone-600 mb-3">以下哪些是你可以暂时放下的？</p>
          <div className="space-y-2">
            {TRIM_OPTIONS.map(opt => (
              <label key={opt} className="flex items-center gap-2 p-2 bg-stone-50 rounded-lg cursor-pointer">
                <input
                  type="checkbox"
                  checked={selected.includes(opt)}
                  onChange={() => toggle(opt)}
                  className="rounded border-stone-300 text-green-600 focus:ring-green-300"
                />
                <span>{opt}</span>
              </label>
            ))}
          </div>
          <div className="flex justify-end gap-3 mt-4">
            <button onClick={onClose} className="px-4 py-2 rounded-xl text-stone-600 hover:bg-stone-100">取消</button>
            <button
              onClick={handleSubmit}
              disabled={selected.length === 0}
              className="px-4 py-2 rounded-xl bg-green-600 text-white hover:bg-green-700 disabled:opacity-50"
            >
              修剪
            </button>
          </div>
        </ModalShell>
      )}
    </AnimatePresence>
  );
}

interface LoosenModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (text: string) => void;
}

export function LoosenModal({ isOpen, onClose, onComplete }: LoosenModalProps) {
  const [text, setText] = useState('');

  const handleSubmit = () => {
    if (text.trim()) {
      onComplete(text.trim());
      setText('');
      onClose();
    } else {
      onComplete('');
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <ModalShell onClose={onClose} title="🪴 松土时刻 - 深入根源">
          <p className="text-stone-600 mb-3">这个烦恼的背后，是什么在支撑它？试着松动一下固有的想法。</p>
          <textarea
            className="w-full h-28 p-2 border border-stone-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-green-300"
            placeholder="自由书写..."
            value={text}
            onChange={e => setText(e.target.value)}
          />
          <div className="flex justify-end gap-3 mt-4">
            <button onClick={onClose} className="px-4 py-2 rounded-xl text-stone-600 hover:bg-stone-100">取消</button>
            <button onClick={handleSubmit} className="px-4 py-2 rounded-xl bg-green-600 text-white hover:bg-green-700">松土完毕</button>
          </div>
        </ModalShell>
      )}
    </AnimatePresence>
  );
}

function ModalShell({ onClose, title, children }: { onClose: () => void; title: string; children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
        backdropFilter: 'blur(4px)',
        zIndex: 50,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        style={{
          width: '90%',
          maxWidth: '500px',
          maxHeight: '90vh',
          overflowY: 'auto',
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(4px)',
          borderRadius: '1rem',
          padding: '1.5rem',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        }}
        onClick={e => e.stopPropagation()}
      >
        <h2 className="text-2xl font-bold mb-4 text-stone-800">{title}</h2>
        {children}
      </motion.div>
    </motion.div>
  );
}
