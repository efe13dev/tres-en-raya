# Tres en raya

El clásico tres en raya hecho con React 18 y Vite 8. Dos jugadores en el mismo dispositivo o una partida contra la IA con tres niveles de dificultad.

## Características

- Modo local para dos jugadores y modo contra IA.
- Tres dificultades de IA: Fácil (casilla al azar), Normal (gana si puede y bloquea tus líneas) e Imposible (`minimax`, juega sin errores).
- Marcador de victorias de X, O y empates durante la sesión. El marcador no se guarda: se pierde al recargar la página.
- Tema claro (lavanda) y oscuro (grafito), guardado en `localStorage`. X en ámbar, O en azul.
- Sonidos sintéticos con Web Audio API, con opción de silenciar.
- Animaciones con framer-motion que respetan `prefers-reduced-motion`.
- Tipografía Nunito y favicon SVG propio en `public/favicon.svg`.
- Responsive hasta 320 px de ancho.

## Requisitos

- [Bun](https://bun.sh/) para instalar dependencias y ejecutar los scripts.
- Node.js `^20.19.0` o `>=22.12.0` (requerido por Vite; `bun run` ejecuta Vite sobre Node por defecto).

## Instalación y desarrollo

```bash
git clone <url-del-repositorio>
cd tres-en-raya
bun install
bun run dev
```

La app queda disponible en `http://localhost:5173`.

También puedes usar `npm install` y `npm run <script>` como alternativa; no mezcles gestores en el mismo repo para no generar lockfiles distintos.

## Scripts

```bash
bun run dev       # servidor de desarrollo
bun run build     # build de producción en dist/
bun run preview   # sirve el build localmente
bun run lint      # ESLint sobre js/jsx
bun run test      # tests de la lógica (node --test)
```

## Cómo se juega

- En modo local X empieza y los turnos se alternan; gana quien alinee tres en horizontal, vertical o diagonal.
- Contra la IA juegas con X y la IA responde con O tras una breve pausa. El nivel se elige en el selector Dificultad.
- **Nueva ronda** limpia el tablero y conserva el marcador y la dificultad.
- **Borrar marcador** reinicia la ronda y pone el marcador a cero (la dificultad se mantiene).
- Cambiar de modo de juego o de dificultad reinicia tanto la ronda como el marcador.

## Estructura

```text
src/
  components/
    Board.jsx          tablero, estado de partida y controles
    GameTitle.jsx      titular principal
    ModeSelector.jsx   selector de modo local / IA
    Scoreboard.jsx     marcador de la sesión
    SoundToggle.jsx    activar o silenciar sonidos
    ThemeToggle.jsx    tema claro / oscuro
    WinningLine.jsx    línea ganadora animada
  hooks/
    useSound.js        sonidos con Web Audio API
    useTheme.js        tema y persistencia en localStorage
  styles/
    premium.css        tokens y estilos de la app
  utils.js             calculateWinner, calculateDraw, minimax, findAiMove
  utils.test.js        tests con node:test
  App.jsx / main.jsx
public/
  favicon.svg
```
