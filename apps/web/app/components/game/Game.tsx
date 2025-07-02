'use client';

import { useEffect, useRef, useState } from 'react';
import Player from './Player';
import Track from './Track';
import FinishLine from './FinishLine';
import HUD from './HUD';
import GameOverScreen from './GameOverScreen';

interface GameProps {
  mode: 'single' | 'multi';
  onReturnToMenu?: () => void;
}

export default function Game({ mode, onReturnToMenu }: GameProps) {
  const [coins, setCoins] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [bgOffset, setBgOffset] = useState(0);
  const [scrollX, setScrollX] = useState(0);
  const [playerY, setPlayerY] = useState(0);

  const [minY, setMinY] = useState(0);
  const [maxY, setMaxY] = useState(0);

  const [gameOver, setGameOver] = useState(false);
  const [finalStats, setFinalStats] = useState<{ time: number; coins: number } | null>(null);
  const requestRef = useRef<number>(0);

  const finishX = 4000;

  // Set clamping bounds on mount
  useEffect(() => {
    const gameHeight = (50 * window.innerHeight) / 100;
    const characterHeight = 48;
    const halfChar = characterHeight / 2;

    const trackTop = gameHeight * 0.8;
    const trackBottom = gameHeight;

    const max = trackBottom - halfChar - gameHeight / 2;
    const extraVerticalRange = 40;
    const min = Math.max(-gameHeight / 2, trackTop + halfChar - gameHeight / 2 - extraVerticalRange);

    setMinY(min);
    setMaxY(max);
    setPlayerY(max); // Start at bottom edge
  }, []);

  // Game loop
  useEffect(() => {
    const start = performance.now();

    const update = (time: number) => {
      if (gameOver) return; // Freeze game once it's over

      setElapsed(Math.floor((time - start) / 1000));
      setBgOffset((prev) => (prev - 2) % 1000);
      setScrollX((prev) => prev + 2);

      const screenWidth = window.innerWidth;
      const playerX = 0.25 * screenWidth;
      const finishScreenX = finishX - scrollX;

      const playerSize = 48;
      const finishWidth = 32;

      const isColliding =
        Math.abs(playerX - finishScreenX) < (playerSize + finishWidth) / 2;

      if (isColliding) {
        setGameOver(true);
        setFinalStats({ time: elapsed, coins });
        cancelAnimationFrame(requestRef.current);
        return;
      }

      requestRef.current = requestAnimationFrame(update);
    };

    requestRef.current = requestAnimationFrame(update);
    return () => cancelAnimationFrame(requestRef.current);
  }, [scrollX, elapsed, coins, gameOver]);

  // Vertical movement
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameOver) return;
      if (e.key === 'ArrowUp' || e.key === 'w') {
        setPlayerY((prev) => Math.max(minY, Math.min(prev - 20, maxY)));
      } else if (e.key === 'ArrowDown' || e.key === 's') {
        setPlayerY((prev) => Math.max(minY, Math.min(prev + 20, maxY)));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [minY, maxY, gameOver]);

  const handlePlayAgain = () => {
    setCoins(0);
    setElapsed(0);
    setBgOffset(0);
    setScrollX(0);
    setPlayerY(maxY);
    setGameOver(false);
    setFinalStats(null);
  };

  const handleMainMenu = () => {
    if (onReturnToMenu) onReturnToMenu();
  };

  return (
    <div className="relative w-full h-full rounded-xl border border-white/20 overflow-hidden">
      <Track bgOffset={bgOffset} />
      {/* Player */}
      <Player
        xPercent={25}
        y={playerY}
        sprite="/characters/toadette.png"
      />

      {/* Finish line (purple block) */}
      {scrollX >= 3000 && !gameOver && (
        <FinishLine finishX={finishX} scrollX={scrollX} />
      )}

      {/* HUD */}
      <HUD coins={coins} elapsed={elapsed} />

      {/* Game Over Screen */}
      {gameOver && finalStats && (
        <GameOverScreen
          time={finalStats.time}
          coins={finalStats.coins}
          onPlayAgain={handlePlayAgain}
          onMainMenu={handleMainMenu}
        />
      )}
    </div>
  );
}
