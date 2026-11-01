
# 🧙‍♂️ Quiz Senhor dos Anéis

Um jogo de perguntas e respostas inspirado no universo de **O Senhor dos
Anéis**, desenvolvido em **React** com foco em UI/UX imersiva.\
O jogador leva o Anel do Condado até a Montanha da Perdição: a cada região
respondida, o personagem avança no mapa da **Terra-média**, o cenário, a
música e o narrador mudam, e a pontuação vai para o ranking.

------------------------------------------------------------------------

## ✨ Funcionalidades

-   🎮 **Quiz em 8 regiões** (Condado, Bri, Valfenda, Moria, Lothlórien,
    Argonath, Mordor e Montanha da Perdição), com 5 perguntas sorteadas
    por região a cada partida e alternativas embaralhadas
-   🛡️ **Pontuação calculada no servidor**: o gabarito nunca chega ao
    navegador antes da resposta; acertos em sequência multiplicam os
    pontos e responder rápido dá bônus
-   ⚔️ **Dois modos**: *Jornada* (sem limite) e *Desafio* (3 vidas e 20 s
    por pergunta)
-   📜 **Resposta comentada**: ao errar, a alternativa certa aparece com
    uma curiosidade de lore
-   🏆 **Hall dos Heróis** com a melhor partida de cada jogador e
    **conquistas** desbloqueadas durante o jogo
-   💾 **Continuar jornada**: a partida fica salva no servidor (F5 ou
    "Salvar e sair" não perdem o progresso)
-   🗺️ **Mapa estilo Terra-média** com **Leaflet**
-   🎵 **Sound design** com ambiência por região, botão de mudo e volume
-   ♿ **Acessível**: jogável por teclado (Tab, Enter, 1–4 e Esc), foco
    visível, modais com `role="dialog"` e respeito a *movimento reduzido*
-   📱 **Responsivo** de 360 px a telas grandes

## ✨ Badges da Guilda

