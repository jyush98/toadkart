type GameObjectType = 'coin' | 'hazard';

interface GameObject {
  id: string;
  type: GameObjectType;
  worldX: number;
  y: number;
  collected?: boolean;
}
