'use client';

interface MenuProps {
  onSelectMode: (mode: 'single' | 'multi') => void;
}

export default function Menu({ onSelectMode }: MenuProps) {
  return (
    <div className="w-screen h-screen bg-black text-white flex flex-col items-center justify-center font-mono">
      <h1 className="text-4xl mb-8 tracking-widest">ToadKart</h1>
      <div className="flex gap-8">
        <button
          onClick={() => onSelectMode('single')}
          className="w-48 h-24 border-2 border-white bg-[#ff0000] hover:bg-[#333] transition-all"
        >
          SINGLE PLAYER
        </button>
        <button
          onClick={() => onSelectMode('multi')}
          className="w-48 h-24 border-2 border-white bg-[#0000ff] hover:bg-[#333] transition-all"
        >
          TWO PLAYERS
        </button>
      </div>
    </div>
  );
}
