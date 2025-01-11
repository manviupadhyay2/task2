"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from "next/navigation";
import { useUserContext } from "@/context/userContext";
import { axiosClient } from "@/lib/axios-client";
import { User, KeyRound, Loader2 } from 'lucide-react';

interface AuthResponse {
  data: {
    id: string;
    username: string;
  };
  message: string;
}

export default function Home() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoginOrRegister, setIsLoginOrRegister] = useState<'login' | 'register'>('login');
  const [isLoading, setIsLoading] = useState(false);
  const { setUsername: setLoggedInUsername, setId, id } = useUserContext();

  useEffect(() => {
    if (id) {
      router.push('/chat');
    }
  }, [id, router]);

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    setError('');
    setIsLoading(true);

    if (!username.trim() || !password.trim()) {
      setError('Username and password are required');
      setIsLoading(false);
      return;
    }

    const url = isLoginOrRegister === 'register' ? 'register' : 'login';

    try {
      const response = await axiosClient.post<AuthResponse>(`/auth/${url}`, {
        username: username.trim(),
        password: password.trim()
      });

      if (response.data?.data?.id) {
        setLoggedInUsername(response.data.data.username);
        setId(response.data.data.id);
        setUsername('');
        setPassword('');
        router.push('/chat');
      } else {
        setError('Invalid response from server');
      }
    } catch (error: any) {
      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else if (error.response?.status === 400) {
        setError(`${isLoginOrRegister === 'register' ? 'Registration' : 'Login'} failed. Please check your credentials.`);
      } else {
        setError('An error occurred. Please try again later.');
      }
      console.error('Auth error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-xl p-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800">
              {isLoginOrRegister === 'login' ? 'Welcome Back!' : 'Create Account'}
            </h2>
            <p className="text-gray-600 mt-2">
              {isLoginOrRegister === 'login'
                ? 'Please sign in to continue'
                : 'Sign up for a new account'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 text-red-600 p-4 rounded-md text-sm flex items-center justify-center">
                <span className="flex-1">{error}</span>
              </div>
            )}

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-400" />
              </div>
              <input
                value={username}
                onChange={(ev) => setUsername(ev.target.value)}
                type="text"
                placeholder="Username"
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                autoComplete="username"
              />
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <KeyRound className="h-5 w-5 text-gray-400" />
              </div>
              <input
                value={password}
                onChange={(ev) => setPassword(ev.target.value)}
                type="password"
                placeholder="Password"
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                autoComplete="current-password"
              />
            </div>

            <button
              className="w-full flex items-center justify-center px-4 py-3 border border-transparent rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5" />
                  Processing...
                </>
              ) : (
                isLoginOrRegister === 'register' ? 'Create Account' : 'Sign In'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  {isLoginOrRegister === 'register' ? 'Already have an account?' : 'New here?'}
                </span>
              </div>
            </div>

            <button
              type="button"
              className="mt-4 text-blue-600 hover:text-blue-500 font-medium transition-colors duration-200"
              onClick={() => setIsLoginOrRegister(isLoginOrRegister === 'register' ? 'login' : 'register')}
            >
              {isLoginOrRegister === 'register' ? 'Sign in instead' : 'Create an account'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}