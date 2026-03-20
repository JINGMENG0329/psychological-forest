import { useState } from 'react';
import { motion } from 'framer-motion';
import { Seed } from '../types';
import { PestlessModal, TrimModal, LoosenModal } from './ActionModals';
import HistoryModal from './HistoryModal';
import MessageModal from './MessageModal';

interface Props {
  seed: Seed;
  onWater: (id: string) => void;
  onFertilize: (id: string) => void;
  onPestlessAction: (id: string, thought: string) => void;
  onTrim: (id: string, selected: string[]) => void;
  onLoosen: (id: string, text: string) => void;
  onRemoveThought: (id: string, thought: string) => void;
  onAddMessage: (id: string, nick: string, content: string) => void;
  onClose: () => void;
}

export default function TreeActionPanel({
  seed,
  onWater,
  onFertilize,
  onPestlessAction,
  onTrim,
  onLoosen,
  onRemoveThought,
  onAddMessage,
  onClose,
}: Props) {
  const [showMessageInput, setShowMessageInput] = useState(false);
  const [message, setMessage] = useState('');
  const [showPestlessModal, setShowPestlessModal] = useState(false);
  const [showTrimModal, setShowTrimModal] = useState(false);
  const [showLoosenModal, setShowLoosenModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);

  const handleSunSubmit = () => {
    if (message.trim()) {
      onAddMessage(seed.id, '', message);
      setMessage('');
      setShowMessageInput(false);
    }
  };

  const handlePestButton = () => {
    if (seed.health === 'pests') {
      // 有虫时直接显示虫子，由点击虫子处理
    } else {
      setShowPestlessModal(true);
    }
  };

  const handleTrimComplete = (selected: string[]) => onTrim(seed.id, selected);
  const handleLoosenComplete = (text: string) => onLoosen(seed.id, text);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="fixed bottom-8 left-1/2 -translate-x-1/2 w-full max-w-lg bg-white/90 backdrop-blur rounded-2xl p-4 shadow-xl z-50 border border-stone-200"
    >
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-medium text-stone-700 truncate flex-1">{seed.content}</h3>
        <button onClick={onClose} className="text-stone-500 hover:text-stone-700 text-xl">&times;</button>
      </div>

      {/* 按钮栏 */}
      <div className="overflow-x-auto pb-1 scrollbar-thin">
        <div className="flex gap-2 min-w-max">
          <button
            onClick={() => setShowMessageInput(true)}
            className="flex-shrink-0 px-3 py-2 bg-amber-100 text-amber-800 rounded-xl hover:bg-amber-200"
          >
            ☀️ 晒太阳
          </button>
          <button
            onClick={() => onWater(seed.id)}
            className="flex-shrink-0 px-3 py-2 bg-blue-100 text-blue-800 rounded-xl hover:bg-blue-200"
          >
            💧 浇水
          </button>
          <button
            onClick={() => onFertilize(seed.id)}
            className="flex-shrink-0 px-3 py-2 bg-yellow-100 text-yellow-800 rounded-xl hover:bg-yellow-200"
          >
            🌿 施肥
          </button>
          <button
            onClick={handlePestButton}
            className={`flex-shrink-0 px-3 py-2 rounded-xl ${
              seed.health === 'pests'
                ? 'bg-red-200 text-red-900 ring-2 ring-red-400'
                : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
            }`}
          >
            🐞 驱虫
          </button>
          <button
            onClick={() => setShowTrimModal(true)}
            className={`flex-shrink-0 px-3 py-2 rounded-xl ${
              seed.health === 'overcrowded'
                ? 'bg-purple-200 text-purple-900 ring-2 ring-purple-400'
                : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
            }`}
          >
            ✂️ 修剪
          </button>
          <button
            onClick={() => setShowLoosenModal(true)}
            className={`flex-shrink-0 px-3 py-2 rounded-xl ${
              seed.health === 'thirsty'
                ? 'bg-cyan-200 text-cyan-900 ring-2 ring-cyan-400'
                : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
            }`}
          >
            🪴 松土
          </button>
          <button
            onClick={() => setShowHistoryModal(true)}
            className="flex-shrink-0 px-3 py-2 bg-stone-200 text-stone-800 rounded-xl hover:bg-stone-300"
          >
            📖 记录本
          </button>
        </div>
      </div>

      {/* 晒太阳留言输入 */}
      {showMessageInput && (
        <div className="mt-3 p-3 bg-amber-50 rounded-xl">
          <textarea
            className="w-full p-2 text-sm border border-stone-200 rounded-lg resize-none"
            placeholder="写下你的鼓励或建议..."
            rows={2}
            value={message}
            onChange={e => setMessage(e.target.value)}
          />
          <div className="flex justify-end gap-2 mt-2">
            <button
              onClick={() => setShowMessageInput(false)}
              className="px-3 py-1 text-xs rounded-lg text-stone-600 hover:bg-stone-200"
            >
              取消
            </button>
            <button
              onClick={handleSunSubmit}
              className="px-3 py-1 text-xs rounded-lg bg-amber-600 text-white hover:bg-amber-700"
            >
              发送阳光
            </button>
          </div>
        </div>
      )}

      {/* 模态框 */}
      <PestlessModal
        isOpen={showPestlessModal}
        onClose={() => setShowPestlessModal(false)}
        onComplete={thought => onPestlessAction(seed.id, thought)}
      />
      <TrimModal
        isOpen={showTrimModal}
        onClose={() => setShowTrimModal(false)}
        onComplete={handleTrimComplete}
      />
      <LoosenModal
        isOpen={showLoosenModal}
        onClose={() => setShowLoosenModal(false)}
        onComplete={handleLoosenComplete}
      />
      <HistoryModal
        isOpen={showHistoryModal}
        onClose={() => setShowHistoryModal(false)}
        history={seed.history}
        seedContent={seed.content}
      />
    </motion.div>
  );
}
