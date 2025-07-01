'use client';

import { useEffect, useRef, useState } from 'react';
import Player from './Player';

interface GameProps {
  mode: 'single' | 'multi';
}

export default function Game({ mode }: GameProps) {
  const [coins, setCoins] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [bgOffset, setBgOffset] = useState(0);
  const [playerY, setPlayerY] = useState(0);

  const [minY, setMinY] = useState(0);
  const [maxY, setMaxY] = useState(0);

  const requestRef = useRef<number>(0);

  // Set clamping bounds on mount
  useEffect(() => {
    const gameHeight = (50 * window.innerHeight) / 100;
    const characterHeight = 48;
    const halfChar = characterHeight / 2;

    const trackTop = gameHeight * 0.8;
    const trackBottom = gameHeight;

    const max = trackBottom - halfChar - gameHeight / 2;

    // Expand playable space above track
    const extraVerticalRange = 40; // increase as needed
    const min = Math.max(-gameHeight / 2, trackTop + halfChar - gameHeight / 2 - extraVerticalRange);

    setMinY(min);
    setMaxY(max);
    setPlayerY(max); // Start at bottom edge
  }, []);

  // Game loop: timer + background scroll
  useEffect(() => {
    const start = performance.now();

    const update = (time: number) => {
      setElapsed(Math.floor((time - start) / 1000));
      setBgOffset((prev) => (prev - 2) % 1000);
      requestRef.current = requestAnimationFrame(update);
    };

    requestRef.current = requestAnimationFrame(update);
    return () => cancelAnimationFrame(requestRef.current);
  }, []);

  // Vertical movement
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp' || e.key === 'w') {
        setPlayerY((prev) => Math.max(minY, Math.min(prev - 20, maxY)));
      } else if (e.key === 'ArrowDown' || e.key === 's') {
        setPlayerY((prev) => Math.max(minY, Math.min(prev + 20, maxY)));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [minY, maxY]);

  return (
    <div
      className="relative w-full h-full rounded-xl border border-white/20 overflow-hidden"
      style={{
        backgroundImage: `url('/tracks/track1.png')`,
        backgroundRepeat: 'repeat-x',
        backgroundPosition: `${bgOffset}px 0px`,
        backgroundSize: 'auto 100%',
      }}
    >
      {/* Player */}
      <Player
        xPercent={25}
        y={playerY}
        sprite="/characters/toadette.png"
      />

      {/* HUD */}
      <div className="absolute top-2 left-4 text-white text-sm font-mono">
        🪙 {coins}
      </div>
      <div className="absolute top-2 left-1/2 transform -translate-x-1/2 text-white text-sm font-mono">
        ⏱ {elapsed}s
      </div>
    </div>
  );
}