![Forjado em React](https://img.shields.io/badge/Forjado%20em-React-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Mapa por Leaflet](https://img.shields.io/badge/Mapa-Leaflet-199900?style=for-the-badge&logo=leaflet&logoColor=white)
![Protegido por Bcrypt](https://img.shields.io/badge/Protegido%20por-Bcrypt-yellow?style=for-the-badge)
![Guardado no GitHub](https://img.shields.io/badge/Guardado-no%20GitHub-lightgrey?style=for-the-badge&logo=github)

---

## ⚒️ Forja de Ferramentas

* **Frontend:** React 19, React Router 7, Vite 7, Leaflet
* **Backend:** Node 22, Express 5, TypeORM (migrations), MySQL 8
* **Segurança:** bcrypt, JWT, validação com class-validator (whitelist),
  helmet, rate limit no login, CORS restrito
* **Testes:** Jest + Supertest (API), Vitest + Testing Library (web),
  Playwright (ponta a ponta)
* **Infra:** Docker Compose, GitHub Actions, Dependabot

------------------------------------------------------------------------

## 🚀 Como rodar

### Opção 1: Docker (mais simples)

Pré-requisito: Docker com Compose.

``` bash
git clone https://github.com/LukasLuut/QuizLotr.git
cd QuizLotr
docker compose up --build
```

Jogo em <http://localhost:8080> e API em <http://localhost:3000>.

### Opção 2: localmente

Pré-requisitos: **Node 22** (veja `.nvmrc`) e **MySQL 8**.

1.  Crie o banco:

    ``` sql
    CREATE DATABASE quiz_lotr CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
    ```

2.  Configure e suba a API:

    ``` bash
    cd QuizLotr/retorno-do-dev
    cp .env_example .env      # preencha usuário/senha do MySQL e um JWT_SECRET longo
    npm install
    npm run dev               # aplica as migrations e cadastra as perguntas
    ```

3.  Em outro terminal, suba o frontend:

    ``` bash
    cd QuizLotr/quizSenhorDosAneis
    cp .env.example .env      # VITE_API_URL=http://localhost:3000
    npm install
    npm run dev
    ```

4.  Abra <http://localhost:5173>.

### Scripts úteis

| Onde | Comando | O que faz |
|---|---|---|
| API | `npm test` | Testes da API (usa o banco `quiz_lotr_test`, que é recriado) |
| API | `npm run build && npm start` | Build e execução de produção |
| API | `npm run seed` | Cadastra as perguntas (se o banco estiver vazio) |
| API | `npm run migration:generate -- src/migrations/Nome` | Gera migration após mudar uma entidade |
| Web | `npm test` | Testes de componentes |
| Web | `npm run lint` | ESLint |
| Web | `npm run test:e2e` | Partida de ponta a ponta no navegador (precisa do MySQL) |
| Web | `npm run dev:demo` | Versão demo, sem API (abre em `/QuizLotr/`) |
| Web | `npm run build:demo` | Build da versão demo para o GitHub Pages |

### 🎭 Versão demo (GitHub Pages)

Roda só no navegador: sem login, nível nem ranking, todos os personagens liberados e nada
salvo (partida e conquistas ficam no `sessionStorage` e somem ao fechar o navegador). As
chamadas de `services/api.js` são respondidas por `src/demo/localApi.js`, que usa as mesmas
regras (`retorno-do-dev/src/game/rules.ts`) e perguntas (`seeds/questions.ts`) do backend.
Fora do modo demo, o alias `@demo` aponta para um módulo vazio: o gabarito nunca entra no
site da versão completa.

- Extras: partida curta (2 perguntas por região), botão **Recomeçar**, quadro **Sobre o
  projeto** e modo apresentador (**Shift + D** na partida: resposta certa e corrupção).
- Publicação: cada push na branch `versao-demo` roda `.github/workflows/demo-pages.yml`, que
  reduz os vídeos para 720p (só no site) e publica no GitHub Pages.

------------------------------------------------------------------------

## 🔌 API

| Método | Rota | Auth | Descrição |
|---|---|---|---|
| POST | `/auth/register` | — | Cadastro (`name`, `email`, `password`) |
| POST | `/auth/login` | — | Login por e-mail; devolve `{ user, token }` |
| GET/PUT/DELETE | `/users/me` | ✔ | Conta do jogador logado |
| GET | `/users/me/achievements` | ✔ | Conquistas (desbloqueadas ou não) |
| POST | `/rounds` | ✔ | Nova partida (`mode`: `normal` ou `desafio`) |
| GET | `/rounds/current` | ✔ | Partida em andamento, se houver |
| GET | `/rounds/:id/question` | ✔ | Pergunta atual (sem gabarito) |
| POST | `/rounds/:id/answer` | ✔ | Responde (`questionId`, `answerId`); o servidor pontua |
| POST | `/rounds/:id/abandon` | ✔ | Encerra a partida |
| GET | `/rounds/:id/summary` | ✔ | Resumo da partida |
| GET | `/rounds/ranking?mode=normal&period=all` | — | Ranking (melhor partida por jogador) |
| GET | `/health` | — | Verificação de saúde |

Todos os erros saem como JSON `{ "message": "..." }`.

------------------------------------------------------------------------

## 📂 Estrutura

    quizSenhorDosAneis/          # frontend
     ├─ src/
     │   ├─ assets/              # imagens, vídeos, fontes, sons
     │   ├─ components/          # botões, modais, mapa, layout do jogo
     │   ├─ config/regions.js    # regiões: nome, fundo, ambiência
     │   ├─ context/             # sessão (AuthContext) e áudio (AudioContext)
     │   ├─ hooks/               # useGameSession (máquina de estados), useRanking
     │   ├─ pages/               # Start, Login, Profile, PlayQuiz
     │   └─ services/api.js      # única camada de acesso à API
     └─ e2e/                     # testes Playwright

    retorno-do-dev/              # backend
     ├─ src/
     │   ├─ config/env.ts        # variáveis de ambiente validadas
     │   ├─ controllers/ routes/ services/ dtos/ middlewares/
     │   ├─ game/rules.ts        # regras de pontuação, modos e conquistas
     │   ├─ models/              # entidades TypeORM
     │   ├─ migrations/          # schema do banco
     │   └─ seeds/               # banco de perguntas
     └─ tests/                   # Jest + Supertest

------------------------------------------------------------------------

## 🎵 Créditos

-   **Efeitos sonoros**: [Freesound](https://freesound.org/)
-   **Fontes temáticas**: Ringbearer, Uncial Antiqua
-   **Inspiração visual**: Mapas da Terra-média e UI medieval
-   **Leaflet.MovingMarker** (Ewoken, MIT), em `src/lib/leaflet`

------------------------------------------------------------------------

## 📜 Licença

Este projeto é de uso educacional e não possui afiliação oficial com a
obra **O Senhor dos Anéis**. Trechos de vídeo e música pertencem aos
seus respectivos donos.\
Código licenciado sob MIT.
