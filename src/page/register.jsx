import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useChat } from '../hooks/useChat';
const backendUrl = import.meta.env.VITE_GCC_NODE_SERVER;

export function Register() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { setIsAuthenticated, setNama, token, setToken } = useChat();
  const [username, setUsername] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await fetch(`${backendUrl}avatar/chat/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password, nama: username }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.pesan || 'Registrasi gagal');
      }

      const data = await response.json();
      localStorage.setItem('authToken', data.token);
      setIsAuthenticated(true);
      setNama(username);
      setToken(data.token);
      navigate('/'); // Navigasi ke halaman utama setelah berhasil registrasi
    } catch (error) {
      console.error('Terjadi kesalahan saat registrasi:', error);
      setError(error.message || 'Terjadi kesalahan saat registrasi');
    }
  };

  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 z-10 flex justify-center items-center p-4 pointer-events-none">
      <div className="backdrop-blur-md bg-white bg-opacity-50 p-8 rounded-xl border-2 border-[#4651CE] w-full max-w-md pointer-events-auto">
        <h1 className="font-semibold text-2xl text-[#4651CE] mb-6">Register</h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="username" className="block mb-2 text-slate-800">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full placeholder:text-slate-800 placeholder:italic p-4 bg-opacity-30 bg-white backdrop-blur-md rounded-2xl outline-2 outline-offset-1 focus:outline focus:outline-[#4651CE]"
              placeholder='Masukan username Anda'
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block mb-2 text-slate-800">Password:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full placeholder:text-slate-800 placeholder:italic p-4 bg-opacity-30 bg-white backdrop-blur-md rounded-2xl outline-2 outline-offset-1 focus:outline focus:outline-[#4651CE]"
              placeholder='Masukan Password'
              required
            />
          </div>
          <button
            type="submit"
            className="bg-[#4651CE] hover:bg-[#4651CE] text-white p-4 px-10 font-semibold uppercase rounded-2xl w-full"
          >
            Daftar
          </button>
          <p className='text-center mt-4'>Sudah punya akun..? <a href='/login' className='text-[#4651CE] font-semibold'>Login</a></p>
        </form>
      </div>
    </div>
  );
}
