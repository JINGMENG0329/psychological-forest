import { useState } from 'react';
import { motion } from 'framer-motion';
import { Seed } from '../types';
import { PestlessModal, TrimModal, LoosenModal } from './ActionModals';
import HistoryModal from './HistoryModal';
import MessageModal from './MessageModal';
import AchievementsModal from './AchievementsModal';
import {
  playWaterSound,
  playFertilizeSound,
  playSunSound,
  playPestSound,
  playTrimSound,
  playLoosenSound,
} from '../utils/sound';

const healthIcon: Record<Seed['healthState'], string> = {
  healthy: '🌱',
  pests: '🐛',
  thirsty: '💧',
  overcrowded: '🌿',
};

const renderTree = (seed: Seed) => {
  if (seed.dead) return <span className="text-6xl">🥀</span>;

  const stage = seed.stage;
  const type = seed.treeType;

  if (stage === 0) return <span className="text-6xl">🌰</span>;
  if (stage === 1) return <span className="text-6xl">🌱</span>;
  if (stage === 2) return <span className="text-6xl">🌿</span>;

  if (stage === 3) {
    switch (type) {
      case 'oak':
        return (
          <div className="relative text-6xl">
            <span>🌳</span>
            <span className="absolute -top-2 -right-2 text-xl animate-pulse">✨</span>
          </div>
        );
      case 'cherry':
        return (
          <div className="relative text-6xl">
            <span>🌸</span>
            <span className="absolute -top-4 left-1/2 transform -translate-x-1/2 text-pink-300 text-2xl animate-fall">🌸</span>
            <span className="absolute -top-4 left-1/3 transform -translate-x-1/2 text-pink-300 text-xl animate-fall" style={{ animationDelay: '1s' }}>🌸</span>
          </div>
        );
      case 'maple':
        return (
          <div className="relative text-6xl">
            <span>🍁</span>
            <span className="absolute -top-2 -right-2 text-2xl animate-spin-slow">🍁</span>
          </div>
        );
      case 'pine':
        return (
          <div className="relative text-6xl">
            <span>🌲</span>
            <span className="absolute -top-1 -right-1 text-xl animate-twinkle">✨</span>
          </div>
        );
      case 'willow':
        return (
          <div className="relative text-6xl">
            <span className="inline-block animate-sway">🌿</span>
            <span className="inline-block animate-sway" style={{ animationDelay: '0.5s' }}>🌿</span>
            <span className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 text-2xl">💧</span>
          </div>
        );
      case 'blossom':
        return (
          <div className="relative text-6xl">
            <span>🌸</span>
            <span className="absolute -top-2 -right-2 text-2xl animate-pulse">🌸</span>
          </div>
        );
      default:
        return <span className="text-6xl">🌳</span>;
    }
  }

  if (stage === 4) {
    switch (type) {
      case 'oak':
        return (
          <div className="relative text-7xl">
            <span>🌳</span>
            <span className="absolute -top-3 -right-3 text-2xl animate-pulse">✨✨</span>
          </div>
        );
      case 'cherry':
        return (
          <div className="relative text-7xl">
            <span>🌸🌸</span>
            <span className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-pink-300 text-3xl animate-fall">🌸</span>
            <span className="absolute -top-6 left-1/3 transform -translate-x-1/2 text-pink-300 text-2xl animate-fall" style={{ animationDelay: '1.5s' }}>🌸</span>
            <span className="absolute -top-6 right-1/3 transform translate-x-1/2 text-pink-300 text-2xl animate-fall" style={{ animationDelay: '0.8s' }}>🌸</span>
          </div>
        );
      case 'maple':
        return (
          <div className="relative text-7xl">
            <span>🍁🍁</span>
            <span className="absolute -top-3 -right-3 text-3xl animate-spin-slow">🍁</span>
          </div>
        );
      case 'pine':
        return (
          <div className="relative text-7xl">
            <span>🌲🌲</span>
            <span className="absolute -top-1 -right-1 text-2xl animate-twinkle">✨✨</span>
          </div>
        );
      case 'willow':
        return (
          <div className="relative text-7xl">
            <span className="inline-block animate-sway">🌿🌿</span>
            <span className="inline-block animate-sway" style={{ animationDelay: '0.3s' }}>🌿🌿</span>
            <span className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 text-3xl">💧💧</span>
          </div>
        );
      case 'blossom':
        return (
          <div className="relative text-7xl">
            <span>🌸🌸🌸</span>
            <span className="absolute -top-3 -right-3 text-3xl animate-pulse">🌸</span>
          </div>
        );
      default:
        return <span className="text-7xl">🌳✨</span>;
    }
  }

  return <span className="text-6xl">🌱</span>;
};

