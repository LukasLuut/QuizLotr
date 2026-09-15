// src/migrations/1690000000000-SeedInitialQuestion.ts

import { MigrationInterface, QueryRunner } from "typeorm";

export class SeedInitialQuestion1690000000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Inserindo a pergunta

    // Lista de perguntas que serão inseridas quando rodar o código
    const questions = [
            {
        question: "Qual é o nome da região onde vivem os Hobbits?",
        answers: [
          { answer: "Valfenda", correct: false },
          { answer: "O Condado", correct: true },
          { answer: "Gondor", correct: false },
          { answer: "Mordor", correct: false },
        ],
      },
      {
        question: "Qual Hobbit vive na famosa toca de Bolsão, no Condado?",
        answers: [
          { answer: "Merry Brandebuque", correct: false },
          { answer: "Pippin Tûk", correct: false },
          { answer: "Frodo Bolseiro", correct: true },
          { answer: "Samwise Gamgi", correct: false },
        ],
      },
      // {
      //   question: "Qual é o nome da casa de Bilbo e Frodo no Condado?",
      //   answers: [
      //     { answer: "Bolsão", correct: true },
      //     { answer: "Pé-de-Ferro", correct: false },
      //     { answer: "Valfenda", correct: false },
      //     { answer: "Bree", correct: false },
      //   ],
      // },
      {
        question: "Quem organiza uma grande festa de aniversário no Condado no início de A Sociedade do Anel?",
        answers: [
          { answer: "Frodo Bolseiro", correct: false },
          { answer: "Samwise Gamgi", correct: false },
          { answer: "Gandalf", correct: false },
          { answer: "Bilbo Bolseiro", correct: true },
        ],
      },
      {
        question: "Qual personagem chega ao Condado montado em uma carroça no início de A Sociedade do Anel?",
        answers: [
          { answer: "Aragorn", correct: false },
          { answer: "Gandalf", correct: true },
          { answer: "Legolas", correct: false },
          { answer: "Boromir", correct: false },
        ],
      }, // CONDADO ATÉ AQUI
      {
        question: "Qual é o nome da cidade onde Frodo, Sam, Merry e Pippin encontram Aragorn?",
        answers: [
          { answer: "Valfenda", correct: false },
          { answer: "Gondor", correct: false },
          { answer: "Isengard", correct: false },
          { answer: "Bri", correct: true },
        ],
      },
      {
        question: "Qual é o nome da hospedaria onde os Hobbits ficam em Bri?",
        answers: [
          { answer: "Pônei Saltitante", correct: true },
          { answer: "Dragão Verde", correct: false },
          { answer: "Bolsão", correct: false },
          { answer: "Casa de Elrond", correct: false },
        ],
      },
      {
        question: "Qual é o nome usado por Aragorn quando os Hobbits o encontram em Bri?",
        answers: [
          { answer: "Elessar", correct: false },
          { answer: "Passolargo", correct: true },
          { answer: "Mithrandir", correct: false },
          { answer: "Thorongil", correct: false },
        ],
      },
      {
        question: "Quem entrega uma mensagem a Frodo na hospedaria Pônei Saltitante?",
        answers: [
          { answer: "Boromir", correct: false },
          { answer: "Aragorn", correct: true },
          { answer: "Legolas", correct: false },
          { answer: "Gandalf", correct: false },
        ],
      },
      {
        question: "O que acontece com Frodo ao usar o Um Anel?",
        answers: [
          { answer: "Só os Hobbits não o veem", correct: false },
          { answer: "Vira um Nazgûl", correct: false },
          { answer: "Perde o Anel", correct: false },
          { answer: "Ele desaparece", correct: true },
        ],
      }, // BRI ATÉ AQUI
      {
        question: "Quem é o senhor de Rivendel?",
        answers: [
          { answer: "Gandalf", correct: false },
          { answer: "Galadriel", correct: false },
          { answer: "Elrond", correct: true },
          { answer: "Thranduil", correct: false },
        ],
      },
      {
        question: "Qual personagem é curado em Rivendel após ser ferido pelo Rei Bruxo?",
        answers: [
          { answer: "Sam", correct: false },
          { answer: "Merry", correct: false },
          { answer: "Pippin", correct: false },
          { answer: "Frodo", correct: true },
        ],
      },
      {
        question: "Qual conselho é realizado em Rivendel para decidir o destino do Um Anel?",
        answers: [
          { answer: "Conselho Branco", correct: false },
          { answer: "Conselho de Gondor", correct: false },
          { answer: "Conselho de Elrond", correct: true },
          { answer: "Conselho dos Istari", correct: false },
        ],
      },
      {
        question: "Quem decide acompanhar Frodo na jornada para destruir o Um Anel após o Conselho de Elrond?",
        answers: [
          { answer: "Os Nazgûl", correct: false },
          { answer: "A Sociedade do Anel", correct: true },
          { answer: "O Exército de Gondor", correct: false },
          { answer: "Os Elfos da Floresta", correct: false },
        ],
      },
      {
        question: "Qual é o nome da filha de Elrond que vive em Rivendel e se apaixona por Aragorn?",
        answers: [
          { answer: "Arwen", correct: true },
          { answer: "Galadriel", correct: false },
          { answer: "Éowyn", correct: false },
          { answer: "Rosie", correct: false },
        ],
      }, // RIVENDELL ATÉ AQUI
      {
        question: "Qual era o antigo nome de Moria?",
        answers: [
          { answer: "Minas Tirith", correct: false },
          { answer: "Dol Guldur", correct: false },
          { answer: "Khazad-dûm", correct: true },
          { answer: "Erebor", correct: false },
        ],
      },
      {
        question: "Qual criatura desperta nas profundezas de Moria?",
        answers: [
          { answer: "Smaug", correct: false },
          { answer: "Shelob", correct: false },
          { answer: "Um Nazgûl", correct: false },
          { answer: "O Balrog", correct: true },
        ],
      },
      {
        question: "Qual membro da Sociedade do Anel enfrenta o Balrog na Ponte de Khazad-dûm?",
        answers: [
          { answer: "Aragorn", correct: false },
          { answer: "Boromir", correct: false },
          { answer: "Gimli", correct: false },
          { answer: "Gandalf", correct: true },
        ],
      },
      {
        question: "Qual anão fica especialmente abalado ao descobrir o destino de seu povo em Moria?",
        answers: [
          { answer: "Gimli", correct: true },
          { answer: "Thorin", correct: false },
          { answer: "Balin", correct: false },
          { answer: "Dwalin", correct: false },
        ],
      },
      {
        question: "O que acontece com Gandalf contra o Balrog?",
        answers: [
          { answer: "Cai em Moria", correct: true },
          { answer: "É capturado", correct: false },
          { answer: "Foge para Rivendel", correct: false },
          { answer: "Vira pedra", correct: false },
        ],
      }, // MORIA ATÉ AQUI
      {
        question: "Quem é a senhora de Lothlórien?",
        answers: [
          { answer: "Arwen", correct: false },
          { answer: "Galadriel", correct: true },
          { answer: "Éowyn", correct: false },
          { answer: "Tauriel", correct: false },
        ],
      },
      {
        question: "Qual é o nome do senhor de Lothlórien?",
        answers: [
          { answer: "Elrond", correct: false },
          { answer: "Thranduil", correct: false },
          { answer: "Glorfindel", correct: false },
          { answer: "Celeborn", correct: true },
        ],
      },
      {
        question: "Qual membro da Sociedade do Anel é um elfo e possui uma forte ligação com Lothlórien?",
        answers: [
          { answer: "Aragorn", correct: false },
          { answer: "Gimli", correct: false },
          { answer: "Boromir", correct: false },
          { answer: "Legolas", correct: true },
        ],
      },
      {
        question: "Qual presente Galadriel dá a Frodo?",
        answers: [
          { answer: "Espada élfica", correct: false },
          { answer: "Frasco de Eärendil", correct: true },
          { answer: "Arco de prata", correct: false },
          { answer: "Armadura de mithril", correct: false },
        ],
      },
      {
        question: "Qual presente Galadriel entrega a Gimli?",
        answers: [
          { answer: "Três fios de seu cabelo", correct: true },
          { answer: "Uma pedra de mithril", correct: false },
          { answer: "Um anel élfico", correct: false },
          { answer: "Uma espada élfica", correct: false },
        ],
      }, // LOTHLOREN ATÉ AQUI
      {
        question: "O que são os Argonath?",
        answers: [
          { answer: "Torres de Mordor", correct: false },
          { answer: "Estátuas élficas", correct: false },
          { answer: "Estátuas de reis", correct: true },
          { answer: "Entradas de Moria", correct: false },
        ],
      },
      {
        question: "Quais reis de Gondor são representados pelas estátuas dos Argonath?",
        answers: [
          { answer: "Aragorn e Boromir", correct: false },
          { answer: "Elendil e Aragorn", correct: false },
          { answer: "Isildur e Anárion", correct: true },
          { answer: "Denethor e Boromir", correct: false },
        ],
      },
      {
        question: "Por qual rio a Sociedade do Anel passa ao atravessar os Argonath?",
        answers: [
          { answer: "Isen", correct: false },
          { answer: "Anduin", correct: true },
          { answer: "Brandevin", correct: false },
          { answer: "Lhûn", correct: false },
        ],
      },
      {
        question: "Qual membro da Sociedade do Anel fica especialmente impressionado ao passar pelos Argonath?",
        answers: [
          { answer: "Frodo", correct: false },
          { answer: "Sam", correct: false },
          { answer: "Pippin", correct: false },
          { answer: "Gimli", correct: true },
        ],
      },
      {
        question: "Em qual região a Sociedade do Anel chega após passar pelos Argonath?",
        answers: [
          { answer: "Parth Galen", correct: true },
          { answer: "Bree", correct: false },
          { answer: "Fangorn", correct: false },
          { answer: "Erebor", correct: false },
        ],
      }, // ARGONATH ATÉ AQUI
      {
        question: "Qual é o nome do enorme portão que serve como uma das principais entradas de Mordor?",
        answers: [
          { answer: "Portão de Durin", correct: false },
          { answer: "Portão Negro", correct: true },
          { answer: "Portão de Minas Tirith", correct: false },
          { answer: "Portão de Isengard", correct: false },
        ],
      },
      {
        question: "Qual personagem guia Frodo e Sam em direção à entrada de Mordor?",
        answers: [
          { answer: "Aragorn", correct: false },
          { answer: "Gandalf", correct: false },
          { answer: "Gollum", correct: true },
          { answer: "Legolas", correct: false },
        ],
      },
      {
        question: "O que Frodo e Sam fazem diante do Portão Negro?",
        answers: [
          { answer: "Entram pelo portão", correct: false },
          { answer: "Enfrentam Sauron", correct: false },
          { answer: "Voltam a Gondor", correct: false },
          { answer: "Buscam outra entrada", correct: true },
        ],
      },
      {
        question: "Quem leva Frodo e Sam por um caminho alternativo para entrar em Mordor?",
        answers: [
          { answer: "Faramir", correct: false },
          { answer: "Aragorn", correct: false },
          { answer: "Gandalf", correct: false },
          { answer: "Gollum", correct: true },
        ],
      },
      {
        question: "Qual é o nome da passagem por onde Gollum conduz Frodo e Sam para entrar em Mordor?",
        answers: [
          { answer: "Passagem de Caradhras", correct: false },
          { answer: "Porta de Durin", correct: false },
          { answer: "Desfiladeiro de Helm", correct: false },
          { answer: "Cirith Ungol", correct: true },
        ],
      }, // ENTRADA DE MORDOR ATÉ AQUI 
      {
        question: "Qual é o outro nome da Montanha da Perdição?",
        answers: [
          { answer: "Orodruin", correct: true },
          { answer: "Caradhras", correct: false },
          { answer: "Amon Sûl", correct: false },
          { answer: "Erebor", correct: false },
        ],
      },
      {
        question: "Em qual região da Terra-média está localizada a Montanha da Perdição?",
        answers: [
          { answer: "Gondor", correct: false },
          { answer: "Mordor", correct: true },
          { answer: "Rohan", correct: false },
          { answer: "Lothlórien", correct: false },
        ],
      },
      {
        question: "Por que Frodo e Sam vão à Montanha da Perdição?",
        answers: [
          { answer: "Derrotar Saruman", correct: false },
          { answer: "Encontrar Gandalf", correct: false },
          { answer: "Destruir o Anel", correct: true },
          { answer: "Salvar Gondor", correct: false },
        ],
      },
      {
        question: "Onde o Um Anel foi forjado?",
        answers: [
          { answer: "Rivendel", correct: false },
          { answer: "Montanha da Perdição", correct: true },
          { answer: "Moria", correct: false },
          { answer: "Isengard", correct: false },
        ],
      },
      {
        question: "Quem acaba destruindo o Um Anel na Montanha da Perdição?",
        answers: [
          { answer: "Frodo", correct: false },
          { answer: "Gollum", correct: true },
          { answer: "Sam", correct: false },
          { answer: "Aragorn", correct: false },
        ],
      }, // MONTANHA DA PERDIÇÃO ATÉ AQUI
    ];

    for (const q of questions) {
      // Inserir a pergunta
      const result = await queryRunner.query(
        `
                INSERT INTO questions (question) 
                VALUES (?)`,
        [q.question]
      );

      const questionId = result.insertId;

      // Inserir as respostas
      const answerValues = q.answers.map((a) => [
        a.answer,
        a.correct,
        questionId,
      ]);

      await Promise.all(
        answerValues.map((values) =>
          queryRunner.query(
            `
                    INSERT INTO answers (answer, correct, questionId)
                    VALUES (?, ?, ?)`,
            values
          )
        )
      );
    }

    const users = [
      {
        name: "Diogo",
        email: "diogo@gmail.com",
        password: "@Vitor123",
        score: 4000,
      },
      {
        name: "Lia",
        email: "lia@gmail.com",
        password: "@Vitor123",
        score: 2120,
      },
      {
        name: "Rafa",
        email: "rafa@gmail.com",
        password: "@Vitor123",
        score: 1500,
      },
      {
        name: "Noah",
        email: "joao@gmail.com",
        password: "@Vitor123",
        score: 1200,
      },
      {
        name: "Bia",
        email: "bia@gmail.com",
        password: "@Vitor123",
        score: 1000,
      },
      {
        name: "Caio",
        email: "caio@gmail.com",
        password: "@Vitor123",
        score: 800,
      },
      {
        name: "Nina",
        email: "nina@gmail.com",
        password: "@Vitor123",
        score: 670,
      },
      {
        name: "Jorge",
        email: "jorge@gmail.com",
        password: "@Vitor123",
        score: 400,
      },
      {
        name: "Tati",
        email: "tati@gmail.com",
        password: "@Vitor123",
        score: 200,
      },
      {
        name: "Igor",
        email: "igor@gmail.com",
        password: "@Vitor123",
        score: 100,
      },
    ];

    for (const user of users) {
      const values = [user.name, user.email, user.password, user.score];

      await queryRunner.query(
        `
    INSERT INTO users (name, email, password, score)
    VALUES (?, ?, ?, ?)`,
        values
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM answers`);
    await queryRunner.query(`DELETE FROM questions`);
    await queryRunner.query(`DELETE FROM users WHERE id > 0`);
  }
}
