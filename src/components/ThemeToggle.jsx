import { Moon, Sun } from 'lucide-react';

export function ThemeToggle ({ theme, onToggle }) {
  const isLight = theme === 'light';

  return (
    <button
      type='button'
      className='utility-toggle'
      onClick={onToggle}
      aria-label={isLight ? 'Activar tema oscuro' : 'Activar tema claro'}
      aria-pressed={isLight}
    >
      <span className='utility-toggle-icon'>
        {isLight ? <Moon size={18} /> : <Sun size={18} />}
      </span>
      <span className='utility-toggle-copy'>
        <strong>{isLight ? 'Modo claro' : 'Modo oscuro'}</strong>
        <small>Cambiar tema</small>
      </span>
    </button>
  );
}
