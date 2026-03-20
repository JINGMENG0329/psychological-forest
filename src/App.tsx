import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from './lib/supabase';
import { useSeeds } from './hooks/useSeeds';
import SeedCard from './components/SeedCard';
import NewSeedModal from './components/NewSeedModal';
import UserSetupModal, { UserSetupData } from './components/UserSetupModal';
import MoodUpdateModal from './components/MoodUpdateModal';
import AuthModal from './components/AuthModal';

type View = 'mine' | 'square';

function App() {
  const [user, setUser] = useState<any>(null);
  const [showAuth, setShowAuth] = useState(false);
  const { seeds, loading, addSeed, performAction, addMessage, removeNegativeThought } = useSeeds(user?.id);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [view, setView] = useState<View>('mine');
  const [bgGradient, setBgGradient] = useState('from-green-50 to-stone-100');

  // 昼夜变化
  useEffect(() => {
    const updateGradient = () => {
      const hour = new Date().getHours();
      if (hour >= 6 && hour < 18) {
        setBgGradient('from-green-50 to-stone-100');
      } else if (hour >= 18 && hour < 20) {
        setBgGradient('from-amber-100 to-stone-200');
      } else {
        setBgGradient('from-indigo-900 to-stone-800');
      }
    };
    updateGradient();
    const interval = setInterval(updateGradient, 60000);
    return () => clearInterval(interval);
  }, []);

  // 监听用户登录状态
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);

  // 用户设置（森林名称、心情、困扰等）
  const [showSetup, setShowSetup] = useState(() => {
    return !localStorage.getItem('forest-setup-completed');
  });
  const [userSetup, setUserSetup] = useState<UserSetupData | null>(() => {
    const stored = localStorage.getItem('user-setup');
    return stored ? JSON.parse(stored) : null;
  });
  const [showMoodUpdate, setShowMoodUpdate] = useState(false);

  const filteredSeeds = view === 'mine' ? seeds.filter(s => !s.isMock) : seeds;

  // 照料操作处理函数
  const handleWater = (id: string) => {
    performAction(id, 5, 'water', '你温柔地浇了水，小树喝饱了💧');
  };
  const handleFertilize = (id: string) => {
    performAction(id, 5, 'fertilize', '你撒下智慧的肥料，小树更有力量🌿');
  };
  const handleRemoveThought = (id: string, thought: string) => {
    removeNegativeThought(id, thought);
    performAction(id, 5, 'pest', `你驱散了害虫“${thought}”🐛`);
  };
  const handlePestlessAction = (id: string, thought: string) => {
    performAction(id, 2, 'pest', `你想象并驱散了负面想法“${thought}”`);
  };
  const handleTrim = (id: string, selected: string[]) => {
    const increment = selected.length * 3;
    performAction(id, increment, 'trim', `你修剪了${selected.length}个负担：${selected.join('、')}✂️`);
  };
  const handleLoosen = (id: string, _text: string) => {
    performAction(id, 5, 'loosen', '你松动了固化的想法，土壤变得透气🪴');
  };
  const handleAddMessage = (id: string, nick: string, content: string) => {
    addMessage(id, nick, content);
    performAction(id, 5, 'sun', `你收到一条鼓励：“${content}”☀️`);
  };

  const handleSetupComplete = (data: UserSetupData) => {
    console.log('用户设置完成:', data);
    addSeed(`我的第一棵树: ${data.treeType}`, data.treeType);
    setUserSetup(data);
    localStorage.setItem('user-setup', JSON.stringify(data));
    localStorage.setItem('forest-setup-completed', 'true');
    setShowSetup(false);
  };

  const handleMoodUpdate = (newMood: string) => {
    if (userSetup) {
      const updated = { ...userSetup, mood: newMood };
      setUserSetup(updated);
      localStorage.setItem('user-setup', JSON.stringify(updated));
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">加载中...</div>;
  }

  // 未登录时显示登录弹窗
  if (!user) {
    return <AuthModal onLogin={() => setShowAuth(false)} />;
  }

  return (
    <div className={`min-h-screen bg-gradient-to-b ${bgGradient} p-6 transition-colors duration-1000`}>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-6">
          <h1 className="text-4xl md:text-5xl font-bold text-stone-800 mb-2">🌱 心理解压森林</h1>
          <p className="text-stone-600 text-lg">种下你的烦恼，用温暖呵护它发芽</p>
          <button
            onClick={() => supabase.auth.signOut()}
            className="mt-2 text-sm text-stone-500 hover:text-stone-700 underline"
          >
            退出登录
          </button>
        </div>

        <div className="flex justify-center gap-4 mb-8">
          <button
            onClick={() => setView('mine')}
            className={`px-6 py-2 rounded-full text-lg transition ${
              view === 'mine'
                ? 'bg-green-600 text-white shadow-lg'
                : 'bg-white/50 text-stone-700 hover:bg-white/80'
            }`}
          >
            🌱 我的森林
          </button>
          <button
            onClick={() => setView('square')}
            className={`px-6 py-2 rounded-full text-lg transition ${
              view === 'square'
                ? 'bg-green-600 text-white shadow-lg'
                : 'bg-white/50 text-stone-700 hover:bg-white/80'
            }`}
          >
            🌍 森林广场
          </button>
        </div>

        {view === 'mine' && userSetup && (
          <div className="text-center mb-6 bg-white/30 backdrop-blur-sm rounded-2xl p-4 shadow-sm relative">
            <h2 className="text-3xl font-bold text-stone-700">🌲 {userSetup.forestName} 的森林</h2>
            <div className="flex items-center justify-center gap-2 mt-2">
              {userSetup.mood ? (
                <>
                  <p className="text-stone-600">今日心情: <span className="font-medium">{userSetup.mood}</span></p>
                  <button
                    onClick={() => setShowMoodUpdate(true)}
                    className="text-sm text-green-600 hover:text-green-700 transition"
                    title="更新心情"
                  >
                    ✏️
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setShowMoodUpdate(true)}
                  className="text-sm text-green-600 hover:text-green-700 transition"
                >
                  + 添加今日心情
                </button>
              )}
            </div>
            {userSetup.worry && (
              <p className="text-stone-500 text-sm mt-1 max-w-md mx-auto">最近困扰: {userSetup.worry}</p>
            )}
          </div>
        )}

        {view === 'mine' && (
          <div className="flex justify-center mb-8">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsModalOpen(true)}
              className="px-6 py-3 bg-green-600 text-white rounded-2xl shadow-lg hover:bg-green-700 transition flex items-center gap-2 text-lg"
            >
              <span>🌱</span> 种下新烦恼
            </motion.button>
          </div>
        )}

        {filteredSeeds.length === 0 ? (
          <div className="text-center py-16 bg-white/30 backdrop-blur-sm rounded-3xl">
            <div className="text-8xl mb-4">🌱</div>
            <p className="text-stone-600 text-xl">
              {view === 'mine' ? '还没有种子，点击上方按钮种下第一颗吧' : '广场空空，去种下第一颗树吧'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {filteredSeeds.map(seed => (
                <SeedCard
                  key={seed.id}
                  seed={seed}
                  onAddMessage={handleAddMessage}
                  onWater={handleWater}
                  onFertilize={handleFertilize}
                  onPestlessAction={handlePestlessAction}
                  onTrim={handleTrim}
                  onLoosen={handleLoosen}
                  onRemoveThought={handleRemoveThought}
                  isSquare={view === 'square'}
                  isOwner={seed.user_id === user?.id}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      <NewSeedModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onConfirm={(content) => addSeed(content)} />
      <UserSetupModal
        isOpen={showSetup}
        onClose={() => setShowSetup(false)}
        onComplete={handleSetupComplete}
      />
      {userSetup && (
        <MoodUpdateModal
          isOpen={showMoodUpdate}
          onClose={() => setShowMoodUpdate(false)}
          currentMood={userSetup.mood || ''}
          onSave={handleMoodUpdate}
        />
      )}
    </div>
  );
}

export default App;
