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
  const [token, setToken] = useState(localStorage.getItem('authToken'));

  const chat = async (message) => {
    setLoading(true);
    try {
      const data = await fetch(`${backendUrl}/avatar/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // "Authorization" : `Bareer ${token}`
        },
        body: JSON.stringify({
          "question": message,
          "sessionId": sessionId
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
    } finally {
      setLoading(false);
    }
  };

  const onMessagePlayed = () => {
    setMessages((messages) => messages.slice(1));
  };

  useEffect(() => {
    const storedToken = localStorage.getItem('authToken');
    if (storedToken) {
      setToken(storedToken);
    }

    if (messages.length > 0) {
      setMessage(messages[0]);
    } else {
      setMessage(null);
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
        rawMessages
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
