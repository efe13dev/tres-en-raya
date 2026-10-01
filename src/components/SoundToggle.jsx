import { Volume2, VolumeX } from 'lucide-react';

export function SoundToggle ({ enabled, onToggle }) {
  return (
    <button
      type='button'
      className='utility-toggle'
      onClick={onToggle}
      aria-label={enabled ? 'Silenciar sonidos' : 'Activar sonidos'}
      aria-pressed={enabled}
    >
      {enabled ? <Volume2 size={17} /> : <VolumeX size={17} />}
      <span>{enabled ? 'Sonido activo' : 'Sonido silenciado'}</span>
    </button>
  );
}
