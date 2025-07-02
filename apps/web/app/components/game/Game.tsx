'use client';

import { useEffect, useRef, useState } from 'react';
import Player from './Player';
import Player2 from './Player2';
import Track from './Track';
import FinishLine from './FinishLine';
import HUD from './HUD';
import GameOverScreen from './GameOverScreen';

interface GameProps {
  mode: 'single' | 'multi';
  onReturnToMenu?: () => void;
}

export default function Game({ mode, onReturnToMenu }: GameProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const [screenWidth, setScreenWidth] = useState(800);
  const [bgOffset, setBgOffset] = useState(0);
  const [scrollX, setScrollX] = useState(0);
  const [playerY, setPlayerY] = useState(0);
  const [minY, setMinY] = useState(0);
  const [maxY, setMaxY] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [finalStats, setFinalStats] = useState<{ time: number; coins: number } | null>(null);
  const requestRef = useRef<number>(0);

  const SPRITE_WIDTH = 48;
  const EDGE_BUFFER = 4;

  const finishX = 4000;

  const [p1Item, setP1Item] = useState<null | 'banana' | 'shell'>(null);
  const [p2Item, setP2Item] = useState<null | 'banana' | 'shell'>(null);
  const [p1Box, setP1Box] = useState<{ x: number; y: number } | null>(null);
  const [p2Box, setP2Box] = useState<{ x: number; y: number } | null>(null);

  const [p1Pos, setP1Pos] = useState({ x: 0, y: 0 });
  const [p2Pos, setP2Pos] = useState({ x: 0, y: 0 });

  const [projectiles, setProjectiles] = useState<
    { x: number; y: number; type: 'banana' | 'shell' | 'banana_static'; direction: 'left' | 'right' }[]
  >([]);

  const [elapsed, setElapsed] = useState(0);

  // Setup
  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      setScreenWidth(container.offsetWidth);
      container.focus(); // ⬅️ ensure key events work
    }

    const gameHeight = (50 * window.innerHeight) / 100;
    const halfChar = SPRITE_WIDTH / 2;
    const trackTop = gameHeight * 0.8;
    const trackBottom = gameHeight;

    const max = trackBottom - halfChar - gameHeight / 2;
    const extraVerticalRange = 40;
    const min = Math.max(-gameHeight / 2, trackTop + halfChar - gameHeight / 2 - extraVerticalRange);

    setMinY(min);
    setMaxY(max);
    setPlayerY(max);
  }, []);

  // Timer loop
  useEffect(() => {
    const start = performance.now();
    const update = (time: number) => {
      setElapsed(Math.floor((time - start) / 1000));
      requestRef.current = requestAnimationFrame(update);
    };
    requestRef.current = requestAnimationFrame(update);
    return () => cancelAnimationFrame(requestRef.current);
  }, []);

  // Spawn item boxes
  useEffect(() => {
    const interval = setInterval(() => {
      if (!p1Box && !p1Item) {
        const x = Math.floor(Math.random() * (screenWidth / 2 - 64));
        const y = Math.floor(Math.random() * (maxY - minY)) + minY;
        setP1Box({ x, y });
      }

      if (!p2Box && !p2Item) {
        const x = Math.floor(Math.random() * (screenWidth / 2 - 64)) + screenWidth / 2;
        const y = Math.floor(Math.random() * (maxY - minY)) + minY;
        setP2Box({ x, y });
      }
    }, 7000);

    return () => clearInterval(interval);
  }, [p1Box, p2Box, p1Item, p2Item, screenWidth, minY, maxY]);

  // Item pickup
  useEffect(() => {
    if (p1Box && !p1Item) {
      const dx = Math.abs(p1Box.x - p1Pos.x);
      const dy = Math.abs(p1Box.y - p1Pos.y);
      if (dx < 40 && dy < 40) {
        setP1Item(Math.random() < 0.5 ? 'banana' : 'shell');
        setP1Box(null);
      }
    }

    if (p2Box && !p2Item) {
      const dx = Math.abs(p2Box.x - p2Pos.x);
      const dy = Math.abs(p2Box.y - p2Pos.y);
      if (dx < 40 && dy < 40) {
        setP2Item(Math.random() < 0.5 ? 'banana' : 'shell');
        setP2Box(null);
      }
    }
  }, [p1Box, p2Box, p1Item, p2Item, p1Pos, p2Pos]);

  // Animate projectiles
  useEffect(() => {
    const interval = setInterval(() => {
      setProjectiles(prev =>
        prev
          .map(p => {
            if (p.type === 'shell') {
              const newX = p.direction === 'right' ? p.x + 12 : p.x - 12;
              const isOffscreen = newX < 0 || newX > screenWidth;
              return isOffscreen ? null : { ...p, x: newX };
            }

            if (p.type === 'banana') {
              const dx = p.direction === 'right' ? 8 : -8;
              const newX = p.x + dx;
              const maxDist = screenWidth * 0.4;
              return Math.abs(newX - p.x) >= maxDist
                ? { ...p, type: 'banana_static' }
                : { ...p, x: newX };
            }

            return p; // banana_static
          })
          .filter(Boolean) as typeof projectiles
      );
    }, 50);

    return () => clearInterval(interval);
  }, [screenWidth]);

  // Throwing items
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'f' && p1Item) {
      console.log('P1 threw', p1Item);
      setProjectiles(prev => [
        ...prev,
        {
          x: p1Pos.x + 24,
          y: p1Pos.y,
          type: p1Item,
          direction: 'right',
        },
      ]);
      setP1Item(null);
    }

    if (e.key === '/' && p2Item) {
      console.log('P2 threw', p2Item);
      setProjectiles(prev => [
        ...prev,
        {
          x: p2Pos.x,
          y: p2Pos.y,
          type: p2Item,
          direction: 'left',
        },
      ]);
      setP2Item(null);
    }
  };

  const player1StartX = (0 + (screenWidth / 2 - SPRITE_WIDTH - EDGE_BUFFER)) / 2;
  const player2StartX = (screenWidth / 2 + EDGE_BUFFER + (screenWidth - SPRITE_WIDTH - EDGE_BUFFER)) / 2;

  return (
    <div
      ref={containerRef}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      className="relative w-full h-full rounded-xl border border-white/20 overflow-hidden outline-none"
    >
      <Track />

      <Player
        sprite="/characters/toadette.png"
        minY={minY}
        maxY={maxY}
        initialX={player1StartX}
        initialY={playerY}
        screenWidth={screenWidth}
        side="left"
        setPosition={setP1Pos}
      />

      <Player2
        sprite="/characters/toad.png"
        minY={minY}
        maxY={maxY}
        initialX={player2StartX}
        initialY={playerY}
        screenWidth={screenWidth}
        side="right"
        setPosition={setP2Pos}
      />

      {/* Item Boxes */}
      {p1Box && (
        <div
          className="absolute w-8 h-8 bg-yellow-400 border-2 border-white rounded-sm text-center leading-8 font-bold"
          style={{
            left: `${p1Box.x}px`,
            top: `calc(50% + ${p1Box.y}px)`,
            transform: 'translateY(-50%)',
            zIndex: 10,
          }}
        >
          ❓
        </div>
      )}
      {p2Box && (
        <div
          className="absolute w-8 h-8 bg-yellow-400 border-2 border-white rounded-sm text-center leading-8 font-bold"
          style={{
            left: `${p2Box.x}px`,
            top: `calc(50% + ${p2Box.y}px)`,
            transform: 'translateY(-50%)',
            zIndex: 10,
          }}
        >
          ❓
        </div>
      )}

      {/* Projectiles */}
      {projectiles.map((p, i) => (
        <div
          key={i}
          className="absolute text-2xl"
          style={{
            left: `${p.x}px`,
            top: `calc(50% + ${p.y}px)`,
            transform: 'translateY(-50%)',
            zIndex: 15,
          }}
        >
          {p.type === 'shell' ? '🟢' : '🍌'}
        </div>
      ))}

      <HUD p1Hearts={3} p2Hearts={3} p1Item={p1Item} p2Item={p2Item} />
    </div>
  );
}
