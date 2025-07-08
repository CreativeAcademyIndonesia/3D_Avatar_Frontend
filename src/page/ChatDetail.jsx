import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useChat } from '../hooks/useChat';
import Swal from 'sweetalert2';
import { 
  ArrowLeftIcon, 
  CalendarIcon, 
  ChatBubbleLeftRightIcon,
  UserCircleIcon,
  CommandLineIcon
} from '@heroicons/react/24/solid';
import { motion } from 'framer-motion';

const backendUrl = import.meta.env.VITE_GCC_NODE_SERVER;

export function ChatDetail() {
  const { nama } = useParams();
  const navigate = useNavigate();
  const { token } = useChat();
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedChat, setSelectedChat] = useState(null);

  const fetchChatDetail = async () => {
    try {
      const authToken = token || localStorage.getItem('authToken');
      
      if (!authToken) {
        throw new Error('Token tidak ditemukan');
      }

      const response = await fetch(`${backendUrl}avatar/chat/dashboard/detail?nama=${nama}`, {
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Gagal mengambil data chat');
      }
      const data = await response.json();
      setChatHistory(data.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching chat detail:', error);
      Swal.fire({
        icon: 'error',
        title: 'Fetch Failed!',
        text: error.message,
        showCloseButton: false,
        showConfirmButton: false,
      });
    }
  };

  useEffect(() => {
    fetchChatDetail();
  }, [nama, token]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-white">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 2,
            ease: "easeInOut",
            repeat: Infinity,
          }}
          className="h-16 w-16 border-4 border-indigo-600 rounded-full border-t-transparent"
        />
      </div>
    );
  }

  const chatContainerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const messageVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Navigation Bar */}
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 100 }}
        className="bg-white shadow-lg backdrop-blur-md bg-white/80 sticky top-0 z-50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/dashboard')}
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors"
              >
                <ArrowLeftIcon className="h-5 w-5 mr-2" />
                Kembali ke Dashboard
              </motion.button>
            </div>
            <motion.div 
              className="flex items-center space-x-4"
              initial={{ x: 100 }}
              animate={{ x: 0 }}
              transition={{ type: "spring", stiffness: 100 }}
            >
              <div className="flex items-center space-x-2 bg-white/50 backdrop-blur-sm px-4 py-2 rounded-full shadow-md">
                <ChatBubbleLeftRightIcon className="h-5 w-5 text-indigo-600" />
                <span className="text-sm font-medium text-gray-600">{chatHistory.length} Percakapan</span>
              </div>
              <div className="flex items-center">
                <motion.div 
                  whileHover={{ scale: 1.1 }}
                  className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg"
                >
                  <span className="text-white font-medium">{nama[0].toUpperCase()}</span>
                </motion.div>
                <div className="ml-3">
                  <div className="text-base font-medium text-gray-800">{nama}</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.nav>

      <main className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
        <motion.div 
          variants={chatContainerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-6 p-4"
        >
          {chatHistory.map((chat, index) => (
            <motion.div
              key={index}
              variants={messageVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: index * 0.1 }}
              className="flex flex-col space-y-3"
            >
              {/* User Message */}
              <motion.div 
                className="flex justify-end items-start space-x-2"
                whileHover={{ scale: 1.02 }}
              >
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl px-6 py-3 max-w-md shadow-lg hover:shadow-xl transition-shadow">
                  <div className="text-sm">{chat.human_message}</div>
                </div>
                <div className="flex-shrink-0">
                  <UserCircleIcon className="h-8 w-8 text-indigo-600" />
                </div>
              </motion.div>

              {/* AI Response */}
              <motion.div 
                className="flex justify-start items-start space-x-2"
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex-shrink-0">
                  <div className="h-8 w-8 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 flex items-center justify-center">
                    <CommandLineIcon className="h-5 w-5 text-white" />
                  </div>
                </div>
                <div className="bg-white rounded-2xl px-6 py-3 max-w-md shadow-lg hover:shadow-xl transition-shadow">
                  <div className="text-sm text-gray-800">{chat.ai_message}</div>
                  <div className="mt-2 flex items-center text-xs text-gray-500">
                    <CalendarIcon className="h-4 w-4 mr-1" />
                    {formatDate(chat.created_at)}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          ))}

          {chatHistory.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-12"
            >
              <div className="bg-white/50 backdrop-blur-sm rounded-lg p-8 shadow-lg">
                <ChatBubbleLeftRightIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <div className="text-gray-500 text-lg">Belum ada percakapan</div>
              </div>
            </motion.div>
          )}
        </motion.div>
      </main>
    </div>
  );
} 