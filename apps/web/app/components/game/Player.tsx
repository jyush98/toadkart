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
  stunned = false,
}: PlayerProps) {
  const SPEED = 20;
  const SPRITE_WIDTH = 48;
  const EDGE_BUFFER = 4;

  const leftMin = 0;
  const leftMax = screenWidth / 2 - SPRITE_WIDTH - EDGE_BUFFER;

  const [x, setX] = useState(initialX);
  const [y, setY] = useState(initialY);

  useEffect(() => {
    setX(initialX);
    setY(initialY);
  }, [initialX, initialY]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (stunned) return;

      if (e.key === 'a' || e.key === 'A') {
        setX(prevX => Math.max(leftMin, prevX - SPEED));
      } else if (e.key === 'd' || e.key === 'D') {
        setX(prevX => Math.min(leftMax, prevX + SPEED));
      }

      if (e.key === 'w' || e.key === 'W') {
        setY(prevY => Math.max(minY, prevY - SPEED));
      } else if (e.key === 's' || e.key === 'S') {
        setY(prevY => Math.min(maxY, prevY + SPEED));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [minY, maxY, leftMin, leftMax, stunned]);

  useEffect(() => {
    setPosition({ x, y });
  }, [x, y, setPosition]);

  return (
    <img
      src={sprite}
      alt="Player"
      className={`absolute transition-transform duration-75 ${stunned ? 'opacity-50 grayscale' : ''
        }`}
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
