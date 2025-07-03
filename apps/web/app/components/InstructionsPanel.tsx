export default function InstructionsPanel() {
  return (
    <div className="w-full bg-black text-white border-t-2 border-white/30 px-16 py-12 text-xl font-mono flex justify-between items-start gap-16">
      {/* Player 1 Instructions */}
      <div className="w-1/3 text-left">
        <h3 className="text-3xl font-bold mb-6">🕹️ Player 1</h3>
        <ul className="list-disc list-inside space-y-4">
          <li>Move: W / A / S / D</li>
          <li>Throw Item: F</li>
          <li>Avoid enemy projectiles</li>
        </ul>
      </div>

      {/* Game Goals */}
      <div className="w-1/3 text-left">
        <h3 className="text-3xl font-bold mb-6">🎯 Game Goals</h3>
        <p className="mb-4">Survive longer than your opponent.</p>
        <p>Use items to knock out their hearts!</p>
      </div>

      {/* Player 2 Instructions */}
      <div className="w-1/3 text-left">
        <h3 className="text-3xl font-bold mb-6">🕹️ Player 2</h3>
        <ul className="list-disc list-inside space-y-4">
          <li>Move: Arrow Keys</li>
          <li>Throw Item: /</li>
          <li>Avoid enemy projectiles</li>
        </ul>
      </div>
    </div>
  );
}
