import { Brain, Users } from 'lucide-react';

const options = [
  {
    value: 'pvp',
    label: 'Duelo local',
    icon: Users
  },
  {
    value: 'ai',
    label: 'Contra IA',
    icon: Brain
  }
];

export function ModeSelector({ mode, onChange }) {
  return (
    <div className='mode-selector' role='tablist' aria-label='Selecciona el modo de partida'>
      {options.map(({ value, label, icon: Icon }) => {
        const isActive = mode === value;

        return (
          <button
            key={value}
            type='button'
            className={isActive ? 'mode-option mode-option-active' : 'mode-option'}
            onClick={() => onChange(value)}
            role='tab'
            aria-selected={isActive}
          >
            <Icon size={16} />
            <span>{label}</span>
          </button>
        );
      })}
    </div>
  );
}
