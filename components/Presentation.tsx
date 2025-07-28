import React, { useState, useEffect, useCallback } from 'react';
import { SlideData, PresentationTheme } from '../types';
import Slide from './Slide';
import ThemeEditor from './ThemeEditor';
import { ArrowLeftIcon, ArrowRightIcon, DownloadIcon, EditIcon } from './Icons';

interface PresentationProps {
  slides: SlideData[];
  theme: PresentationTheme;
  setTheme: (theme: PresentationTheme) => void;
}

const Presentation: React.FC<PresentationProps> = ({ slides, theme, setTheme }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    setCurrentSlide(0);
  }, [slides]);

  const goToNext = useCallback(() => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? prev : prev + 1));
  }, [slides.length]);

  const goToPrev = () => {
    setCurrentSlide((prev) => (prev === 0 ? prev : prev - 1));
  };

  const handleDownload = useCallback(() => {
    if (!slides) return;

    const markdownContent = slides
      .map(slide => {
        let content = `# ${slide.title}\n\n`;
        content += slide.content.map(point => `- ${point}`).join('\n');
        if (slide.speakerNotes) {
          content += `\n\n**Speaker Notes:**\n${slide.speakerNotes}`;
        }
        return content;
      })
      .join('\n\n---\n\n');

    const blob = new Blob([markdownContent], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'EmpowerAI-Pitch-Deck.md';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [slides]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        goToNext();
      } else if (e.key === 'ArrowLeft') {
        goToPrev();
      } else if (e.key === 'Escape') {
        setIsEditing(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [goToNext, goToPrev]);

  return (
    <div className={`w-full max-w-7xl h-full flex items-center justify-center animate-fade-in ${theme.font}`}>
      <div className="w-full max-w-5xl h-[600px] flex flex-col items-center justify-center relative">
        {/* Slide Container */}
        <div className="w-full h-[85%] bg-black/20 rounded-xl shadow-2xl backdrop-blur-lg border border-white/10 overflow-hidden relative">
          <div
            className="flex h-full transition-transform duration-700 ease-in-out"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {slides.map((slide, index) => (
              <div key={index} className="w-full h-full flex-shrink-0">
                <Slide slide={slide} isActive={index === currentSlide} theme={theme} />
              </div>
            ))}
          </div>
        </div>

        {/* Navigation & Controls */}
        <div className="w-full mt-6 flex items-center justify-between">
          <div className="w-36 flex justify-start">
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors p-2 rounded-md"
                title="Edit Theme"
              >
                <EditIcon className="w-5 h-5" />
                Edit
              </button>
          </div>

          <div className="flex items-center gap-4">
            <button onClick={goToPrev} disabled={currentSlide === 0} className="p-3 bg-white/10 rounded-full text-white disabled:text-gray-600 disabled:bg-white/5 hover:bg-white/20 transition-all" aria-label="Previous Slide">
              <ArrowLeftIcon className="w-6 h-6" />
            </button>
            <p className="text-gray-300 font-medium tabular-nums">
              {currentSlide + 1} / {slides.length}
            </p>
            <button onClick={goToNext} disabled={currentSlide === slides.length - 1} className="p-3 bg-white/10 rounded-full text-white disabled:text-gray-600 disabled:bg-white/5 hover:bg-white/20 transition-all" aria-label="Next Slide">
              <ArrowRightIcon className="w-6 h-6" />
            </button>
          </div>

          <div className="w-36 flex justify-end">
              <button onClick={handleDownload} className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors p-2 rounded-md" title="Download as Markdown">
                <DownloadIcon className="w-5 h-5" />
                Download
              </button>
          </div>
        </div>
      </div>
      <ThemeEditor isVisible={isEditing} onClose={() => setIsEditing(false)} currentTheme={theme} onSetTheme={setTheme} />
    </div>
  );
};

export default Presentation;
