'use client';

import { useEffect, useState } from 'react';

interface PlayerProps {
  sprite: string;
  minY: number;
  maxY: number;
  initialX: number;
  initialY: number;
  screenWidth: number;
  side: 'left' | 'right';
}

export default function Player2({ sprite, minY, maxY, initialX, initialY, screenWidth }: PlayerProps) {
  const SPEED = 20;
  const SPRITE_WIDTH = 48;
  const EDGE_BUFFER = 4;

  const rightMin = screenWidth / 2 + EDGE_BUFFER;
  const rightMax = screenWidth - SPRITE_WIDTH - EDGE_BUFFER;

  const [x, setX] = useState(0);
  const [y, setY] = useState(0);

  // Set initial X/Y after Game.tsx loads them
  useEffect(() => {
    setX(initialX);
    setY(initialY);
  }, [initialX, initialY]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      setX(prevX => {
        if (e.key === 'ArrowLeft') return Math.max(rightMin, prevX - SPEED);
        if (e.key === 'ArrowRight') return Math.min(rightMax, prevX + SPEED);
        return prevX;
      });

      setY(prevY => {
        if (e.key === 'ArrowUp') return Math.max(minY, prevY - SPEED);
        if (e.key === 'ArrowDown') return Math.min(maxY, prevY + SPEED);
        return prevY;
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [minY, maxY, rightMin, rightMax]);

  return (
    <img
      src={sprite}
      alt="Player 2"
      className="absolute"
      style={{
        left: `${x}px`,
        top: `calc(50% + ${y}px)`,
        transform: 'translateY(-50%) scaleX(-1)',
        width: `${SPRITE_WIDTH}px`,
        height: `${SPRITE_WIDTH}px`,
        zIndex: 20,
      }}
    />
  );
}
