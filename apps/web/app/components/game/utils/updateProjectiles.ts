type Projectile = {
    x: number;
    y: number;
    type: 'banana' | 'shell' | 'banana_static';
    direction: 'left' | 'right';
    startX?: number;
    owner: 'p1' | 'p2';
};

export function updateProjectiles(projectiles: Projectile[], screenWidth: number): Projectile[] {
    return projectiles
        .map(p => {
            if (p.type === 'shell') {
                const SHELL_SPEED = 36;
                const newX = p.direction === 'right' ? p.x + SHELL_SPEED : p.x - SHELL_SPEED;
                return newX < 0 || newX > screenWidth ? null : { ...p, x: newX };
            }

            if (p.type === 'banana') {
                const BANANA_SPEED = 30;
                const dx = p.direction === 'right' ? BANANA_SPEED : -BANANA_SPEED;
                const newX = p.x + dx;
                const maxDist = screenWidth * 0.4;
                const traveled = Math.abs((p.startX ?? p.x) - newX);
                return traveled >= maxDist
                    ? { ...p, type: 'banana_static', x: newX }
                    : { ...p, x: newX };
            }

            return p;
        })
        .filter(Boolean) as Projectile[];
}
