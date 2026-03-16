import React, { useState } from 'react';
import { API_BASE_URL } from '../config';
import type { User } from '../types';
import type { Page } from '../App';

interface LoginPageProps {
  onLogin: (token: string, user: User) => void;
  setCurrentPage: (page: Page) => void;
}

export default function LoginPage({ onLogin, setCurrentPage }: LoginPageProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      onLogin(data.access_token, data.user);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || 'Something went wrong. Please try again.');
      } else {
        setError('Something went wrong. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white relative overflow-hidden">
      {/* Abstract Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[60%] bg-gray-50 rounded-full blur-3xl opacity-50"></div>
        <div className="absolute bottom-[-5%] left-[-5%] w-[30%] h-[50%] bg-gray-50 rounded-full blur-3xl opacity-50"></div>
      </div>

      <div className="max-w-md w-full px-8 relative z-10">
        <div className="mb-12 text-center">
          <div className="inline-block mb-6">
            <div className="flex flex-col items-center">
              <span className="text-4xl font-black text-black tracking-tighter uppercase leading-none">
                Elite Auto
              </span>
              <span className="text-xs font-bold text-gray-400 tracking-[0.5em] uppercase leading-none mt-2">
                Management
              </span>
            </div>
          </div>
          <h2 className="text-xl font-bold text-gray-900 uppercase tracking-widest">
            Identity Verification
          </h2>
        </div>

        <form className="space-y-8" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded shadow-sm animate-in fade-in slide-in-from-top-2 duration-300">
              <p className="text-xs font-black uppercase tracking-tight">{error}</p>
            </div>
          )}
          
          <div className="space-y-6">
            <div className="relative group">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] absolute -top-2.5 left-4 bg-white px-2 z-10 transition-colors group-focus-within:text-black">
                Operator ID
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                className="block w-full px-5 py-4 bg-white border-2 border-gray-100 rounded-2xl text-black font-bold focus:outline-none focus:border-black focus:ring-0 transition-all duration-300 placeholder-gray-200"
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div className="relative group">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] absolute -top-2.5 left-4 bg-white px-2 z-10 transition-colors group-focus-within:text-black">
                Security Key
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="block w-full px-5 py-4 bg-white border-2 border-gray-100 rounded-2xl text-black font-bold focus:outline-none focus:border-black focus:ring-0 transition-all duration-300 placeholder-gray-200"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div className="pt-4 space-y-4">
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full flex justify-center py-5 px-4 border-2 border-black text-xs font-black uppercase tracking-[0.3em] rounded-2xl text-white bg-black hover:bg-white hover:text-black transition-all duration-500 transform active:scale-95 shadow-xl shadow-black/10 ${
                isLoading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isLoading ? (
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Authenticating...</span>
                </div>
              ) : 'Authorize Access'}
            </button>
            
            <button
              type="button"
              onClick={() => setCurrentPage('home')}
              className="w-full text-center py-2 text-[10px] font-bold text-gray-400 hover:text-black transition-colors uppercase tracking-[0.2em]"
            >
              ← Terminate and Return
            </button>
          </div>
        </form>

        <div className="mt-20 pt-8 border-t border-gray-50 text-center">
          <p className="text-[9px] font-bold text-gray-300 uppercase tracking-[0.3em]">
            Secure Administrative Gateway v2.0
          </p>
        </div>
      </div>
    </div>
  );
}
