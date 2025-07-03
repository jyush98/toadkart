export type Entity = {
    x: number;
    y: number;
    width: number;
    height: number;
};

export type Projectile = {
    x: number;
    y: number;
    type: 'banana' | 'shell' | 'banana_static';
    direction: 'left' | 'right';
    startX?: number;
    owner: 'p1' | 'p2';
};
