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

------------------------------------------------------------------------

## 🛠️ Tecnologias Utilizadas

-   **Frontend**: React, CSS3, Leaflet\
-   **Backend**: Node.js, TypeOrm, MySQL (Workbench)\
-   **Segurança**: DTO, Tokens JWT, Criptografia com Bcrypt\
-   **Design**: Fontes temáticas (Ringbearer, Tengwar
    Annatar), efeitos visuais com vídeos, sprites e efeitos sonoros

------------------------------------------------------------------------

## 📂 Estrutura do Projeto

    src/
     ├─ assets/           # imagens, vídeos, fontes, sons
     ├─ components/       # componentes reutilizáveis (botões, modais, etc.)
     │   ├─ buttons/      # botões personalizados
     │   ├─ layout/       # containers e telas principais
     │   └─ ui/           # elementos visuais extras
     ├─ pages/            # páginas principais (Quiz, Login, Profile)
     └─ App.jsx           # ponto de entrada React

------------------------------------------------------------------------

## 🚀 Como Rodar Localmente

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
    npm start
    ```

4.  Suba o backend:

    ``` bash
    cd backend
    npm install
    npm run dev
    ```
    --Necessário configurar **.env**.
   -- Necessário instalar Workbench.
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
