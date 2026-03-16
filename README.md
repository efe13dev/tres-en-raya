# 🎮 Tres en Raya Premium

<div align="center">

[![React](https://img.shields.io/badge/React-18-blue.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-6-646CFF.svg)](https://vitejs.dev/)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](./LICENSE)

</div>

## 📝 Descripción

Una reinterpretación premium del clásico tres en raya construida con React y Vite. La aplicación ha sido refactorizada para ofrecer una presentación más cercana a producto real: identidad visual más cuidada, microinteracciones, tema dinámico, marcador persistente durante la sesión y modo contra IA con `minimax`.

## ✨ Características principales

- 🎨 Diseño visual premium con layout editorial, glassmorphism y fondo dinámico
- 🤖 Modo local y modo contra IA con selección desde la interfaz
- 🧠 IA basada en `minimax` para jugar de forma óptima
- 🏆 Marcador de victorias para `X`, `O` y empates
- 📈 Línea ganadora animada y estados de partida más expresivos
- 🔊 Sonidos sintéticos con opción para activar o silenciar
- 🌗 Tema claro/oscuro con persistencia en `localStorage`
- ✨ Microinteracciones y animaciones con `framer-motion`
- 📱 Interfaz responsive pensada para escritorio y móvil

## 🛠️ Stack tecnológico

- **React 18** - interfaz y gestión del estado
- **Vite 6** - entorno de desarrollo y build
- **Framer Motion** - animaciones y microinteracciones
- **Lucide React** - iconografía
- **GSAP** - fondo animado con letras flotantes
- **Canvas Confetti** - celebración de victorias
- **CSS personalizado** - sistema visual premium en `src/styles/premium.css`
- **Web Audio API** - sonidos del juego sin depender de assets externos

## 🧱 Estructura relevante

```text
src/
  components/
    Board.jsx
    GameTitle.jsx
    FloatingLetters.jsx
    ModeSelector.jsx
    Scoreboard.jsx
    SoundToggle.jsx
    ThemeToggle.jsx
    WinningLine.jsx
  hooks/
    useSound.js
    useTheme.js
  styles/
    premium.css
  App.jsx
  main.jsx
  utils.js
public/
  favicon.svg
```

## 🚀 Scripts disponibles

```bash
npm install
npm run dev
npm run build
npm run preview
```

## ⚙️ Instalación local

```bash
git clone <url-del-repositorio>
cd tres-en-raya
npm install
npm run dev
```

La app quedará disponible normalmente en:

```bash
http://localhost:5173
```

## 🎮 Cómo jugar

### Modo local

- **[jugadores]** Dos jugadores comparten el mismo dispositivo
- **[turnos]** `X` y `O` alternan jugada automáticamente
- **[objetivo]** Gana quien complete una línea horizontal, vertical o diagonal

### Modo IA

- **[humano]** El jugador controla `X`
- **[ia]** La IA responde con `O`
- **[algoritmo]** La jugada se calcula con `minimax`
- **[dificultad]** La IA juega de forma óptima, así que normalmente ganará o forzará empate

## 🧠 Lógica de juego

La lógica principal está en `src/utils.js`.

- **`calculateWinner`** detecta ganador y devuelve también la línea ganadora
- **`calculateDraw`** detecta empates
- **`minimax`** puntúa jugadas futuras para la IA
- **`findBestMove`** escoge la mejor casilla para `O`

## 🎯 Objetivo del rediseño

Esta versión no busca ser solo una demo técnica, sino una base más preparada para evolucionar hacia una experiencia más comercializable:

- **[presentación]** interfaz más pulida y diferenciada
- **[retención]** más feedback visual y mejor ritmo de partida
- **[escalabilidad]** estructura más clara para seguir añadiendo modos, perfiles o monetización

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Consulta [LICENSE](./LICENSE) para más detalles.
