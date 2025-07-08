import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useChat } from '../hooks/useChat';
import Swal from 'sweetalert2';
import { UserIcon, PencilSquareIcon } from '@heroicons/react/24/solid';

const backendUrl = import.meta.env.VITE_GCC_NODE_SERVER;

export function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token, role } = useChat();
  const navigate = useNavigate();

  useEffect(() => {
    if (role !== 'admin') {
      navigate('/');
      return;
    }
    fetchUsers();
  }, [token, role, navigate]);

  const fetchUsers = async () => {
    try {
      const response = await fetch(`${backendUrl}avatar/chat/get-all-user`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Gagal mengambil data pengguna');
      }

      const data = await response.json();
      setUsers(data.data);
      setLoading(false);
    } catch (error) {
      console.error('Error:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: error.message,
      });
    }
  };

  const handleUpdateUser = async (oldUsername, newData) => {
    try {
      const response = await fetch(`${backendUrl}avatar/chat/update-data-user`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: oldUsername,
          newData: {
            username: newData.username,
            role: newData.role
          }
        })
      });

      if (!response.ok) {
        throw new Error('Gagal mengupdate data pengguna');
      }

      await Swal.fire({
        icon: 'success',
        title: 'Berhasil!',
        text: 'Data pengguna berhasil diperbarui',
      });

      fetchUsers(); // Refresh data
    } catch (error) {
      console.error('Error:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: error.message,
      });
    }
  };

  const openUpdateModal = (user) => {
    Swal.fire({
      title: 'Update Data Pengguna',
      html: `
        <div class="space-y-3 px-1">
          <div class="flex flex-col">
            <label class="text-left text-sm font-medium text-gray-700" for="username">
              Username
            </label>
            <input
              type="text"
              id="username"
              class="mt-1 block w-full px-2 py-1.5 bg-white border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Username Baru"
              value="${user.username}"
            />
          </div>
          
          <div class="flex flex-col">
            <label class="text-left text-sm font-medium text-gray-700" for="role">
              Role
            </label>
            <select 
              id="role"
              class="mt-1 block w-full px-2 py-1.5 bg-white border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="user" ${user.role === 'user' ? 'selected' : ''}>User</option>
              <option value="admin" ${user.role === 'admin' ? 'selected' : ''}>Admin</option>
            </select>
          </div>
        </div>
      `,
      customClass: {
        container: 'custom-swal-container',
        popup: 'custom-swal-popup !w-[24rem] !p-0',
        title: 'custom-swal-title !text-lg !font-semibold !text-gray-900 !p-4 !pb-0 !mb-0 border-b',
        htmlContainer: 'custom-swal-html !p-4 !m-0',
        actions: 'custom-swal-actions !p-3 !m-0 !pt-0 flex justify-end gap-2 border-t',
        confirmButton: 'custom-swal-confirm !bg-indigo-600 !px-3 !py-1.5 !text-white !text-sm !font-medium !rounded-md hover:!bg-indigo-700 focus:!outline-none focus:!ring-2 focus:!ring-indigo-500 focus:!ring-offset-2',
        cancelButton: 'custom-swal-cancel !bg-white !px-3 !py-1.5 !text-gray-700 !text-sm !font-medium !rounded-md !border !border-gray-300 hover:!bg-gray-50 focus:!outline-none focus:!ring-2 focus:!ring-gray-500 focus:!ring-offset-2'
      },
      width: 'auto',
      padding: 0,
      showCancelButton: true,
      confirmButtonText: 'Update',
      cancelButtonText: 'Batal',
      buttonsStyling: false,
      focusConfirm: false,
      preConfirm: () => {
        const username = document.getElementById('username').value;
        const role = document.getElementById('role').value;
        
        if (!username || !role) {
          Swal.showValidationMessage(`
            <div class="text-red-600 text-xs px-1">
              Semua field harus diisi
            </div>
          `);
          return false;
        }
        
        return {
          username,
          role
        };
      }
    }).then((result) => {
      if (result.isConfirmed) {
        handleUpdateUser(user.username, result.value);
      }
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-5 sm:px-6 bg-white shadow-lg rounded-lg">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-900">Manajemen Pengguna</h2>
            <button
              onClick={() => navigate('/dashboard')}
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
            >
              Kembali ke Dashboard
            </button>
          </div>
        </div>

        <div className="mt-8">
          <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Username
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                            <UserIcon className="h-6 w-6 text-indigo-600" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{user.username}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.role}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => openUpdateModal(user)}
                        className="text-indigo-600 hover:text-indigo-900 flex items-center gap-2"
                      >
                        <PencilSquareIcon className="h-5 w-5" />
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
} 