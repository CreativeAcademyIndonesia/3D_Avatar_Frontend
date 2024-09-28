import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useChat } from '../hooks/useChat';
const backendUrl = import.meta.env.VITE_GCC_NODE_SERVER;

export function ResetPassword() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { token, nama } = useChat(); // Ambil token dari konteks
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await fetch(`${backendUrl}avatar/chat/update-users`, {
        method: 'PUT', // Gunakan PUT untuk pembaruan
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Tambahkan header Authorization
        },
        body: JSON.stringify({ password, nama }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.pesan || 'Update password gagal');
      }

      const data = await response.json();
      console.log(data);
      navigate('/'); // Navigasi ke halaman utama setelah berhasil update
    } catch (error) {
      console.error('Terjadi kesalahan saat update password:', error);
      setError(error.message || 'Terjadi kesalahan saat update password');
    }
  };

  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 z-10 flex justify-center items-center p-4 pointer-events-none">
      <div className="backdrop-blur-md bg-white bg-opacity-50 p-8 rounded-xl border-2 border-[#4651CE] w-full max-w-md pointer-events-auto">
        <h1 className="font-semibold text-2xl text-[#4651CE] mb-6">Update Password</h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="password" className="block mb-2 text-slate-800">Password Baru:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full placeholder:text-slate-800 placeholder:italic p-4 bg-opacity-30 bg-white backdrop-blur-md rounded-2xl outline-2 outline-offset-1 focus:outline focus:outline-[#4651CE]"
              placeholder='Masukan Password Baru'
              required
            />
          </div>
          <button
            type="submit"
            className="bg-[#4651CE] hover:bg-[#4651CE] text-white p-4 px-10 font-semibold uppercase rounded-2xl w-full"
          >
            Update Password
          </button>
          <p className='text-center mt-4'>Kembali ke <a href='/' className='text-[#4651CE] font-semibold'>Beranda</a></p>
        </form>
      </div>
    </div>
  );
}
