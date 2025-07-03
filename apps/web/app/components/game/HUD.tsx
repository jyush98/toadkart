'use client';

interface HUDProps {
  p1Hearts: number;
  p2Hearts: number;
  p1Item: 'banana' | 'shell' | null;
  p2Item: 'banana' | 'shell' | null;
}

export default function HUD({ p1Hearts, p2Hearts, p1Item, p2Item }: HUDProps) {
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
