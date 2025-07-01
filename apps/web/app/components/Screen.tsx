'use client';

import { useState } from 'react';
import Menu from './Menu';
import Game from './Game'

export default function Screen() {
  const [screen, setScreen] = useState<'menu' | 'game'>('menu');
  const [mode, setMode] = useState<'single' | 'multi' | null>(null);

  const handleModeSelect = (selectedMode: 'single' | 'multi') => {
    setMode(selectedMode);
    setScreen('game');
  };

  return (
    <>
      {screen === 'menu' && <Menu onSelectMode={handleModeSelect} />}
      {screen === 'game' && <Game mode={mode!} />}
    </>
  );
}
