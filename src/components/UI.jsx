import { useRef } from "react";
import { useChat } from "../hooks/useChat";
import { ChatMessage } from "./ChatMessage";
import { ChatInput } from "./ChatInput";
import { UserControls } from "./UserControls";
import { Leva } from "leva";

export const UI = ({ hidden, ...props }) => {
  const input = useRef();
  const {
    chat,
    loading,
    message,
    sessionId,
    rawMessages,
    setSessionId,
    nama
  } = useChat();

  const sendMessage = () => {
    const text = input.current.value;
    if (!loading && !message) {
      chat(text);
      input.current.value = "";
    }
  };

  const startSpeechRecognition = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.lang = 'id-ID';

    recognition.onstart = () => {
      console.log("Voice recognition started. Speak into the microphone.");
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      input.current.value = transcript;
      sendMessage();
    };

    recognition.onend = () => {
      console.log("Voice recognition ended.");
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
    };

    recognition.start();
  };

  if (hidden) {
    return null;
  }

  return (
    <div className="fixed inset-0 flex flex-col z-[9999]">
      <Leva hidden/>
      {/* Main chat area */}
      <div className="flex-1 overflow-hidden relative z-[1]">
        <div className="h-full max-w-4xl mx-auto flex flex-col justify-end">
          {/* Empty space for 3D view */}
          <div className="flex-1"></div>
          
          {/* Chat message at bottom */}
          <div className="w-full mb-32">
            <ChatMessage messages={message} />
          </div>
        </div>
      </div>

      {/* Chat input - now positioned independently */}
      <ChatInput
        inputRef={input}
        onSend={sendMessage}
        onVoice={startSpeechRecognition}
        loading={loading}
        message={message}
      />

      {/* User controls with higher z-index */}
      <div className="relative z-[9999] pointer-events-auto">
        <UserControls
          nama={nama}
          sessionId={sessionId}
          onResetSession={() => setSessionId(null)}
          isAdmin={nama === "adminsupport"}
        />
      </div>
    </div>
  );
};
