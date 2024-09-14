import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
const backendUrl = import.meta.env.VITE_GCC_NODE_SERVER;


export function Login() {
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async(e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${backendUrl}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });
      
      if (!response.ok) {
        throw new Error('Login gagal');
      }
      
      const data = await response.json();
      // Menyimpan token ke localStorage
      localStorage.setItem('authToken', data.token);
      navigate('/'); // Navigasi ke halaman utama setelah berhasil login
      return data.token;
    } catch (error) {
      console.error('Terjadi kesalahan saat login:', error);
      throw error;
    }
    
  };

  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 z-10 flex justify-center items-center p-4 pointer-events-none">
      <div className="backdrop-blur-md bg-white bg-opacity-50 p-8 rounded-xl border-2 border-[#F4A927] w-full max-w-md pointer-events-auto">
        <h1 className="font-semibold text-2xl text-[#ff9d2e] mb-6">Masuk</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="password" className="block mb-2 text-slate-800">Kata Sandi:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full placeholder:text-slate-800 placeholder:italic p-4 bg-opacity-30 bg-white backdrop-blur-md rounded-2xl outline-2 outline-offset-1 focus:outline focus:outline-[#F4A927]"
              required
            />
          </div>
          <button 
            type="submit" 
            className="bg-[#F4A927] hover:bg-[#f4a227] text-white p-4 px-10 font-semibold uppercase rounded-2xl w-full"
          >
            Masuk
          </button>
        </form>
      </div>
    </div>
  );
}