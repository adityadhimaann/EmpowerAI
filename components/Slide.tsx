import React from 'react';
import { SlideData, PresentationTheme } from '../types';
import { CheckCircleIcon, MicIcon } from './Icons';

interface SlideProps {
  slide: SlideData;
  isActive: boolean;
  theme: PresentationTheme;
}

const Slide: React.FC<SlideProps> = ({ slide, isActive, theme }) => {
  return (
    <div className={`w-full h-full p-8 md:p-12 flex flex-col justify-center text-left ${theme.font}`}>
      <h2
        className={`text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r ${theme.accent} mb-8 transition-all duration-500 ease-in-out ${
          isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}
        style={{ transitionDelay: '200ms' }}
      >
        {slide.title}
      </h2>
      <ul className="space-y-4">
        {slide.content.map((point, index) => (
          <li
            key={index}
            className={`flex items-start gap-4 text-lg md:text-xl text-gray-200 transition-all duration-500 ease-in-out ${
              isActive ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
            }`}
            style={{ transitionDelay: `${300 + index * 100}ms` }}
          >
            <CheckCircleIcon className="w-6 h-6 text-green-400 mt-1 flex-shrink-0" />
            <span>{point}</span>
          </li>
        ))}
      </ul>
      {slide.speakerNotes && (
        <div
          className={`mt-auto pt-6 border-t border-white/10 transition-opacity duration-500 ease-in-out ${isActive ? 'opacity-100' : 'opacity-0'}`}
          style={{ transitionDelay: '700ms' }}
        >
          <div className="flex items-center gap-3 text-indigo-300 mb-2">
            <MicIcon className="w-5 h-5"/>
            <h4 className="font-semibold">Speaker Notes</h4>
          </div>
          <p className="text-sm text-gray-400 italic">
            {slide.speakerNotes}
          </p>
        </div>
      )}
    </div>
  );
};

export default Slide;
