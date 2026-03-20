import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Message } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSend: (nick: string, content: string) => void;
  existingMessages?: Message[];
  mode: 'send' | 'view';
  seedContent?: string;
}

const formatTime = (timestamp: number) => {
  const date = new Date(timestamp);
  return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()} ${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`;
};

export default function MessageModal({ isOpen, onClose, onSend, existingMessages = [], mode, seedContent }: Props) {
  const [nick, setNick] = useState('');
  const [content, setContent] = useState('');

  const handleSend = () => {
    if (content.trim()) {
      onSend(nick, content);
      setNick('');
      setContent('');
      onClose();
    }
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
              maxWidth: '500px',
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
            <h2 className="text-2xl font-bold mb-4 text-stone-800">
              {mode === 'send' ? '💬 留下你的鼓励' : '📝 全部留言'}
            </h2>
            {seedContent && <p className="text-stone-500 text-sm mb-4 truncate">种子：{seedContent}</p>}

            {mode === 'send' ? (
              <>
                <input
                  type="text"
                  placeholder="你的昵称（可选）"
                  className="w-full p-2 mb-3 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-300"
                  value={nick}
                  onChange={e => setNick(e.target.value)}
                />
                <textarea
                  placeholder="写点什么..."
                  className="w-full h-24 p-2 border border-stone-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-green-300"
                  value={content}
                  onChange={e => setContent(e.target.value)}
                />
                <div className="flex justify-end gap-2 mt-4">
                  <button onClick={onClose} className="px-4 py-2 rounded-xl text-stone-600 hover:bg-stone-100">取消</button>
                  <button onClick={handleSend} className="px-4 py-2 rounded-xl bg-green-600 text-white hover:bg-green-700">发送</button>
                </div>
              </>
            ) : (
              <>
                {existingMessages.length === 0 ? (
                  <p className="text-stone-500 text-center py-8">还没有留言，快来坐坐吧 🌿</p>
                ) : (
                  <div className="space-y-3">
                    {existingMessages.map((msg, idx) => (
                      <div key={idx} className="p-3 bg-stone-50 rounded-xl">
                        <div className="flex justify-between items-center">
                          <span className="font-medium text-stone-700">{msg.nick}</span>
                          <span className="text-xs text-stone-500">{formatTime(msg.timestamp)}</span>
                        </div>
                        <p className="text-stone-600 mt-1">{msg.content}</p>
                      </div>
                    ))}
                  </div>
                )}
                <div className="flex justify-end mt-4">
                  <button onClick={onClose} className="px-4 py-2 rounded-xl bg-stone-200 text-stone-700 hover:bg-stone-300 transition">关闭</button>
                </div>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
