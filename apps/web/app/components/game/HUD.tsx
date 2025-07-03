'use client';

interface HUDProps {
  p1Hearts: number;
  p2Hearts: number;
  p1Item: 'banana' | 'shell' | null;
  p2Item: 'banana' | 'shell' | null;
  isPaused: boolean;
  setIsPaused: (paused: boolean) => void;
  onPauseReturnToMenu?: () => void;
}

export default function HUD({
  p1Hearts,
  p2Hearts,
  p1Item,
  p2Item,
  isPaused,
  setIsPaused,
  onPauseReturnToMenu,
}: HUDProps) {
  const renderHearts = (count: number) =>
    Array.from({ length: 3 }, (_, i) => (
      <span key={i}>{i < count ? '❤️' : '🖤'}</span>
    ));

  const renderItem = (item: 'banana' | 'shell' | null) => {
    if (item === 'banana') return '🍌';
    if (item === 'shell') return '🟢';
    return '❓';
  };

  return (
    <>
      {/* Pause Overlay */}
      {isPaused && (
        <div className="absolute inset-0 bg-black bg-opacity-80 flex flex-col items-center justify-center z-50 text-white font-mono">
          <h2 className="text-5xl mb-12 font-bold tracking-wider">Paused</h2>
          <div className="flex flex-col items-center gap-6">
            <button
              className="w-48 h-12 border-2 text-lg uppercase tracking-widest rounded transition
                         bg-black text-white hover:bg-white hover:text-black border-white"
              onClick={() => setIsPaused(false)}
            >
              Resume
            </button>
            {onPauseReturnToMenu && (
              <button
                className="w-48 h-12 border-2 text-lg uppercase tracking-widest rounded transition
                           bg-black text-white hover:bg-white hover:text-black border-white"
                onClick={onPauseReturnToMenu}
              >
                Return to Menu
              </button>
            )}
          </div>
        </div>
      )}

      {/* Pause Button */}
      {!isPaused && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-40">
          <button
            className="w-48 h-12 border-2 text-lg uppercase tracking-widest rounded transition
                       bg-black text-white hover:bg-white hover:text-black border-white"
            onClick={() => setIsPaused(true)}
          >
            Pause
          </button>
        </div>
      )}

      {/* Player 1 HUD (top left) */}
      <div className="absolute top-2 left-4 flex items-center gap-2 text-white text-xl font-mono z-30">
        <div className="flex gap-1">{renderHearts(p1Hearts)}</div>
        <div className="w-8 h-8 border border-white flex items-center justify-center text-xs">
          {renderItem(p1Item)}
        </div>
      </div>

      {/* Player 2 HUD (top right) */}
      <div className="absolute top-2 right-4 flex items-center gap-2 text-white text-xl font-mono z-30">
        <div className="w-8 h-8 border border-white flex items-center justify-center text-xs">
          {renderItem(p2Item)}
        </div>
        <div className="flex gap-1">{renderHearts(p2Hearts)}</div>
      </div>
    </>
  );
}
