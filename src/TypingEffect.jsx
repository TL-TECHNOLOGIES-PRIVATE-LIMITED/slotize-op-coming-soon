import React from 'react';

const TypingEffect = ({ text = "Hello, World!", className = "" }) => {
  return (
    <div className={`inline-block font-mono text-lg ${className}`}>
      <style jsx>{`
        @keyframes typing {
          0% { width: 0 }
          50% { width: 100% }
          75% { width: 100% }
          100% { width: 0 }
        }
        @keyframes blink {
          50% { border-color: transparent }
        }
        .typing-text {
          animation: typing 3s steps(25) infinite,
                     blink 0.5s step-end infinite alternate;
        }
      `}</style>
      
      <div 
        className="typing-text whitespace-nowrap overflow-hidden border-r-2 border-current text-3xl sm:text-5xl text-white font-bold tracking-wider leading-tight"
        data-text={text}
      >
        {text}
      </div>
    </div>
  );
};

export default TypingEffect;