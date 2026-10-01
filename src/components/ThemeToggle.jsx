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
      {isLight ? <Sun size={17} /> : <Moon size={17} />}
      <span>{isLight ? 'Tema claro' : 'Tema oscuro'}</span>
    </button>
  );
}
