'use client';

import { useEffect, useRef, useState } from 'react';
import Player from './Player';

interface GameProps {
  mode: 'single' | 'multi';
}

export default function Game({ mode }: GameProps) {
  const [coins, setCoins] = useState(0);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const [bgOffset, setBgOffset] = useState(0);
  const [playerY, setPlayerY] = useState(() => {
    const gameHeight = typeof window !== "undefined" ? window.innerHeight * 0.5 : 0;
    const trackZoneHeight = gameHeight * 0.2;
    const trackTop = gameHeight - trackZoneHeight;

    return (trackTop + trackZoneHeight / 2) - gameHeight / 2;
  });
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);
  const requestRef = useRef<number>(0);

  // Scroll + Timer loop
  useEffect(() => {
    const start = performance.now();
    setStartTime(start);

    const update = (time: number) => {
      setElapsed(Math.floor((time - start) / 1000));
      setBgOffset((prev) => (prev - 2) % 1000);
      requestRef.current = requestAnimationFrame(update);
    };

    requestRef.current = requestAnimationFrame(update);
    return () => cancelAnimationFrame(requestRef.current);
  }, []);

  // Constrain movement to bottom 20% of game container
  const movePlayer = (delta: number) => {
    setPlayerY((prev) => {
      const gameHeight = window.innerHeight * 0.5;
      const trackZoneHeight = gameHeight * 0.2;
      const trackTop = gameHeight - trackZoneHeight;

      const characterHeight = 48; // in pixels — match your actual image height
      const halfChar = characterHeight / 2;

      const minY = trackTop - gameHeight / 2 + halfChar;
      const maxY = gameHeight / 2 - halfChar;

      const newY = prev + delta;
      return Math.max(Math.min(newY, maxY), minY);
    });
  };


  // Keyboard movement
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp' || e.key === 'w') {
        movePlayer(-10);
      } else if (e.key === 'ArrowDown' || e.key === 's') {
        movePlayer(10);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="w-screen h-screen bg-black flex items-center justify-center">
      <div
        className="relative w-[90vw] h-[50vh] overflow-hidden rounded-md border border-white/20"
        style={{
          backgroundImage: `url('/tracks/track1.png')`,
          backgroundRepeat: 'repeat-x',
          backgroundPosition: `${bgOffset}px 0px`,
          backgroundSize: 'auto 100%',
        }}
      >
        {/* Player */}
        {isHydrated &&
          <Player
            y={playerY}
            xPercent={25}
            sprite="/characters/toadette.png"
          />
        }

        {/* HUD */}
        <div className="absolute top-2 left-4 text-white text-sm font-mono">
          🪙 {coins}
        </div>
        <div className="absolute top-2 left-1/2 transform -translate-x-1/2 text-white text-sm font-mono">
          ⏱ {elapsed}s
        </div>
      </div>
    </div>
  );
}
