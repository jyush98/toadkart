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
}: PlayerProps) {
  const SPEED = 20;
  const SPRITE_WIDTH = 48;
  const EDGE_BUFFER = 4;

  const leftMin = 0;
  const leftMax = screenWidth / 2 - SPRITE_WIDTH - EDGE_BUFFER;

  const [x, setX] = useState(0);
  const [y, setY] = useState(0);

  useEffect(() => {
    setX(initialX);
    setY(initialY);
    setPosition({ x: initialX, y: initialY });
  }, [initialX, initialY, setPosition]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      setX(prevX => {
        const newX = e.key === 'a' || e.key === 'A'
          ? Math.max(leftMin, prevX - SPEED)
          : e.key === 'd' || e.key === 'D'
          ? Math.min(leftMax, prevX + SPEED)
          : prevX;

        setPosition({ x: newX, y });
        return newX;
      });

      setY(prevY => {
        const newY = e.key === 'w' || e.key === 'W'
          ? Math.max(minY, prevY - SPEED)
          : e.key === 's' || e.key === 'S'
          ? Math.min(maxY, prevY + SPEED)
          : prevY;

        setPosition({ x, y: newY });
        return newY;
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [minY, maxY, x, y, setPosition]);

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
