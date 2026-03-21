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
      <span className='utility-toggle-icon'>
        {enabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
      </span>
      <span className='utility-toggle-copy'>
        <strong>{enabled ? 'Sonido activo' : 'Silenciado'}</strong>
        <small>Control de audio</small>
      </span>
    </button>
  );
}
