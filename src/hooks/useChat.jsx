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
  const [nama, setNama] = useState(localStorage.getItem('nama') || null); // Ambil nama dari localStorage
  const [isAuthenticated, setIsAuthenticated] = useState(!!token);

  const chat = async (message) => {
    setLoading(true);
    try {
      const data = await fetch(`${backendUrl}avatar/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization" : `Bearer ${token}` // Perbaiki typo dari 'Bareer' ke 'Bearer'
        },
        body: JSON.stringify({
          "question": message,
          "sessionId": sessionId, 
          "nama" : nama
        }),
      });
      const response = await data.json();
      console.log(response)

      if(response.messages){
        const rawMessages = response.text;
        setRawMessages(rawMessages);
        const resp = response.messages;
        setMessages((messages) => [...messages, ...resp]);
        if (response.session) setSessionId(response.session);
      }
      setLoading(false);
    } catch (error) {
      console.error("Terjadi kesalahan:", error);
      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: error.message,
        showCloseButton: false,
        showConfirmButton: false,
      });
    } finally {
      setLoading(false);
    }
  };

  const onMessagePlayed = () => {
    setMessages((messages) => messages.slice(1));
  };

  useEffect(() => {
    if (token) {
      console.log(token)
      setIsAuthenticated(true);
    }

    if (messages.length > 0) {
      setMessage(messages[0]);
    } else {
      setMessage(null);
    }
  }, [messages, token]);

  // Simpan nama ke localStorage saat berubah
  useEffect(() => {
    if (nama) {
      localStorage.setItem('nama', nama);
    }
  }, [nama]);

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
        setToken,
        token,
        isAuthenticated,
        setIsAuthenticated,
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
