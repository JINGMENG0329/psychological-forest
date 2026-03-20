import { useState } from 'react';
import { supabase } from '../lib/supabase';

export default function AuthModal({ onLogin }: { onLogin: () => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setMessage(error.message);
    } else {
      onLogin();
    }
    setLoading(false);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) {
      setMessage(error.message);
    } else {
      setMessage('注册成功！请查看邮箱确认链接。');
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white/95 backdrop-blur rounded-2xl p-6 w-full max-w-md shadow-2xl">
        <h2 className="text-2xl font-bold text-center mb-6">🌲 心理解压森林</h2>
        <form>
          <input
            type="email"
            placeholder="邮箱"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full p-3 mb-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-300"
            required
          />
          <input
            type="password"
            placeholder="密码"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full p-3 mb-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-300"
            required
          />
          <div className="flex gap-3">
            <button
              onClick={handleLogin}
              disabled={loading}
              className="flex-1 bg-green-600 text-white py-2 rounded-xl hover:bg-green-700 transition disabled:opacity-50"
            >
              登录
            </button>
            <button
              onClick={handleSignUp}
              disabled={loading}
              className="flex-1 bg-stone-600 text-white py-2 rounded-xl hover:bg-stone-700 transition disabled:opacity-50"
            >
              注册
            </button>
          </div>
          {message && <p className="text-sm text-red-500 mt-3 text-center">{message}</p>}
        </form>
      </div>
    </div>
  );
}
