'use client';

import { useState } from 'react';
import Game from './game/Game';
import CharacterSelectScreen from './CharacterSelectScreen';

export default function Screen() {
  const [view, setView] = useState<'menu' | 'characterSelect' | 'game'>('menu');
  const [mode, setMode] = useState<'single' | 'multi' | null>(null);
  const [p1Char, setP1Char] = useState<string | null>(null);
  const [p2Char, setP2Char] = useState<string | null>(null);

  const handleModeSelect = (selectedMode: 'single' | 'multi') => {
    setMode(selectedMode);
    setView('characterSelect');
  };

  const handleCharacterSelect = (p1: string, p2: string) => {
    setP1Char(p1);
    setP2Char(p2);
    setView('game');
  };

  const handleReturnToMenu = () => {
    setView('menu');
    setMode(null);
    setP1Char(null);
    setP2Char(null);
  };

  return (
    <div className="w-screen h-full bg-black flex items-center justify-center">
      <div className="relative w-[90vw] h-[50vh] border-2 border-white rounded-md overflow-hidden font-mono text-white">
        {view === 'menu' && (
          <div className="flex flex-col items-center justify-center h-full">
            <h1 className="text-4xl mb-8">ToadKart</h1>
            <div className="flex gap-8 pt-20">
              <button
                className="w-48 h-24 border-2 border-white bg-[#222] hover:bg-[#333] transition"
                onClick={() => handleModeSelect('single')}
              >
                SINGLE PLAYER
              </button>
              <button
                className="w-48 h-24 border-2 border-white bg-[#222] hover:bg-[#333] transition"
                onClick={() => handleModeSelect('multi')}
              >
                TWO PLAYERS
              </button>
            </div>
          </div>
        )}

        {view === 'characterSelect' && mode && (
          <CharacterSelectScreen mode={mode} onSelect={handleCharacterSelect} />
        )}

        {view === 'game' && p1Char && p2Char && mode && (
          <Game
            mode={mode}
            onReturnToMenu={handleReturnToMenu}
            p1Char={p1Char}
            p2Char={p2Char}
          />
        )}
      </div>
    </div>
  );
}
