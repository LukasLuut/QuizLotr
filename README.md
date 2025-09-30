# 🧙‍♂️ Quiz Senhor dos Anéis

Um jogo de perguntas e respostas inspirado no universo de **O Senhor dos
Anéis**, desenvolvido em **React** com foco em UI/UX imersiva.\
O jogador percorre um mapa no estilo da **Terra-média**, responde
questões, acumula pontos e compete no ranking.

------------------------------------------------------------------------

## ✨ Funcionalidades

-   🎮 **Quiz interativo** com animações e feedback imediato
-   🗺️ **Mapa estilo Terra-média** usando **Leaflet**, onde o personagem
    se move conforme o progresso\
-   🎥 **Vídeos de fundo** com transições suaves (fade in/out)
-   🖼️ **UI temática** com fontes de fantasia, ornamentos e efeitos
    visuais\
-   🏆 **Leaderboard** para exibir jogadores e pontuações
-   👤 **Perfil de usuário** com atualização e exclusão de conta
-   🔑 **Autenticação segura** com JWT e senhas criptografadas
-   🎵 **Sound Design** pensado para imersão e melhor experiência

   ## ✨ Badges da Guilda

![Forjado em React](https://img.shields.io/badge/Forjado%20em-React-61DAFB?style=for-the-badge\&logo=react\&logoColor=black)
![Mapa por Leaflet](https://img.shields.io/badge/Mapa-Leaflet-199900?style=for-the-badge\&logo=leaflet\&logoColor=white)
![Protegido por Bcrypt](https://img.shields.io/badge/Protegido%20por-Bcrypt-yellow?style=for-the-badge)
![Guardado no GitHub](https://img.shields.io/badge/Guardado-no%20GitHub-lightgrey?style=for-the-badge\&logo=github)

---

## ⚒️ Forja de Ferramentas

* **Frontend:** React, React Router
* **Mapa:** Leaflet.js
* **Estilização:** CSS (animações, media queries, fontes *Ringbearer* e *Uncial Antiqua*)
* **Backend:** MySQL (Workbench), autenticação e tokens de acesso
* **Segurança:** Criptografia de senhas com Bcrypt
* **Arquitetura:** DTOs, tratamento de exceções e UI/UX imersiva
* **Design**: Efeitos visuais com vídeos, imagens e efeitos sonoros



------------------------------------------------------------------------


## 📂 Estrutura do Projeto - Frontend

    src/
     ├─ assets/           # imagens, vídeos, fontes, sons
     ├─ components/       # componentes reutilizáveis (botões, modais, etc.)
     │   ├─ buttons/      # botões personalizados
     │   ├─ layout/       # containers e telas principais
     │   └─ ui/           # elementos visuais extras
     ├─ pages/            # páginas principais (Quiz, Login, Profile)
     └─ App.jsx           # ponto de entrada React

------------------------------------------------------------------------

## 📂 Estrutura do Projeto - Backend

    retorno-do-dev/
        ├─ node_modules/           # dependências do projeto
        ├─ src/                    # código-fonte da aplicação
        │  ├─ controllers/         # lógica dos controladores (manipulação de requisições)
        │  ├─ dtos/                # Data Transfer Objects (validação e tipagem de dados)
        │  ├─ middlewares/         # middlewares (interceptadores de requisições)
        │  ├─ migrations/          # arquivos de migração do banco de dados
        │  ├─ models/              # definição dos modelos (entidades)
        │  ├─ routes/              # definição das rotas da aplicação
        │  ├─ services/            # regras de negócio e lógica principal
        │  ├─ utils/               # funções utilitárias auxiliares
        │  ├─ app.ts               # configuração da aplicação
        │  └─ data-source.ts       # configuração da fonte de dados (TypeORM)
        │  └─ server.ts            # inicialização do servidor
        ├─ .env                    # variáveis de ambiente
        ├─ LICENSE                 # licença do projeto
        ├─ package-lock.json       # controle de versões exato das dependências
        ├─ package.json            # dependências e scripts do projeto
        └─ tsconfig.json           # configuração do TypeScript


------------------------------------------------------------------------


## 🚀 Como Rodar Localmente Frontend

1.  Clone este repositório:

    ``` bash
    git clone https://github.com/LukasLuut/QuizLotr.git
    cd quizSenhorDosAneis/
    ```

2.  Instale as dependências:

    ``` bash
    npm install
    ```

3.  Inicie o frontend:

    ``` bash
    npm run dev
    ```

## Em outro terminal

1.  Acesse o Backend:

    ``` bash
    cd backend
    ```

2. Instale as dependências:

   ``` bash
   npm install
   ```

3. Configure o **.env**

    * Copie o arquivo **.env_example**
    * Renomeie para **.env**
    * Configure com as informações do seu banco de dados
  
4. Rode o servidor localmente

   ``` bash
   npm run dev
   ```
   
------------------------------------------------------------------------

## 📸 Demonstração

*(print aqui posteriormente)*

------------------------------------------------------------------------

## 🎵 Créditos

-   **Efeitos sonoros**: [Freesound](https://freesound.org/)\
-   **Fontes temáticas**: Ringbearer, Uncial Antiqua, Tengwar Annatar\
-   **Inspiração visual**: Mapas da Terra-média e UI medieval

------------------------------------------------------------------------

## 📜 Licença

Este projeto é de uso educacional e não possui afiliação oficial com a
obra **O Senhor dos Anéis**.\
Licenciado sob MIT.
