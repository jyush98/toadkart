import { Projectile } from './types';

interface ProjectileProps {
  projectile: Projectile;
}

export default function ProjectileSprite({ projectile }: ProjectileProps) {
  return (
    <img
      src={
        projectile.type === 'shell'
          ? '/objects/green-shell.webp'
          : '/objects/banana.png'
      }
      className="absolute z-20"
      style={{
        left: `${projectile.x}px`,
        top: `calc(50% + ${projectile.y}px)`,
        transform: 'translateY(-50%)',
        width: '32px',
        height: '32px',
      }}
    />
  );
}
