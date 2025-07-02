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

  const [screenWidth, setScreenWidth] = useState(800); // default until measured
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

  const SPRITE_WIDTH = 48;
  const EDGE_BUFFER = 4;

  // Set clamping bounds and measure screen on mount
  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      setScreenWidth(container.offsetWidth);
    }

    const gameHeight = (50 * window.innerHeight) / 100;
    const characterHeight = SPRITE_WIDTH;
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
      if (gameOver) return;

      setElapsed(Math.floor((time - start) / 1000));
      setBgOffset((prev) => (prev - 2) % 1000);

      const playerX = 0.25 * screenWidth;
      const finishScreenX = finishX - scrollX;

      const playerSize = SPRITE_WIDTH;
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
  }, [scrollX, elapsed, coins, gameOver, screenWidth]);

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

  // Compute X positions based on screen width
  const player1StartX = (0 + (screenWidth / 2 - SPRITE_WIDTH - EDGE_BUFFER)) / 2;
  const player2StartX = (screenWidth / 2 + EDGE_BUFFER + (screenWidth - SPRITE_WIDTH - EDGE_BUFFER)) / 2;

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full rounded-xl border border-white/20 overflow-hidden"
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
      />

      <Player2
        sprite="/characters/toad.png"
        minY={minY}
        maxY={maxY}
        initialX={player2StartX}
        initialY={playerY}
        screenWidth={screenWidth}
        side="right"
      />

      {scrollX >= 3000 && !gameOver && (
        <FinishLine finishX={finishX} scrollX={scrollX} />
      )}

      <HUD coins={coins} elapsed={elapsed} />

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
