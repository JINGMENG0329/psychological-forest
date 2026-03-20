import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (content: string) => void;
}

export default function NewSeedModal({ isOpen, onClose, onConfirm }: Props) {
  const [content, setContent] = useState('');

  const handleSubmit = () => {
    if (content.trim()) {
      onConfirm(content.trim());
      setContent('');
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
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
            onClick={onClose}
          />
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white/90 backdrop-blur rounded-2xl p-6 shadow-xl z-50"
          >
            <h2 className="text-2xl font-bold mb-4 text-stone-800">🌱 种下新烦恼</h2>
            <textarea
              className="w-full h-32 p-3 border border-stone-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-green-300"
              placeholder="写下现在困扰你的一件事..."
              value={content}
              onChange={e => setContent(e.target.value)}
              autoFocus
            />
            <div className="flex justify-end gap-3 mt-4">
              <button onClick={onClose} className="px-4 py-2 rounded-xl text-stone-600 hover:bg-stone-100">取消</button>
              <button onClick={handleSubmit} className="px-4 py-2 rounded-xl bg-green-600 text-white hover:bg-green-700">确认</button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
