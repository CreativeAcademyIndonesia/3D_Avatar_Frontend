import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane, faMicrophone, faSmile, faTimes } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';

export const ChatInput = ({ inputRef, onSend, onVoice, loading }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="fixed right-1/2 translate-x-1/2 -bottom-6 -translate-y-1/2 z-[9999] pointer-events-auto">
      <div className={`bg-white rounded-2xl shadow-lg transition-all duration-300 ease-in-out ${
        isExpanded ? 'w-80 md:w-96' : 'w-12 md:w-16 hover:w-16 md:hover:w-20'
      }`}>
        <div className="p-3 md:p-4 relative">
          {isExpanded && (
            <button
              onClick={() => setIsExpanded(false)}
              className="absolute -top-2 -right-2 w-6 h-6 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors duration-200 shadow-sm"
            >
              <FontAwesomeIcon icon={faTimes} className="w-3 h-3 text-gray-600" />
            </button>
          )}
          
          {isExpanded ? (
            <div className="space-y-2 md:space-y-4">
              <div className="flex items-center gap-1 md:gap-2">
                <div className="flex-1 relative">
                  <input
                    ref={inputRef}
                    className="w-full px-2 md:px-4 py-2 md:py-3 bg-gray-50 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-200 ease-in-out pr-8 md:pr-10 text-sm md:text-base"
                    placeholder="Ketik pesan..."
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        onSend();
                      }
                    }}
                  />
                </div>
                <button
                  onClick={onSend}
                  disabled={loading}
                  className={`p-2 md:p-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white transition-colors duration-200 ${
                    loading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  <FontAwesomeIcon 
                    icon={faPaperPlane} 
                    className="w-4 h-4 md:w-5 md:h-5" 
                  />
                </button>
                <button
                  onClick={onVoice}
                  className="p-2 md:p-3 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 transition-colors duration-200"
                >
                  <FontAwesomeIcon icon={faMicrophone} className="w-4 h-4 md:w-5 md:h-5" />
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setIsExpanded(true)}
              className="w-full h-full flex items-center justify-center p-1 md:p-2 hover:bg-gray-50 rounded-xl transition-colors duration-200"
            >
              <FontAwesomeIcon icon={faSmile} className="w-5 h-5 md:w-6 md:h-6 text-indigo-600" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}; 