interface Props {
  seed: Seed;
  onAddMessage: (id: string, nick: string, content: string) => void;
  onWater: (id: string) => void;
  onFertilize: (id: string) => void;
  onPestlessAction: (id: string, thought: string) => void;
  onTrim: (id: string, selected: string[]) => void;
  onLoosen: (id: string, text: string) => void;
  onRemoveThought: (id: string, thought: string) => void;
  isSquare?: boolean;
}

export default function SeedCard({
  seed,
  onAddMessage,
  onWater,
  onFertilize,
  onPestlessAction,
  onTrim,
  onLoosen,
  onRemoveThought,
  isSquare = false,
}: Props) {
  const [showMessageInput, setShowMessageInput] = useState(false);
  const [message, setMessage] = useState('');
  const [showPestlessModal, setShowPestlessModal] = useState(false);
  const [showTrimModal, setShowTrimModal] = useState(false);
  const [showLoosenModal, setShowLoosenModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [showAchievementsModal, setShowAchievementsModal] = useState(false);
  const [messageModalMode, setMessageModalMode] = useState<'send' | 'view'>('send');

  const handleSunSubmit = () => {
    if (message.trim()) {
      playSunSound();
      onAddMessage(seed.id, '', message);
      setMessage('');
      setShowMessageInput(false);
    }
  };

  const handlePestButton = () => {
    if (seed.healthState === 'pests') {
      // 有虫时直接显示虫子，由点击虫子处理
    } else {
      setShowPestlessModal(true);
    }
  };

  const handlePestClick = (thought: string) => {
    playPestSound();
    onRemoveThought(seed.id, thought);
  };

  const handlePestlessComplete = (thought: string) => {
    playPestSound();
    onPestlessAction(seed.id, thought);
  };

  const handleTrimComplete = (selected: string[]) => {
    playTrimSound();
    onTrim(seed.id, selected);
  };

  const handleLoosenComplete = (text: string) => {
    playLoosenSound();
    onLoosen(seed.id, text);
  };

  const openHistory = () => setShowHistoryModal(true);
  const openMessageSend = () => {
    setMessageModalMode('send');
    setShowMessageModal(true);
  };
  const openMessageView = () => {
    setMessageModalMode('view');
    setShowMessageModal(true);
  };
  const handleSendMessage = (nick: string, content: string) => {
    playSunSound();
    onAddMessage(seed.id, nick, content);
  };
  const openAchievements = () => setShowAchievementsModal(true);

  const getHealthColor = (health: number) => {
    if (health > 70) return 'bg-green-500';
    if (health > 40) return 'bg-yellow-500';
    if (health > 10) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const isDead = seed.dead;

  return (
    <>
      <motion.div
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className={`bg-white/70 backdrop-blur-sm rounded-2xl p-4 shadow-md border border-stone-200/50 flex flex-col ${isDead ? 'opacity-60 grayscale' : ''}`}
      >
        <div className="flex justify-between items-start mb-2">
          <div className="text-sm font-medium text-stone-700 line-clamp-2 flex-1 pr-2">
            {seed.content}
          </div>
          <div className="flex items-center gap-1">
            {isSquare && !seed.isMock && (
              <span className="text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full">我的</span>
            )}
            <div className="text-xl" title={`健康状态: ${seed.healthState}`}>
              {healthIcon[seed.healthState]}
            </div>
          </div>
        </div>

        <div className="text-xs text-stone-500 mb-1">
          {seed.treeType === 'oak' && '橡树'}
          {seed.treeType === 'cherry' && '樱花树'}
          {seed.treeType === 'maple' && '枫树'}
          {seed.treeType === 'pine' && '松树'}
          {seed.treeType === 'willow' && '柳树'}
          {seed.treeType === 'blossom' && '花树'}
        </div>

        <div className="flex justify-center items-center py-4 min-h-[6rem] relative">
          <motion.div
            key={seed.id + seed.stage}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            {renderTree(seed)}
          </motion.div>
        </div>

        {/* 健康值进度条 */}
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs text-stone-500 flex items-center gap-0.5">
            <span>❤️</span> 健康
          </span>
          <div className="flex-1 h-2 bg-stone-200 rounded-full">
            <motion.div
              className={`h-full rounded-full ${getHealthColor(seed.health)}`}
              initial={{ width: 0 }}
              animate={{ width: `${seed.health}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* 成长值进度条 */}
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xs text-stone-500 flex items-center gap-0.5">
            <span>🌱</span> 成长
          </span>
          <div className="flex-1 h-2 bg-stone-200 rounded-full">
            <motion.div
              className="h-full bg-green-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${seed.growth}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* 虫子显示 */}
        {seed.healthState === 'pests' && seed.negativeThoughts.length > 0 && (
          <div className="flex flex-wrap gap-2 justify-center mb-3">
            {seed.negativeThoughts.map((thought, idx) => (
              <motion.button
                key={idx}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => handlePestClick(thought)}
                disabled={isDead}
                className="bg-red-100 text-red-800 text-xs px-3 py-1 rounded-full shadow-sm hover:bg-red-200 transition flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span>🐛</span> {thought}
              </motion.button>
            ))}
          </div>
        )}

        {/* 按钮区域 */}
        <div className="flex flex-wrap gap-2 justify-center mt-2">
          <button
            onClick={() => {
              if (!isDead) {
                playSunSound();
                setShowMessageInput(true);
              }
            }}
            disabled={isDead}
            className="flex-shrink-0 px-3 py-2 bg-amber-100 text-amber-800 rounded-xl hover:bg-amber-200 transition text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ☀️ 晒太阳
          </button>
          <button
            onClick={() => {
              if (!isDead) {
                playWaterSound();
                onWater(seed.id);
              }
            }}
            disabled={isDead}
            className="flex-shrink-0 px-3 py-2 bg-blue-100 text-blue-800 rounded-xl hover:bg-blue-200 transition text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            💧 浇水
          </button>
          <button
            onClick={() => {
              if (!isDead) {
                playFertilizeSound();
                onFertilize(seed.id);
              }
            }}
            disabled={isDead}
            className="flex-shrink-0 px-3 py-2 bg-yellow-100 text-yellow-800 rounded-xl hover:bg-yellow-200 transition text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            🌿 施肥
          </button>
          <button
            onClick={handlePestButton}
            disabled={isDead}
            className={`flex-shrink-0 px-3 py-2 rounded-xl transition text-sm disabled:opacity-50 disabled:cursor-not-allowed ${
              seed.healthState === 'pests'
                ? 'bg-red-200 text-red-900 ring-2 ring-red-400'
                : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
            }`}
          >
            🐞 驱虫
          </button>
          <button
            onClick={() => !isDead && setShowTrimModal(true)}
            disabled={isDead}
            className={`flex-shrink-0 px-3 py-2 rounded-xl transition text-sm disabled:opacity-50 disabled:cursor-not-allowed ${
              seed.healthState === 'overcrowded'
                ? 'bg-purple-200 text-purple-900 ring-2 ring-purple-400'
                : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
            }`}
          >
            ✂️ 修剪
          </button>
          <button
            onClick={() => !isDead && setShowLoosenModal(true)}
            disabled={isDead}
            className={`flex-shrink-0 px-3 py-2 rounded-xl transition text-sm disabled:opacity-50 disabled:cursor-not-allowed ${
              seed.healthState === 'thirsty'
                ? 'bg-cyan-200 text-cyan-900 ring-2 ring-cyan-400'
                : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
            }`}
          >
            🪴 松土
          </button>
          <button
            onClick={openHistory}
            className="flex-shrink-0 px-3 py-2 bg-stone-200 text-stone-800 rounded-xl hover:bg-stone-300 transition text-sm"
          >
            📖 记录本
          </button>
          <button
            onClick={openAchievements}
            className="flex-shrink-0 px-3 py-2 bg-yellow-200 text-yellow-800 rounded-xl hover:bg-yellow-300 transition text-sm"
          >
            🏆 成就
          </button>
          {isSquare && (
            <button
              onClick={openMessageSend}
              disabled={isDead}
              className="flex-shrink-0 px-3 py-2 bg-green-100 text-green-800 rounded-xl hover:bg-green-200 transition text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              💬 留言
            </button>
          )}
        </div>

        {/* 晒太阳留言输入（我的森林视图） */}
        {showMessageInput && !isSquare && !isDead && (
          <div className="mt-3 p-3 bg-amber-50 rounded-xl">
            <textarea
              className="w-full p-2 text-sm border border-stone-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-amber-300"
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

        {/* 广场视图留言预览 */}
        {isSquare && seed.messages.length > 0 && (
          <div className="mt-3 p-3 bg-stone-50 rounded-xl cursor-pointer" onClick={openMessageView}>
            <p className="text-xs text-stone-500 line-clamp-2">
              {seed.messages[0].nick}: {seed.messages[0].content}
            </p>
            {seed.messages.length > 1 && <span className="text-xs text-stone-400">等{seed.messages.length}条留言...</span>}
          </div>
        )}
      </motion.div>

      {/* 模态框 */}
      <PestlessModal
        isOpen={showPestlessModal}
        onClose={() => setShowPestlessModal(false)}
        onComplete={handlePestlessComplete}
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
      <MessageModal
        isOpen={showMessageModal}
        onClose={() => setShowMessageModal(false)}
        onSend={handleSendMessage}
        existingMessages={seed.messages}
        mode={messageModalMode}
        seedContent={seed.content}
      />
      <AchievementsModal
        isOpen={showAchievementsModal}
        onClose={() => setShowAchievementsModal(false)}
        achievements={seed.achievements}
      />
    </>
  );
}
