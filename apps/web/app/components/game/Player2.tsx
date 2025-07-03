// app/components/game/Player2.tsx
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
  setPosition: (pos: { x: number; y: number }) => void;
  stunned?: boolean;
  resetTrigger?: number; // NEW
}

export default function Player2({
  sprite,
  minY,
  maxY,
  initialX,
  initialY,
  screenWidth,
  side,
  setPosition,
  stunned = false,
  resetTrigger, // NEW
}: PlayerProps) {
  const SPEED = 20;
  const SPRITE_WIDTH = 48;
  const EDGE_BUFFER = 4;

  const rightMin = screenWidth / 2 + EDGE_BUFFER;
  const rightMax = screenWidth - SPRITE_WIDTH - EDGE_BUFFER;

  const [x, setX] = useState(initialX);
  const [y, setY] = useState(initialY);

  useEffect(() => {
    setX(initialX);
    setY(initialY);
    setPosition({ x: initialX, y: initialY });
  }, [initialX, initialY, setPosition, resetTrigger]); // 🔁 Watch for resetTrigger

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (stunned) return;

      if (e.key === 'ArrowLeft') {
        setX(prevX => Math.max(rightMin, prevX - SPEED));
      } else if (e.key === 'ArrowRight') {
        setX(prevX => Math.min(rightMax, prevX + SPEED));
      }

      if (e.key === 'ArrowUp') {
        setY(prevY => Math.max(minY, prevY - SPEED));
      } else if (e.key === 'ArrowDown') {
        setY(prevY => Math.min(maxY, prevY + SPEED));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [minY, maxY, rightMin, rightMax, stunned]);

  useEffect(() => {
    setPosition({ x, y });
  }, [x, y, setPosition]);

  return (
    <img
      src={sprite}
      alt="Player 2"
      className={`absolute transition-transform duration-75 ${stunned ? 'opacity-50 grayscale' : ''
        }`}
      style={{
        left: `${x}px`,
        top: `calc(50% + ${y}px)`,
        transform: 'translateY(-50%) scaleX(-1)',
        width: `48px`,
        height: `48px`,
        zIndex: 20,
      }}
    />
  );
}
