import { createContext, useContext, useEffect, useState } from "react";

// const backendUrl ="http://localhost:7500/avatar";
const backendUrl = import.meta.env.VITE_GCC_NODE_SERVER;
// const backendUrl = "http://localhost:3000";

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const [rawMessages, setRawMessages] = useState([]);
  const [message, setMessage] = useState();
  const [loading, setLoading] = useState(false);
  const [cameraZoomed, setCameraZoomed] = useState(true);
  const [sessionId, setSessionId] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('authToken') || null);
  const [nama, setNama] = useState(localStorage.getItem('nama') || null);
  const [role, setRole] = useState(localStorage.getItem('role') || null);
  const [isAuthenticated, setIsAuthenticated] = useState(!!token);
  const [error, setError] = useState('');
  const [audioInstance, setAudioInstance] = useState(null);

  // Effect untuk memperbarui state dari localStorage saat refresh
  useEffect(() => {
    const storedToken = localStorage.getItem('authToken');
    const storedNama = localStorage.getItem('nama');
    const storedRole = localStorage.getItem('role');
    
    if (storedToken) {
      setToken(storedToken);
      setIsAuthenticated(true);
    }
    
    if (storedNama) {
      setNama(storedNama);
    }

    if (storedRole) {
      setRole(storedRole);
    }
  }, []);

  // Effect untuk menyimpan nama ke localStorage saat berubah
  useEffect(() => {
    if (nama) {
      localStorage.setItem('nama', nama);
    }
  }, [nama]);

  // Effect untuk menyimpan role ke localStorage saat berubah
  useEffect(() => {
    if (role) {
      localStorage.setItem('role', role);
    }
  }, [role]);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('nama');
    localStorage.removeItem('role');
    setToken(null);
    setNama(null);
    setRole(null);
    setIsAuthenticated(false);
    setError('Sesi Anda telah berakhir. Silakan login kembali.');
  };

  const chat = async (message) => {
    setLoading(true);
    setError('');
    try {
      const data = await fetch(`${backendUrl}avatar/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization" : `Bearer ${token}`
        },
        body: JSON.stringify({
          "question": message,
          "sessionId": sessionId, 
          "nama" : nama
        }),
      });

      if (data.status === 403) {
        handleLogout();
        return;
      }

      const response = await data.json();
      console.dir(response, { depth: null });
      if(response.messages){
        const rawMessages = response.text;
        setRawMessages(rawMessages);
        
        // Process messages to ensure they have default values
        const processedMessages = response.messages.map(msg => ({
          ...msg,
          animation: msg.animation || "idle_three",
          facialExpression: msg.facialExpression || "default"
        }));
        
        setMessages((prevMessages) => [...prevMessages, ...processedMessages]);
        if (response.session) setSessionId(response.session);
      }
    } catch (error) {
      console.error("Terjadi kesalahan:", error);
      setError(error.message || 'Terjadi kesalahan saat memproses permintaan');
    } finally {
      setLoading(false);
    }
  };

  const onMessagePlayed = () => {
    setMessages((messages) => messages.slice(1));
  };

  useEffect(() => {
    if (messages.length > 0) {
      const currentMessage = messages[0];
      
      // Buat dan mainkan audio jika ada
      if (currentMessage.audio) {
        // Hentikan audio sebelumnya jika masih ada
        if (audioInstance) {
          audioInstance.pause();
          audioInstance.currentTime = 0;
        }
        
        const audio = new Audio("data:audio/mp3;base64," + currentMessage.audio);
        setAudioInstance(audio);
        
        audio.onended = () => {
          onMessagePlayed();
          setAudioInstance(null);
        };
        
        audio.play();
      }
      
      setMessage({
        ...currentMessage,
        animation: currentMessage.animation || "idle_three",
        facialExpression: currentMessage.facialExpression || "default"
      });
    } else {
      setMessage(null);
      // Bersihkan audio yang sedang berjalan
      if (audioInstance) {
        audioInstance.pause();
        audioInstance.currentTime = 0;
        setAudioInstance(null);
      }
    }
  }, [messages]);

  return (
    <ChatContext.Provider
      value={{
        chat,
        message,
        onMessagePlayed,
        loading,
        cameraZoomed,
        setCameraZoomed,
        sessionId,
        setSessionId,
        rawMessages, 
        nama,
        setNama,
        role,
        setRole,
        setToken,
        token,
        isAuthenticated,
        setIsAuthenticated,
        handleLogout,
        error,
        setError,
        audioInstance
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat harus digunakan dalam ChatProvider");
  }
  return context;
};
