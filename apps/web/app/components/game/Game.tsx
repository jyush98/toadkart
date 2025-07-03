'use client';

import { useEffect, useRef, useState } from 'react';
import Player from './Player';
import Player2 from './Player2';
import CPUPlayer from './CPUPlayer';
import Track from './Track';
import HUD from './HUD';
import GameOverScreen from './GameOverScreen';
import { useCharacterStore } from '../../store/useCharacterStore';
import { Projectile, Entity } from './types';
import { isColliding } from './utils/collision';
import { updateProjectiles } from './utils/updateProjectiles';
import { stunPlayer } from './utils/stunPlayer';
import { SPRITE_WIDTH, EDGE_BUFFER } from './utils/constants';
import ProjectileSprite from './Projectile';

interface GameProps {
  mode: 'single' | 'multi';
  onReturnToMenu?: () => void;
  p1Char: string;
  p2Char: string;
}

export default function Game({ mode, onReturnToMenu, p1Char, p2Char }: GameProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [screenWidth, setScreenWidth] = useState(800);
  const [minY, setMinY] = useState(0);
  const [maxY, setMaxY] = useState(0);
  const [playerY, setPlayerY] = useState(0);
  const [p1Hearts, setP1Hearts] = useState(3);
  const [p2Hearts, setP2Hearts] = useState(3);
  const [p1Stunned, setP1Stunned] = useState(false);
  const [p2Stunned, setP2Stunned] = useState(false);
  const [gameOver, setGameOver] = useState<null | 'p1' | 'p2'>(null);
  const [p1Wins, setP1Wins] = useState(0);
  const [p2Wins, setP2Wins] = useState(0);
  const [p1Item, setP1Item] = useState<null | 'banana' | 'shell'>(null);
  const [p2Item, setP2Item] = useState<null | 'banana' | 'shell'>(null);
  const [p1Box, setP1Box] = useState<{ x: number; y: number } | null>(null);
  const [p2Box, setP2Box] = useState<{ x: number; y: number } | null>(null);
  const [p1Pos, setP1Pos] = useState({ x: 0, y: 0 });
  const [p2Pos, setP2Pos] = useState({ x: 0, y: 0 });
  const [resetTrigger, setResetTrigger] = useState(0);
  const { unlockNextCharacter } = useCharacterStore.getState();
  const [projectiles, setProjectiles] = useState<Projectile[]>([]);

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      setScreenWidth(container.offsetWidth);
      container.focus();
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

  useEffect(() => {
    const interval = setInterval(() => {
      setProjectiles(prev => updateProjectiles(prev, screenWidth));
    }, 50);
    return () => clearInterval(interval);
  }, [screenWidth]);

  useEffect(() => {
    projectiles.forEach((p, i) => {
      const proj: Entity = { x: p.x, y: p.y, width: 24, height: 24 };
      const player1: Entity = { ...p1Pos, width: 48, height: 48 };
      const player2: Entity = { ...p2Pos, width: 48, height: 48 };

      if (p.type === 'shell') {
        if (p.direction === 'right' && isColliding(proj, player2)) {
          setP2Hearts(h => Math.max(h - 1, 0));
          stunPlayer(setP2Stunned);
          setProjectiles(prev => prev.filter((_, idx) => idx !== i));
        }
        if (p.direction === 'left' && isColliding(proj, player1)) {
          setP1Hearts(h => Math.max(h - 1, 0));
          stunPlayer(setP1Stunned);
          setProjectiles(prev => prev.filter((_, idx) => idx !== i));
        }
      }

      if (p.type === 'banana' || p.type === 'banana_static') {
        if (p.owner !== 'p1' && isColliding(proj, player1)) {
          setP1Hearts(h => Math.max(h - 1, 0));
          stunPlayer(setP1Stunned);
          setProjectiles(prev => prev.filter((_, idx) => idx !== i));
        }
        if (p.owner !== 'p2' && isColliding(proj, player2)) {
          setP2Hearts(h => Math.max(h - 1, 0));
          stunPlayer(setP2Stunned);
          setProjectiles(prev => prev.filter((_, idx) => idx !== i));
        }
      }
    });
  }, [projectiles, p1Pos, p2Pos]);

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
    }, 3000);
    return () => clearInterval(interval);
  }, [p1Box, p2Box, p1Item, p2Item, screenWidth, minY, maxY]);

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

  useEffect(() => {
    if (p1Hearts <= 0) {
      setGameOver('p2');
      setP2Wins(w => w + 1);
      if (p2Hearts === 3) {
        const unlocked = unlockNextCharacter();
        if (unlocked) alert(`${unlocked.replace('.png', '')} unlocked!`);
      }
    }

    if (p2Hearts <= 0) {
      setGameOver('p1');
      setP1Wins(w => w + 1);
      if (p1Hearts === 3) {
        const unlocked = unlockNextCharacter();
        if (unlocked) alert(`${unlocked.replace('.png', '')} unlocked!`);
      }
    }
  }, [p1Hearts, p2Hearts]);

  const player1StartX = (0 + (screenWidth / 2 - SPRITE_WIDTH - EDGE_BUFFER)) / 2;
  const player2StartX = (screenWidth / 2 + EDGE_BUFFER + (screenWidth - SPRITE_WIDTH - EDGE_BUFFER)) / 2;

  const handleRestart = () => {
    setP1Hearts(3);
    setP2Hearts(3);
    setP1Item(null);
    setP2Item(null);
    setP1Box(null);
    setP2Box(null);
    setProjectiles([]);
    setGameOver(null);
    setResetTrigger(prev => prev + 1);
    setTimeout(() => containerRef.current?.focus(), 50);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (gameOver) return;

    if (e.key === 'f' && p1Item && !p1Stunned) {
      setProjectiles(prev => [
        ...prev,
        {
          x: p1Pos.x + 48,
          y: p1Pos.y,
          type: p1Item,
          direction: 'right',
          startX: p1Pos.x + 48,
          owner: 'p1',
        },
      ]);
      setP1Item(null);
    }

    if (e.key === '/' && p2Item && !p2Stunned) {
      setProjectiles(prev => [
        ...prev,
        {
          x: p2Pos.x - 48,
          y: p2Pos.y,
          type: p2Item,
          direction: 'left',
          startX: p2Pos.x - 48,
          owner: 'p2',
        },
      ]);
      setP2Item(null);
    }
  };

  return (
    <div
      ref={containerRef}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      className="relative w-full h-full rounded-xl border border-white/20 overflow-hidden outline-none"
    >
      {gameOver && (
        <GameOverScreen
          winner={gameOver}
          onReturnToMenu={onReturnToMenu}
          onRestart={handleRestart}
        />
      )}

      <Track />

      <Player
        sprite={`/characters/${p1Char}`}
        minY={minY}
        maxY={maxY}
        initialX={player1StartX}
        initialY={playerY}
        screenWidth={screenWidth}
        side="left"
        setPosition={setP1Pos}
        stunned={p1Stunned}
        resetTrigger={resetTrigger}
      />

      {mode === 'single' ? (
        <CPUPlayer
          sprite={`/characters/${p2Char}`}
          minY={minY}
          maxY={maxY}
          initialX={player2StartX}
          initialY={playerY}
          screenWidth={screenWidth}
          side="right"
          setPosition={setP2Pos}
          stunned={p2Stunned}
          p1Pos={p1Pos}
          p2Item={p2Item}
          setP2Item={setP2Item}
          p2Box={p2Box}
          resetTrigger={resetTrigger}
          throwItem={(x, y, item) => {
            setProjectiles(prev => [
              ...prev,
              {
                x,
                y,
                type: item,
                direction: 'left',
                startX: x,
                owner: 'p2',
              },
            ]);
          }}
        />
      ) : (
        <Player2
          sprite={`/characters/${p2Char}`}
          minY={minY}
          maxY={maxY}
          initialX={player2StartX}
          initialY={playerY}
          screenWidth={screenWidth}
          side="right"
          setPosition={setP2Pos}
          stunned={p2Stunned}
          resetTrigger={resetTrigger}
        />
      )}

      {projectiles.map((p, i) => (
        <ProjectileSprite key={i} projectile={p} />
      ))}

      {p1Box && (
        <img
          src="/objects/item-box.png"
          alt="Item Box"
          className="absolute"
          style={{
            left: `${p1Box.x}px`,
            top: `calc(50% + ${p1Box.y}px)`,
            transform: 'translateY(-50%)',
            width: '32px',
            height: '32px',
            zIndex: 10,
          }}
        />
      )}
      {p2Box && (
        <img
          src="/objects/item-box.png"
          alt="Item Box"
          className="absolute"
          style={{
            left: `${p2Box.x}px`,
            top: `calc(50% + ${p2Box.y}px)`,
            transform: 'translateY(-50%)',
            width: '32px',
            height: '32px',
            zIndex: 10,
          }}
        />
      )}

      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 text-white text-sm z-50">
        Player 1 Wins: {p1Wins} &nbsp;&nbsp;|&nbsp;&nbsp; Player 2 Wins: {p2Wins}
      </div>

      <HUD p1Hearts={p1Hearts} p2Hearts={p2Hearts} p1Item={p1Item} p2Item={p2Item} />
    </div>
  );
}
