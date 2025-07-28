import React, { useEffect, useState } from 'react';

interface Star {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  duration: number;
  delay: number;
  type: 'dot' | 'cross' | 'diamond';
}

const FloatingStars: React.FC = () => {
  const [stars, setStars] = useState<Star[]>([]);

  useEffect(() => {
    const generateStars = () => {
      const newStars: Star[] = [];
      const starCount = 60; // Number of stars

      for (let i = 0; i < starCount; i++) {
        const starTypes: ('dot' | 'cross' | 'diamond')[] = ['dot', 'cross', 'diamond'];
        newStars.push({
          id: i,
          x: Math.random() * 100, // Percentage position
          y: Math.random() * 100,
          size: Math.random() * 4 + 1, // Size between 1-5px
          opacity: Math.random() * 0.8 + 0.2, // Opacity between 0.2-1
          duration: Math.random() * 25 + 15, // Animation duration 15-40s
          delay: Math.random() * 15, // Delay 0-15s
          type: starTypes[Math.floor(Math.random() * starTypes.length)],
        });
      }
      setStars(newStars);
    };

    generateStars();
  }, []);

  const renderStar = (star: Star) => {
    const baseStyle = {
      left: `${star.x}%`,
      top: `${star.y}%`,
      opacity: star.opacity,
      animation: `float ${star.duration}s ease-in-out infinite, twinkle 3s ease-in-out infinite`,
      animationDelay: `${star.delay}s, ${star.delay * 0.5}s`,
    };

    switch (star.type) {
      case 'cross':
        return (
          <div
            key={star.id}
            className="absolute text-white filter-none"
            style={{
              ...baseStyle,
              fontSize: `${star.size * 2}px`,
              transform: 'translate(-50%, -50%)',
              filter: 'none',
              backfaceVisibility: 'hidden',
            }}
          >
            ✦
          </div>
        );
      case 'diamond':
        return (
          <div
            key={star.id}
            className="absolute bg-white filter-none"
            style={{
              ...baseStyle,
              width: `${star.size}px`,
              height: `${star.size}px`,
              transform: 'translate(-50%, -50%) rotate(45deg)',
              filter: 'none',
              backfaceVisibility: 'hidden',
            }}
          />
        );
      default: // dot
        return (
          <div
            key={star.id}
            className="absolute bg-white rounded-full filter-none"
            style={{
              ...baseStyle,
              width: `${star.size}px`,
              height: `${star.size}px`,
              transform: 'translate(-50%, -50%)',
              filter: 'none',
              backfaceVisibility: 'hidden',
            }}
          />
        );
    }
  };

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-5">
      {stars.map(renderStar)}
    </div>
  );
};

export default FloatingStars;
