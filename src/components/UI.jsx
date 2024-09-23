import { useRef } from "react";
import { useChat } from "../hooks/useChat";
import { marked } from 'marked';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlassPlus, faMagnifyingGlassMinus, faEraser, faMicrophone } from '@fortawesome/free-solid-svg-icons';

export const UI = ({ hidden, ...props }) => {
  const input = useRef();
  const { chat, loading, cameraZoomed, setCameraZoomed, message, sessionId, rawMessages, setSessionId, nama } = useChat();
  const sendMessage = () => {
    console.log('start')
    const text = input.current.value;
    if (!loading && !message) {
      chat(text);
      input.current.value = "";
    }
  };

  const startSpeechRecognition = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
  
    // Set bahasa ke Bahasa Indonesia
    recognition.lang = 'id-ID'; // 'id-ID' adalah kode bahasa untuk Bahasa Indonesia
  
    recognition.onstart = () => {
      console.log("Voice recognition started. Speak into the microphone.");
    };
  
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      input.current.value = transcript; // Masukkan hasil ke input
      sendMessage(); // Kirim pesan
    };
  
    recognition.onend = () => {
      console.log("Voice recognition ended.");
      // setTimeout(sendMessage, 3000); // Kirim pesan setelah 3 detik (jika perlu)
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
    <>
      <div className="fixed top-0 left-0 right-0 bottom-0 z-10 flex justify-between p-4 flex-col pointer-events-none ">
        <div className="w-full md:w-1/3 flex flex-col gap-2 justify-between h-full">
          <div className="self-start backdrop-blur-md bg-white bg-opacity-50 p-4 rounded-xl border-2 border-[#4651CE] w-full">
            <h1 className="font-semibold text-xl text-[#4651CE]">Teman Curhat</h1>
            <p className="text-sm text-slate-800" dangerouslySetInnerHTML={{ __html: rawMessages ? marked(Array.isArray(rawMessages) ? rawMessages.join('\n') : rawMessages) : "Belum ada pesan" }}></p>
          </div>
          <div className="flex items-center gap-2 pointer-events-auto max-w-screen-sm mx-auto self-start w-full">
            <input
              className="w-full placeholder:text-slate-800 placeholder:italic p-4 bg-opacity-30 bg-white backdrop-blur-md rounded-2xl outline-2 outline-offset-1 focus:outline focus:outline-[#4651CE]"
              placeholder="Type a message..."
              ref={input}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  sendMessage();
                }
              }}
            />
            <button
              disabled={loading || message}
              onClick={sendMessage}
              className={`bg-[#4651CE] hover:bg-[#3640ac] text-white p-4 px-6 font-semibold uppercase rounded-2xl ${
                loading || message ? "cursor-not-allowed opacity-30" : ""
              }`}
            >
              Send
            </button>
            <button 
              onClick={startSpeechRecognition}
              className={`bg-[#4651CE] hover:bg-[#3640ac] text-white p-4 px-4 font-semibold uppercase rounded-2xl ${loading || message ? "cursor-not-allowed opacity-30" : ""}`}>
              <FontAwesomeIcon icon={faMicrophone} />
            </button>
          </div>
        </div>
        <div className="fixed bottom-32 md:bottom-4 right-4">
          <div className="flex flex-col">
            <span className="text-white text-sm leading-none">Active</span>
            <span className="text-white font-semibold text-lg">{nama || "-"}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-white text-sm leading-none">Sesi Anda </span>
            <span className="text-white font-semibold text-lg">{sessionId || "-"}</span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setCameraZoomed(!cameraZoomed)}
              className="pointer-events-auto bg-[#4651CE] hover:bg-[#3640ac] text-white p-3 rounded-xl"
            >
              {cameraZoomed ? (
               <FontAwesomeIcon icon={faMagnifyingGlassPlus} />
              ) : (
                <FontAwesomeIcon icon={faMagnifyingGlassMinus} />
              )}
            </button>
            <button
              onClick={() => setSessionId(null)}
              className="pointer-events-auto bg-[#4651CE] hover:bg-[#3640ac] text-white p-3 rounded-xl"
            >
              <FontAwesomeIcon icon={faEraser} />
            </button>
          </div>
        </div>
        <div className="fixed bottom-24 md:bottom-8 w-1/2 translate-x-1/2">
          <p className="text-lg text-white text-center" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}>{message ? message.text : "Belum ada pesan"}</p>
        </div>
      </div>
    </>
  );
};
