'use client';

import { useEffect, useState } from 'react';

interface CPUPlayerProps {
  sprite: string;
  minY: number;
  maxY: number;
  initialX: number;
  initialY: number;
  screenWidth: number;
  side: 'left' | 'right';
  setPosition: (pos: { x: number; y: number }) => void;
  stunned?: boolean;

  p1Pos: { x: number; y: number };
  p2Item: 'banana' | 'shell' | null;
  setP2Item: (item: 'banana' | 'shell' | null) => void;
  p2Box: { x: number; y: number } | null;
  throwItem: (x: number, y: number, item: 'banana' | 'shell') => void;
}

export default function CPUPlayer({
  sprite,
  minY,
  maxY,
  initialX,
  initialY,
  screenWidth,
  side,
  setPosition,
  stunned = false,
  p1Pos,
  p2Item,
  setP2Item,
  p2Box,
  throwItem,
}: CPUPlayerProps) {
  const SPEED = 6;
  const SPRITE_WIDTH = 48;
  const EDGE_BUFFER = 4;

  const rightMin = screenWidth / 2 + EDGE_BUFFER;
  const rightMax = screenWidth - SPRITE_WIDTH - EDGE_BUFFER;

  const [x, setX] = useState(initialX);
  const [y, setY] = useState(initialY);

  useEffect(() => {
    setX(initialX);
    setY(initialY);
  }, [initialX, initialY]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (stunned) return;

      // Move toward Player 1 vertically
      if (p1Pos.y < y) setY(prev => Math.max(minY, prev - SPEED));
      if (p1Pos.y > y) setY(prev => Math.min(maxY, prev + SPEED));

      // Move toward item box horizontally
      if (p2Box) {
        if (p2Box.x < x) setX(prev => Math.max(rightMin, prev - SPEED));
        if (p2Box.x > x) setX(prev => Math.min(rightMax, prev + SPEED));
      }

      // Simulate item pickup
      if (p2Box && !p2Item) {
        const dx = Math.abs(p2Box.x - x);
        const dy = Math.abs(p2Box.y - y);
        if (dx < 40 && dy < 40) {
          const item = Math.random() < 0.5 ? 'banana' : 'shell';
          setP2Item(item);
        }
      }
    }, 100);

    return () => clearInterval(interval);
  }, [x, y, p1Pos, p2Box, minY, maxY, rightMin, rightMax, stunned, p2Item, setP2Item]);

  // Throw item on cooldown when Player 1 is horizontally aligned
  useEffect(() => {
    if (!p2Item || stunned) return;

    const timeout = setTimeout(() => {
      const verticalDistance = Math.abs(y - p1Pos.y);
      if (verticalDistance < 48) {
        throwItem(x - 48, y, p2Item); // throw left toward Player 1
        setP2Item(null);
      }
    }, 1500 + Math.random() * 1000); // 1.5–2.5s delay

    return () => clearTimeout(timeout);
  }, [p2Item, stunned, y, p1Pos.y, x, setP2Item, throwItem]);

  useEffect(() => {
    setPosition({ x, y });
  }, [x, y, setPosition]);

  return (
    <img
      src={sprite}
      alt="CPU Player"
      className={`absolute transition-transform duration-75 ${
        stunned ? 'opacity-50 grayscale' : ''
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
