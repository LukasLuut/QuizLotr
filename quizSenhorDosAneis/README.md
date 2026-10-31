# Quiz da Terra-média: frontend

React 19 + Vite. Veja o [README principal](../README.md) para rodar o projeto completo.

``` bash
cp .env.example .env   # VITE_API_URL aponta para a API
npm install
npm run dev            # http://localhost:5173
```

| Comando | O que faz |
|---|---|
| `npm run build` | Build de produção em `dist/` |
| `npm run lint` | ESLint |
| `npm test` | Vitest + Testing Library |
| `npm run test:e2e` | Playwright (sobe API e Vite; precisa do MySQL configurado na API) |

## Como o jogo está organizado

- `src/hooks/useGameSession.js`: a partida como máquina de estados
  (`scene → question-loading → answering → submitting → feedback → travel-ready → travelling → … → finished`).
  Toda pergunta, resposta e pontuação vem da API.
- `src/config/regions.js`: as 8 regiões (nome, título do narrador, fundo e ambiência). A ordem é a mesma de
  `PATHS` em `src/components/Map.jsx` e de `REGIONS` no backend.
- `src/context/AudioContext.jsx`: música (uma por vez, com crossfade), efeitos, mudo e volume.
- `src/context/AuthContext.jsx`: sessão; o usuário vem de `GET /users/me`, então F5 não perde nada.
- `src/services/api.js`: a única camada que faz `fetch`.
