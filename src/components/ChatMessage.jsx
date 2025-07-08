import { marked } from 'marked';
import { useEffect, useRef, useState } from 'react';
import { useChat } from '../hooks/useChat';

export const ChatMessage = ({ messages }) => {
  const containerRef = useRef(null);
  const [paragraphs, setParagraphs] = useState([]);
  const [currentParagraphIndex, setCurrentParagraphIndex] = useState(-1);
  const { message, audioInstance } = useChat();
  const [audioDuration, setAudioDuration] = useState(0);
  
  useEffect(() => {
    console.log("Messages from chat", messages);
    
    // Handle empty or invalid messages
    if (!messages) {
      setParagraphs(['Silahkan katakan sesuatu']);
      setCurrentParagraphIndex(0);
      return;
    }

    // Extract text from message object
    const messageText = typeof messages === 'string' ? messages : messages.text;
    
    if (!messageText || messageText.trim() === '') {
      setParagraphs(['Silahkan katakan sesuatu']);
      setCurrentParagraphIndex(0);
      return;
    }

    // Split messages into sentences
    const newParagraphs = messageText
      .split(/(?<=[.!?])\s+/)
      .filter(p => p.trim().length > 0);
    setParagraphs(newParagraphs);
    setCurrentParagraphIndex(-1); // Reset index
    
    // Get audio duration if message exists and audioInstance is available
    if (audioInstance) {
      setAudioDuration(audioInstance.duration);
      
      // Calculate total characters
      const totalCharacters = newParagraphs.reduce((sum, paragraph) => 
        sum + paragraph.length, 0
      );
      
      // Calculate time per character (in milliseconds)
      const timePerChar = (audioInstance.duration * 1000) / totalCharacters;
      
      // Calculate start time for each paragraph
      let currentStartTime = 0;
      
      newParagraphs.forEach((paragraph, index) => {
        // Calculate duration for this paragraph based on its length
        const paragraphDuration = paragraph.length * timePerChar;
        
        // Show current paragraph
        setTimeout(() => {
          setCurrentParagraphIndex(index);
          
          // Hide current paragraph after its duration (unless it's the last one)
          if (index < newParagraphs.length - 1) {
            setTimeout(() => {
              if (currentParagraphIndex === index) {
                setCurrentParagraphIndex(index + 1);
              }
            }, paragraphDuration - 100); // Slightly shorter for smooth transition
          }
        }, currentStartTime);
        
        // Update start time for next paragraph
        currentStartTime += paragraphDuration;
      });
    }
  }, [messages, message, audioInstance]);

  return (
    <div className="relative w-full max-w-3xl mx-auto">
      <div 
        ref={containerRef}
        className="min-h-[40px] max-h-[80px] px-4 py-2 flex items-center justify-center"
      >
        <div className="text-center">
          {paragraphs.map((paragraph, index) => (
            <p
              key={index}
              className={`
                text-sm md:text-lg leading-tight
                transition-all duration-500 ease-in-out
                absolute left-0 right-0 mx-auto px-4
                ${currentParagraphIndex === index 
                  ? 'opacity-100 transform translate-y-0'
                  : 'opacity-0 transform translate-y-4 pointer-events-none'}
                ${!messages?.audio ? 'text-gray-500 italic' : 'text-blue-900 font-medium'}
                break-words
              `}
            >
              {paragraph}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
};