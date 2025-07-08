import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useChat } from '../hooks/useChat';
import { LockClosedIcon, UserIcon } from '@heroicons/react/24/solid';
import backgroundLogin from '../assets/images/background-login.jpg';
const backendUrl = import.meta.env.VITE_GCC_NODE_SERVER;

export function Login() {
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const {
    setIsAuthenticated,
    setNama,
    setRole,
    token,
    setToken,
    error,
    setError,
    isAuthenticated,
    role
  } = useChat();
  const navigate = useNavigate();

  useEffect(() => {
    setError('');
  }, [setError]);

  useEffect(() => {
    if (isAuthenticated) {
      if (role === 'admin') {
        navigate('/dashboard');
      } else {
        navigate('/');
      }
    }
  }, [isAuthenticated, role, navigate]);

  const handleSubmit = async(e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await fetch(`${backendUrl}avatar/chat/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password, nama: username }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Login gagal');
      }
      
      const data = await response.json();
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('role', data.role);
      setIsAuthenticated(true);
      setNama(username);
      setRole(data.role);
      setToken(data.token);

      // Redirect berdasarkan role
      if (data.role === 'admin') {
        navigate('/dashboard');
      } else {
        navigate('/');
      }
      
      return data.token;
    } catch (error) {
      console.error('Terjadi kesalahan saat login:', error);
      setError(error.message || 'Terjadi kesalahan saat login');
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - Image */}
      <div className="hidden lg:block lg:w-3/5">
        <div 
          className="h-full w-full bg-cover bg-center"
          style={{
            backgroundImage: `url(${backgroundLogin})`,
            height: '100vh'
          }}
        >
          <div className="h-full w-full bg-black bg-opacity-20 flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-5xl font-bold text-white mb-4">Selamat Datang di Avatar Lecturer</h1>
              <p className="text-2xl text-white">Platform Pembelajaran Interaktif</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Login Form */}
      <div className="w-full lg:w-2/5 flex items-center justify-center bg-gradient-to-br from-gray-50 to-white">
        <div className="w-full max-w-[400px] px-8">
          <div className="mb-12">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-2">
              Masuk
            </h2>
            <p className="text-sm text-gray-600">
              Silakan masuk untuk melanjutkan
            </p>
          </div>
          
          {error && (
            <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-8">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <UserIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="block w-full pl-10 pr-3 py-4 border border-gray-300 rounded-lg placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent sm:text-sm"
                  placeholder="Username"
                />
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <LockClosedIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-3 py-4 border border-gray-300 rounded-lg placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent sm:text-sm"
                  placeholder="Password"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-4 px-4 border border-transparent rounded-lg text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 ease-in-out relative"
              >
                <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                  <LockClosedIcon className="h-5 w-5 text-indigo-500 group-hover:text-indigo-400" aria-hidden="true" />
                </span>
                Masuk
              </button>
            </div>

            <div className="flex items-center justify-center mt-8">
              <div className="text-sm">
                Belum punya akun?{' '}
                <a href="/register" className="font-medium text-indigo-600 hover:text-indigo-500">
                  Daftar sekarang
                </a>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}