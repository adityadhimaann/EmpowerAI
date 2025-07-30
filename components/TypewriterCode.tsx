import React, { useState, useEffect, useRef } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface TypewriterCodeProps {
  code: string;
  language: string;
  speed?: number; // Characters per second
  onComplete?: () => void;
  className?: string;
}

const TypewriterCode: React.FC<TypewriterCodeProps> = ({ 
  code, 
  language, 
  speed = 100, // Default 100 characters per second for better performance
  onComplete,
  className 
}) => {
  const [displayedCode, setDisplayedCode] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  const indexRef = useRef(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Reset state when code changes
    setDisplayedCode('');
    setIsComplete(false);
    indexRef.current = 0;

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    // Don't start animation if code is empty
    if (!code.trim()) {
      setDisplayedCode(code);
      setIsComplete(true);
      onComplete?.();
      return;
    }

    // Start typing animation
    intervalRef.current = setInterval(() => {
      if (indexRef.current < code.length) {
        // Add multiple characters at once for better performance with large files
        const charsToAdd = Math.min(3, code.length - indexRef.current);
        setDisplayedCode(prev => {
          const newCode = prev + code.slice(indexRef.current, indexRef.current + charsToAdd);
          
          // Auto-scroll to bottom
          setTimeout(() => {
            if (containerRef.current) {
              containerRef.current.scrollTop = containerRef.current.scrollHeight;
            }
          }, 0);
          
          return newCode;
        });
        indexRef.current += charsToAdd;
      } else {
        // Animation complete
        setIsComplete(true);
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
        onComplete?.();
      }
    }, (1000 / speed) * 3); // Adjust timing for multiple characters

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [code, speed, onComplete]);

  // Add blinking cursor effect
  const [showCursor, setShowCursor] = useState(true);
  
  useEffect(() => {
    if (!isComplete) {
      const cursorInterval = setInterval(() => {
        setShowCursor(prev => !prev);
      }, 500);
      
      return () => clearInterval(cursorInterval);
    } else {
      setShowCursor(false);
    }
  }, [isComplete]);

  const codeWithCursor = displayedCode + (showCursor && !isComplete ? '|' : '');

  return (
    <div ref={containerRef} className={`${className} custom-scrollbar`} style={{ overflow: 'auto' }}>
      <SyntaxHighlighter
        language={language}
        style={vscDarkPlus}
        customStyle={{
          background: 'transparent',
          width: '100%',
          minHeight: '100%',
          padding: '1rem',
          margin: '0',
        }}
        codeTagProps={{
          style: {
            fontFamily: '"Roboto Mono", monospace',
          },
        }}
      >
        {codeWithCursor}
      </SyntaxHighlighter>
    </div>
  );
};

export default TypewriterCode;
