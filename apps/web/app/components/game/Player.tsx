// app/components/game/Player.tsx
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
  stunned: boolean;
  resetTrigger?: number; // This is the key change
}

export default function Player({
  sprite,
  minY,
  maxY,
  initialX,
  initialY,
  screenWidth,
  side,
  setPosition,
  stunned,
  resetTrigger,
}: PlayerProps) {
  const SPEED = 20;
  const SPRITE_WIDTH = 48;
  const EDGE_BUFFER = 4;

  const leftMin = EDGE_BUFFER;
  const leftMax = screenWidth / 2 - SPRITE_WIDTH - EDGE_BUFFER;

  const [x, setX] = useState(initialX);
  const [y, setY] = useState(initialY);

  useEffect(() => {
    setX(initialX);
    setY(initialY);
    setPosition({ x: initialX, y: initialY });
  }, [initialX, initialY, setPosition, resetTrigger]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (stunned) return;

      let newX = x;
      let newY = y;

      if (e.key === 'a') {
        newX = Math.max(leftMin, x - SPEED);
      } else if (e.key === 'd') {
        newX = Math.min(leftMax, x + SPEED);
      }

      if (e.key === 'w') {
        newY = Math.max(minY, y - SPEED);
      } else if (e.key === 's') {
        newY = Math.min(maxY, y + SPEED);
      }

      if (newX !== x) setX(newX);
      if (newY !== y) setY(newY);
      setPosition({ x: newX, y: newY });
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [x, y, minY, maxY, setPosition, leftMin, leftMax, stunned]);

  return (
    <img
      src={sprite}
      alt="Player"
      className="absolute"
      style={{
        left: `${x}px`,
        top: `calc(50% + ${y}px)`,
        transform: 'translateY(-50%)',
        width: `48px`,
        height: `48px`,
        zIndex: 20,
      }}
    />
  );
}
