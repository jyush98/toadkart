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

export default function Player2({
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

  const rightMin = screenWidth / 2 + EDGE_BUFFER;
  const rightMax = screenWidth - SPRITE_WIDTH - EDGE_BUFFER;

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
        const newX = e.key === 'ArrowLeft'
          ? Math.max(rightMin, prevX - SPEED)
          : e.key === 'ArrowRight'
          ? Math.min(rightMax, prevX + SPEED)
          : prevX;

        setPosition({ x: newX, y });
        return newX;
      });

      setY(prevY => {
        const newY = e.key === 'ArrowUp'
          ? Math.max(minY, prevY - SPEED)
          : e.key === 'ArrowDown'
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
      alt="Player 2"
      className="absolute"
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
