import { useRef } from "react";
import { useChat } from "../hooks/useChat";
import { marked } from 'marked';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlassPlus, faMagnifyingGlassMinus, faEraser } from '@fortawesome/free-solid-svg-icons';

export const UI = ({ hidden, ...props }) => {
  const input = useRef();
  const { chat, loading, cameraZoomed, setCameraZoomed, message, sessionId, rawMessages, setSessionId } = useChat();
  const sendMessage = () => {
    const text = input.current.value;
    if (!loading && !message) {
      chat(text);
      input.current.value = "";
    }
  };
  if (hidden) {
    return null;
  }

  return (
    <>
      <div className="fixed top-0 left-0 right-0 bottom-0 z-10 flex justify-between p-4 flex-col pointer-events-none ">
        <div className=" w-1/3 flex flex-col gap-2 justify-between h-full">
          <div className="self-start backdrop-blur-md bg-white bg-opacity-50 p-4 rounded-xl border-2 border-[#F4A927] w-full">
            <h1 className="font-semibold text-xl text-[#ff9d2e]">Teman Curhat</h1>
            <p className="text-sm text-slate-800" dangerouslySetInnerHTML={{ __html: rawMessages ? marked(Array.isArray(rawMessages) ? rawMessages.join('\n') : rawMessages) : "Belum ada pesan" }}></p>
          </div>
          <div className="flex items-center gap-2 pointer-events-auto max-w-screen-sm mx-auto self-start w-full">
            <input
              className="w-full placeholder:text-slate-800 placeholder:italic p-4 bg-opacity-30 bg-white backdrop-blur-md rounded-2xl outline-2 outline-offset-1 focus:outline focus:outline-[#F4A927]"
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
              className={`bg-[#F4A927] hover:bg-[#f4a227] text-white p-4 px-10 font-semibold uppercase rounded-2xl ${
                loading || message ? "cursor-not-allowed opacity-30" : ""
              }`}
            >
              Send
            </button>
          </div>
        </div>
        <div className="fixed  bottom-4 right-4">
          <div className="flex flex-col">
            <span className="text-white text-sm leading-none">Sesi Anda </span>
            <span className="text-white font-semibold text-lg">{sessionId || "-"}</span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setCameraZoomed(!cameraZoomed)}
              className="pointer-events-auto bg-[#F4A927] hover:bg-[#f4a227] text-white p-3 rounded-xl"
            >
              {cameraZoomed ? (
               <FontAwesomeIcon icon={faMagnifyingGlassPlus} />
              ) : (
                <FontAwesomeIcon icon={faMagnifyingGlassMinus} />
              )}
            </button>
            <button
              onClick={() => setSessionId(null)}
              className="pointer-events-auto bg-[#F4A927] hover:bg-[#f4a227] text-white p-3 rounded-xl"
            >
              <FontAwesomeIcon icon={faEraser} />
            </button>
          </div>
        </div>
        <div className="fixed bottom-8 w-1/2 translate-x-1/2">
          <p className="text-lg text-white text-center" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}>{message ? message.text : "Belum ada pesan"}</p>
        </div>
      </div>
    </>
  );
};
