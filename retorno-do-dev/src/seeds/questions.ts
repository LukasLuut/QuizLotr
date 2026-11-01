// Banco de perguntas por região (0 = Condado ... 7 = Montanha da Perdição; 8-15 = O Hobbit).
// Gerado a partir do seed original, com correções de lore e perguntas novas.
export interface SeedQuestion {
  region: number
  difficulty: number
  question: string
  explanation: string
  answers: { answer: string; correct: boolean }[]
}

export const QUESTIONS: SeedQuestion[] = [
  {
    region: 0,
    difficulty: 1,
    question: "Qual é o nome da região onde vivem os Hobbits?",
    explanation: "O Condado fica no noroeste da Terra-média e é o lar tranquilo dos Hobbits.",
    answers: [
      {
        answer: "Valfenda",
        correct: false
      },
      {
        answer: "O Condado",
        correct: true
      },
      {
        answer: "Gondor",
        correct: false
      },
      {
        answer: "Mordor",
        correct: false
      }
    ]
  },
  {
    region: 0,
    difficulty: 1,
    question: "Qual Hobbit vive na famosa toca de Bolsão, no Condado?",
    explanation: "Frodo herda Bolsão de seu tio Bilbo, que parte após a festa de aniversário.",
    answers: [
      {
        answer: "Merry Brandebuque",
        correct: false
      },
      {
        answer: "Pippin Tûk",
        correct: false
      },
      {
        answer: "Frodo Bolseiro",
        correct: true
      },
      {
        answer: "Samwise Gamgi",
        correct: false
      }
    ]
  },
  {
    region: 0,
    difficulty: 1,
    question: "Quem organiza uma grande festa de aniversário no Condado no início de A Sociedade do Anel?",
    explanation: "Bilbo celebra seus 111 anos com uma festa enorme e desaparece usando o Anel.",
    answers: [
      {
        answer: "Frodo Bolseiro",
        correct: false
      },
      {
        answer: "Samwise Gamgi",
        correct: false
      },
      {
        answer: "Gandalf",
        correct: false
      },
      {
        answer: "Bilbo Bolseiro",
        correct: true
      }
    ]
  },
  {
    region: 0,
    difficulty: 1,
    question: "Qual personagem chega ao Condado montado em uma carroça no início de A Sociedade do Anel?",
    explanation: "Gandalf chega com sua carroça carregada de fogos de artifício para a festa de Bilbo.",
    answers: [
      {
        answer: "Aragorn",
        correct: false
      },
      {
        answer: "Gandalf",
        correct: true
      },
      {
        answer: "Legolas",
        correct: false
      },
      {
        answer: "Boromir",
        correct: false
      }
    ]
  },
  {
    region: 0,
    difficulty: 1,
    question: "Qual é o nome do jardineiro de Bolsão e fiel amigo de Frodo?",
    explanation: "Sam cuida do jardim de Bolsão, como seu pai, o velho Feitor Gamgi.",
    answers: [
      {
        answer: "Fredegar Bolger",
        correct: false
      },
      {
        answer: "Samwise Gamgi",
        correct: true
      },
      {
        answer: "Ted Ruivão",
        correct: false
      },
      {
        answer: "Lotho Sacola-Bolseiro",
        correct: false
      }
    ]
  },
  {
    region: 0,
    difficulty: 1,
    question: "Que idade Bilbo completa na festa de despedida no Condado?",
    explanation: "Bilbo comemora seu “onzentésimo primeiro” aniversário, junto com os 33 anos de Frodo.",
    answers: [
      {
        answer: "111 anos",
        correct: true
      },
      {
        answer: "120 anos",
        correct: false
      },
      {
        answer: "100 anos",
        correct: false
      },
      {
        answer: "99 anos",
        correct: false
      }
    ]
  },
  {
    region: 0,
    difficulty: 1,
    question: "Quais parentes de Bilbo cobiçam a toca de Bolsão?",
    explanation: "Lobélia Sacola-Bolseiro passa anos tentando ficar com Bolsão.",
    answers: [
      {
        answer: "Os Gamgi",
        correct: false
      },
      {
        answer: "Os Tûk",
        correct: false
      },
      {
        answer: "Os Sacola-Bolseiro",
        correct: true
      },
      {
        answer: "Os Brandebuque",
        correct: false
      }
    ]
  },
  {
    region: 1,
    difficulty: 1,
    question: "Qual é o nome da cidade onde Frodo, Sam, Merry e Pippin encontram Aragorn?",
    explanation: "Os Hobbits conhecem Passolargo na hospedaria de Bri, a caminho de Valfenda.",
    answers: [
      {
        answer: "Valfenda",
        correct: false
      },
      {
        answer: "Gondor",
        correct: false
      },
      {
        answer: "Isengard",
        correct: false
      },
      {
        answer: "Bri",
        correct: true
      }
    ]
  },
  {
    region: 1,
    difficulty: 1,
    question: "Qual é o nome da hospedaria onde os Hobbits ficam em Bri?",
    explanation: "O Pônei Saltitante é a hospedaria de Cevado Carrapicho em Bri.",
    answers: [
      {
        answer: "Pônei Saltitante",
        correct: true
      },
      {
        answer: "Dragão Verde",
        correct: false
      },
      {
        answer: "Bolsão",
        correct: false
      },
      {
        answer: "Casa de Elrond",
        correct: false
      }
    ]
  },
  {
    region: 1,
    difficulty: 1,
    question: "Qual é o nome usado por Aragorn quando os Hobbits o encontram em Bri?",
    explanation: "Passolargo é o nome pelo qual Aragorn é conhecido entre os povos do norte.",
    answers: [
      {
        answer: "Elessar",
        correct: false
      },
      {
        answer: "Passolargo",
        correct: true
      },
      {
        answer: "Mithrandir",
        correct: false
      },
      {
        answer: "Thorongil",
        correct: false
      }
    ]
  },
  {
    region: 1,
    difficulty: 1,
    question: "Quem entrega a Frodo a carta atrasada de Gandalf no Pônei Saltitante?",
    explanation: "Cevado Carrapicho esqueceu de enviar a carta de Gandalf e só a entrega em Bri.",
    answers: [
      {
        answer: "Cevado Carrapicho",
        correct: true
      },
      {
        answer: "Aragorn",
        correct: false
      },
      {
        answer: "Bill Samambaia",
        correct: false
      },
      {
        answer: "Gandalf",
        correct: false
      }
    ]
  },
  {
    region: 1,
    difficulty: 1,
    question: "O que acontece com Frodo ao usar o Um Anel?",
    explanation: "O Anel torna invisível quem o usa — e chama a atenção dos servos de Sauron.",
    answers: [
      {
        answer: "Só os Hobbits não o veem",
        correct: false
      },
      {
        answer: "Vira um Nazgûl",
        correct: false
      },
      {
        answer: "Perde o Anel",
        correct: false
      },
      {
        answer: "Ele desaparece",
        correct: true
      }
    ]
  },
  {
    region: 1,
    difficulty: 1,
    question: "Qual é o nome do pônei que Sam leva de Bri?",
    explanation: "Bill, o pônei, acompanha a Sociedade até os portões de Moria.",
    answers: [
      {
        answer: "Bob",
        correct: false
      },
      {
        answer: "Scadufax",
        correct: false
      },
      {
        answer: "Bill",
        correct: true
      },
      {
        answer: "Asfaloth",
        correct: false
      }
    ]
  },
  {
    region: 1,
    difficulty: 1,
    question: "Quem invade os quartos da hospedaria em Bri durante a noite?",
    explanation: "Os Nazgûl atacam as camas vazias: Passolargo havia escondido os Hobbits.",
    answers: [
      {
        answer: "Orcs de Moria",
        correct: false
      },
      {
        answer: "Os Cavaleiros Negros",
        correct: true
      },
      {
        answer: "Lobos de Isengard",
        correct: false
      },
      {
        answer: "Os Uruk-hai",
        correct: false
      }
    ]
  },
  {
    region: 2,
    difficulty: 2,
    question: "Quem é o senhor de Rivendel?",
    explanation: "Elrond, o Meio-Elfo, é o senhor de Valfenda (Rivendell).",
    answers: [
      {
        answer: "Gandalf",
        correct: false
      },
      {
        answer: "Galadriel",
        correct: false
      },
      {
        answer: "Elrond",
        correct: true
      },
      {
        answer: "Thranduil",
        correct: false
      }
    ]
  },
  {
    region: 2,
    difficulty: 2,
    question: "Qual personagem é curado em Rivendel após ser ferido pelo Rei Bruxo?",
    explanation: "Frodo é ferido por uma lâmina de Morgul no Topo do Vento e curado por Elrond.",
    answers: [
      {
        answer: "Sam",
        correct: false
      },
      {
        answer: "Merry",
        correct: false
      },
      {
        answer: "Pippin",
        correct: false
      },
      {
        answer: "Frodo",
        correct: true
      }
    ]
  },
  {
    region: 2,
    difficulty: 2,
    question: "Qual conselho é realizado em Rivendel para decidir o destino do Um Anel?",
    explanation: "O Conselho de Elrond reúne elfos, anões, homens e hobbits para decidir o destino do Anel.",
    answers: [
      {
        answer: "Conselho Branco",
        correct: false
      },
      {
        answer: "Conselho de Gondor",
        correct: false
      },
      {
        answer: "Conselho de Elrond",
        correct: true
      },
      {
        answer: "Conselho dos Istari",
        correct: false
      }
    ]
  },
  {
    region: 2,
    difficulty: 2,
    question: "Quantos membros formam a Sociedade do Anel?",
    explanation: "Nove caminhantes partem de Valfenda, em oposição aos Nove Cavaleiros Negros.",
    answers: [
      {
        answer: "Sete",
        correct: false
      },
      {
        answer: "Nove",
        correct: true
      },
      {
        answer: "Doze",
        correct: false
      },
      {
        answer: "Cinco",
        correct: false
      }
    ]
  },
  {
    region: 2,
    difficulty: 2,
    question: "Qual é o nome da filha de Elrond que vive em Rivendel e se apaixona por Aragorn?",
    explanation: "Arwen, filha de Elrond, abre mão da imortalidade por amor a Aragorn.",
    answers: [
      {
        answer: "Arwen",
        correct: true
      },
      {
        answer: "Galadriel",
        correct: false
      },
      {
        answer: "Éowyn",
        correct: false
      },
      {
        answer: "Rosie",
        correct: false
      }
    ]
  },
  {
    region: 2,
    difficulty: 2,
    question: "Que espada é reforjada e entregue a Aragorn em Valfenda?",
    explanation: "Andúril, a Chama do Oeste, é forjada a partir dos fragmentos de Narsil.",
    answers: [
      {
        answer: "Ferroada",
        correct: false
      },
      {
        answer: "Andúril",
        correct: true
      },
      {
        answer: "Orcrist",
        correct: false
      },
      {
        answer: "Glamdring",
        correct: false
      }
    ]
  },
  {
    region: 2,
    difficulty: 2,
    question: "Que presentes Bilbo dá a Frodo em Valfenda?",
    explanation: "A cota de mithril salva Frodo da lança de um orc em Moria.",
    answers: [
      {
        answer: "Ferroada e a cota de mithril",
        correct: true
      },
      {
        answer: "O Livro Vermelho e uma pena",
        correct: false
      },
      {
        answer: "O Frasco e a capa élfica",
        correct: false
      },
      {
        answer: "Um mapa e uma bússola",
        correct: false
      }
    ]
  },
  {
    region: 3,
    difficulty: 2,
    question: "Qual era o antigo nome de Moria?",
    explanation: "Khazad-dûm foi o maior reino dos Anões, escavado sob as Montanhas Sombrias.",
    answers: [
      {
        answer: "Minas Tirith",
        correct: false
      },
      {
        answer: "Dol Guldur",
        correct: false
      },
      {
        answer: "Khazad-dûm",
        correct: true
      },
      {
        answer: "Erebor",
        correct: false
      }
    ]
  },
  {
    region: 3,
    difficulty: 2,
    question: "Qual criatura desperta nas profundezas de Moria?",
    explanation: "O Balrog, demônio da Primeira Era, despertou quando os Anões cavaram fundo demais.",
    answers: [
      {
        answer: "Smaug",
        correct: false
      },
      {
        answer: "Shelob",
        correct: false
      },
      {
        answer: "Um Nazgûl",
        correct: false
      },
      {
        answer: "O Balrog",
        correct: true
      }
    ]
  },
  {
    region: 3,
    difficulty: 2,
    question: "Qual membro da Sociedade do Anel enfrenta o Balrog na Ponte de Khazad-dûm?",
    explanation: "Gandalf enfrenta o Balrog na ponte com o famoso “Você não pode passar!”.",
    answers: [
      {
        answer: "Aragorn",
        correct: false
      },
      {
        answer: "Boromir",
        correct: false
      },
      {
        answer: "Gimli",
        correct: false
      },
      {
        answer: "Gandalf",
        correct: true
      }
    ]
  },
  {
    region: 3,
    difficulty: 2,
    question: "Qual anão fica especialmente abalado ao descobrir o destino de seu povo em Moria?",
    explanation: "Gimli encontra o túmulo de seu primo Balin na Câmara de Mazarbul.",
    answers: [
      {
        answer: "Gimli",
        correct: true
      },
      {
        answer: "Thorin",
        correct: false
      },
      {
        answer: "Balin",
        correct: false
      },
      {
        answer: "Dwalin",
        correct: false
      }
    ]
  },
  {
    region: 3,
    difficulty: 2,
    question: "O que acontece com Gandalf contra o Balrog?",
    explanation: "Gandalf cai no abismo com o Balrog e retorna depois como Gandalf, o Branco.",
    answers: [
      {
        answer: "Cai em Moria",
        correct: true
      },
      {
        answer: "É capturado",
        correct: false
      },
      {
        answer: "Foge para Rivendel",
        correct: false
      },
      {
        answer: "Vira pedra",
        correct: false
      }
    ]
  },
  {
    region: 3,
    difficulty: 2,
    question: "Que palavra abre os Portões de Durin em Moria?",
    explanation: "“Fale, amigo, e entre”: a senha é “amigo” em élfico, mellon.",
    answers: [
      {
        answer: "Mellon",
        correct: true
      },
      {
        answer: "Mithril",
        correct: false
      },
      {
        answer: "Elendil",
        correct: false
      },
      {
        answer: "Khazad",
        correct: false
      }
    ]
  },
  {
    region: 3,
    difficulty: 2,
    question: "Que criatura ataca a Sociedade no lago diante dos portões de Moria?",
    explanation: "O Vigia da Água agarra Frodo pelo tornozelo antes de a Sociedade entrar em Moria.",
    answers: [
      {
        answer: "Um Troll das Cavernas",
        correct: false
      },
      {
        answer: "O Balrog",
        correct: false
      },
      {
        answer: "O Vigia da Água",
        correct: true
      },
      {
        answer: "Um Dragão",
        correct: false
      }
    ]
  },
  {
    region: 4,
    difficulty: 2,
    question: "Quem é a senhora de Lothlórien?",
    explanation: "Galadriel é a Senhora da Floresta Dourada, guardiã de Nenya, um dos Três Anéis.",
    answers: [
      {
        answer: "Arwen",
        correct: false
      },
      {
        answer: "Galadriel",
        correct: true
      },
      {
        answer: "Éowyn",
        correct: false
      },
      {
        answer: "Tauriel",
        correct: false
      }
    ]
  },
  {
    region: 4,
    difficulty: 2,
    question: "Qual é o nome do senhor de Lothlórien?",
    explanation: "Celeborn governa Lothlórien ao lado de Galadriel.",
    answers: [
      {
        answer: "Elrond",
        correct: false
      },
      {
        answer: "Thranduil",
        correct: false
      },
      {
        answer: "Glorfindel",
        correct: false
      },
      {
        answer: "Celeborn",
        correct: true
      }
    ]
  },
  {
    region: 4,
    difficulty: 2,
    question: "Qual membro da Sociedade do Anel é um elfo e possui uma forte ligação com Lothlórien?",
    explanation: "Legolas é um elfo da Floresta das Trevas, parente distante dos elfos de Lórien.",
    answers: [
      {
        answer: "Aragorn",
        correct: false
      },
      {
        answer: "Gimli",
        correct: false
      },
      {
        answer: "Boromir",
        correct: false
      },
      {
        answer: "Legolas",
        correct: true
      }
    ]
  },
  {
    region: 4,
    difficulty: 2,
    question: "Qual presente Galadriel dá a Frodo?",
    explanation: "O Frasco contém a luz da estrela de Eärendil — luz para lugares escuros.",
    answers: [
      {
        answer: "Espada élfica",
        correct: false
      },
      {
        answer: "Frasco de Eärendil",
        correct: true
      },
      {
        answer: "Arco de prata",
        correct: false
      },
      {
        answer: "Armadura de mithril",
        correct: false
      }
    ]
  },
  {
    region: 4,
    difficulty: 2,
    question: "Qual presente Galadriel entrega a Gimli?",
    explanation: "Gimli pede apenas um fio de cabelo; Galadriel lhe dá três.",
    answers: [
      {
        answer: "Três fios de seu cabelo",
        correct: true
      },
      {
        answer: "Uma pedra de mithril",
        correct: false
      },
      {
        answer: "Um anel élfico",
        correct: false
      },
      {
        answer: "Uma espada élfica",
        correct: false
      }
    ]
  },
  {
    region: 4,
    difficulty: 2,
    question: "Como Galadriel mostra a Frodo visões do passado e do futuro?",
    explanation: "O Espelho de Galadriel é uma bacia de água que revela o que foi, o que é e o que pode ser.",
    answers: [
      {
        answer: "Com um palantír",
        correct: false
      },
      {
        answer: "Com uma canção élfica",
        correct: false
      },
      {
        answer: "Com seu Espelho",
        correct: true
      },
      {
        answer: "Com o Anel Nenya",
        correct: false
      }
    ]
  },
  {
    region: 4,
    difficulty: 2,
    question: "Que pão élfico a Sociedade recebe em Lothlórien?",
    explanation: "Um pedaço de lembas sustenta um viajante por um dia inteiro de marcha.",
    answers: [
      {
        answer: "Cram",
        correct: false
      },
      {
        answer: "Lembas",
        correct: true
      },
      {
        answer: "Pão de mel",
        correct: false
      },
      {
        answer: "Broa dos Beornings",
        correct: false
      }
    ]
  },
  {
    region: 5,
    difficulty: 3,
    question: "O que são os Argonath?",
    explanation: "Os Argonath, os Pilares dos Reis, guardam a fronteira norte de Gondor no rio Anduin.",
    answers: [
      {
        answer: "Torres de Mordor",
        correct: false
      },
      {
        answer: "Estátuas élficas",
        correct: false
      },
      {
        answer: "Estátuas de reis",
        correct: true
      },
      {
        answer: "Entradas de Moria",
        correct: false
      }
    ]
  },
  {
    region: 5,
    difficulty: 3,
    question: "Quais reis de Gondor são representados pelas estátuas dos Argonath?",
    explanation: "As estátuas representam Isildur e Anárion, filhos de Elendil.",
    answers: [
      {
        answer: "Aragorn e Boromir",
        correct: false
      },
      {
        answer: "Elendil e Aragorn",
        correct: false
      },
      {
        answer: "Isildur e Anárion",
        correct: true
      },
      {
        answer: "Denethor e Boromir",
        correct: false
      }
    ]
  },
  {
    region: 5,
    difficulty: 3,
    question: "Por qual rio a Sociedade do Anel passa ao atravessar os Argonath?",
    explanation: "O Anduin é o Grande Rio que a Sociedade desce em barcos élficos.",
    answers: [
      {
        answer: "Isen",
        correct: false
      },
      {
        answer: "Anduin",
        correct: true
      },
      {
        answer: "Brandevin",
        correct: false
      },
      {
        answer: "Lhûn",
        correct: false
      }
    ]
  },
  {
    region: 5,
    difficulty: 3,
    question: "Qual membro da Sociedade é herdeiro dos reis representados nos Argonath?",
    explanation: "Aragorn é herdeiro de Isildur e se emociona ao passar pelos seus antepassados.",
    answers: [
      {
        answer: "Boromir",
        correct: false
      },
      {
        answer: "Legolas",
        correct: false
      },
      {
        answer: "Aragorn",
        correct: true
      },
      {
        answer: "Gimli",
        correct: false
      }
    ]
  },
  {
    region: 5,
    difficulty: 3,
    question: "Em qual região a Sociedade do Anel chega após passar pelos Argonath?",
    explanation: "Em Parth Galen a Sociedade se divide após o ataque dos Uruk-hai.",
    answers: [
      {
        answer: "Parth Galen",
        correct: true
      },
      {
        answer: "Bree",
        correct: false
      },
      {
        answer: "Fangorn",
        correct: false
      },
      {
        answer: "Erebor",
        correct: false
      }
    ]
  },
  {
    region: 5,
    difficulty: 3,
    question: "Quem tenta tomar o Anel de Frodo em Amon Hen?",
    explanation: "Boromir cede à tentação do Anel, mas se redime defendendo Merry e Pippin.",
    answers: [
      {
        answer: "Boromir",
        correct: true
      },
      {
        answer: "Aragorn",
        correct: false
      },
      {
        answer: "Gimli",
        correct: false
      },
      {
        answer: "Merry",
        correct: false
      }
    ]
  },
  {
    region: 5,
    difficulty: 3,
    question: "Em que tipo de embarcação a Sociedade desce o Anduin?",
    explanation: "Os barcos cinzentos de Lórien são leves o bastante para serem carregados nas margens.",
    answers: [
      {
        answer: "Barcos élficos",
        correct: true
      },
      {
        answer: "Uma galé de Gondor",
        correct: false
      },
      {
        answer: "Jangadas de troncos",
        correct: false
      },
      {
        answer: "Barris de vinho",
        correct: false
      }
    ]
  },
  {
    region: 6,
    difficulty: 3,
    question: "Qual é o nome do enorme portão que serve como uma das principais entradas de Mordor?",
    explanation: "O Morannon, o Portão Negro, fecha a passagem principal para Mordor.",
    answers: [
      {
        answer: "Portão de Durin",
        correct: false
      },
      {
        answer: "Portão Negro",
        correct: true
      },
      {
        answer: "Portão de Minas Tirith",
        correct: false
      },
      {
        answer: "Portão de Isengard",
        correct: false
      }
    ]
  },
  {
    region: 6,
    difficulty: 3,
    question: "Qual personagem guia Frodo e Sam em direção à entrada de Mordor?",
    explanation: "Gollum, domado por Frodo, guia os Hobbits pelas Emyn Muil até Mordor.",
    answers: [
      {
        answer: "Aragorn",
        correct: false
      },
      {
        answer: "Gandalf",
        correct: false
      },
      {
        answer: "Gollum",
        correct: true
      },
      {
        answer: "Legolas",
        correct: false
      }
    ]
  },
  {
    region: 6,
    difficulty: 3,
    question: "O que Frodo e Sam fazem diante do Portão Negro?",
    explanation: "O Portão Negro é guardado demais; Gollum sugere outro caminho.",
    answers: [
      {
        answer: "Entram pelo portão",
        correct: false
      },
      {
        answer: "Enfrentam Sauron",
        correct: false
      },
      {
        answer: "Voltam a Gondor",
        correct: false
      },
      {
        answer: "Buscam outra entrada",
        correct: true
      }
    ]
  },
  {
    region: 6,
    difficulty: 3,
    question: "Qual capitão de Gondor encontra Frodo e Sam em Ithilien?",
    explanation: "Faramir, irmão de Boromir, captura Frodo e Sam em Ithilien e depois os liberta.",
    answers: [
      {
        answer: "Faramir",
        correct: true
      },
      {
        answer: "Boromir",
        correct: false
      },
      {
        answer: "Denethor",
        correct: false
      },
      {
        answer: "Imrahil",
        correct: false
      }
    ]
  },
  {
    region: 6,
    difficulty: 3,
    question: "Qual é o nome da passagem por onde Gollum conduz Frodo e Sam para entrar em Mordor?",
    explanation: "Cirith Ungol é a passagem secreta guardada pela aranha Laracna.",
    answers: [
      {
        answer: "Passagem de Caradhras",
        correct: false
      },
      {
        answer: "Porta de Durin",
        correct: false
      },
      {
        answer: "Desfiladeiro de Helm",
        correct: false
      },
      {
        answer: "Cirith Ungol",
        correct: true
      }
    ]
  },
  {
    region: 6,
    difficulty: 3,
    question: "Como Gollum chama o Um Anel?",
    explanation: "“Meu precioso” revela a obsessão que consumiu Sméagol por séculos.",
    answers: [
      {
        answer: "Minha joia",
        correct: false
      },
      {
        answer: "Meu senhor",
        correct: false
      },
      {
        answer: "Meu tesouro",
        correct: false
      },
      {
        answer: "Meu precioso",
        correct: true
      }
    ]
  },
  {
    region: 6,
    difficulty: 3,
    question: "Qual é o nome da fortaleza de Sauron em Mordor?",
    explanation: "Barad-dûr, a Torre Escura, é onde o Olho de Sauron vigia a Terra-média.",
    answers: [
      {
        answer: "Minas Tirith",
        correct: false
      },
      {
        answer: "Orthanc",
        correct: false
      },
      {
        answer: "Dol Guldur",
        correct: false
      },
      {
        answer: "Barad-dûr",
        correct: true
      }
    ]
  },
  {
    region: 7,
    difficulty: 3,
    question: "Qual é o outro nome da Montanha da Perdição?",
    explanation: "Orodruin é o nome élfico da Montanha da Perdição.",
    answers: [
      {
        answer: "Orodruin",
        correct: true
      },
      {
        answer: "Caradhras",
        correct: false
      },
      {
        answer: "Amon Sûl",
        correct: false
      },
      {
        answer: "Erebor",
        correct: false
      }
    ]
  },
  {
    region: 7,
    difficulty: 3,
    question: "Em qual região da Terra-média está localizada a Montanha da Perdição?",
    explanation: "A Montanha da Perdição fica no planalto de Gorgoroth, em Mordor.",
    answers: [
      {
        answer: "Gondor",
        correct: false
      },
      {
        answer: "Mordor",
        correct: true
      },
      {
        answer: "Rohan",
        correct: false
      },
      {
        answer: "Lothlórien",
        correct: false
      }
    ]
  },
  {
    region: 7,
    difficulty: 3,
    question: "Por que Frodo e Sam vão à Montanha da Perdição?",
    explanation: "O Anel só pode ser destruído nas chamas onde foi forjado.",
    answers: [
      {
        answer: "Derrotar Saruman",
        correct: false
      },
      {
        answer: "Encontrar Gandalf",
        correct: false
      },
      {
        answer: "Destruir o Anel",
        correct: true
      },
      {
        answer: "Salvar Gondor",
        correct: false
      }
    ]
  },
  {
    region: 7,
    difficulty: 3,
    question: "Onde o Um Anel foi forjado?",
    explanation: "Sauron forjou o Um Anel nas Sammath Naur, as Câmaras do Fogo.",
    answers: [
      {
        answer: "Rivendel",
        correct: false
      },
      {
        answer: "Montanha da Perdição",
        correct: true
      },
      {
        answer: "Moria",
        correct: false
      },
      {
        answer: "Isengard",
        correct: false
      }
    ]
  },
  {
    region: 7,
    difficulty: 3,
    question: "Quem acaba destruindo o Um Anel na Montanha da Perdição?",
    explanation: "Gollum arranca o Anel de Frodo e cai com ele na lava.",
    answers: [
      {
        answer: "Frodo",
        correct: false
      },
      {
        answer: "Gollum",
        correct: true
      },
      {
        answer: "Sam",
        correct: false
      },
      {
        answer: "Aragorn",
        correct: false
      }
    ]
  },
  {
    region: 7,
    difficulty: 3,
    question: "Quem carrega Frodo nas costas na subida da Montanha da Perdição?",
    explanation: "“Não posso carregar o Anel, mas posso carregar você!”, diz Sam.",
    answers: [
      {
        answer: "Gollum",
        correct: false
      },
      {
        answer: "Merry",
        correct: false
      },
      {
        answer: "Pippin",
        correct: false
      },
      {
        answer: "Sam",
        correct: true
      }
    ]
  },
  {
    region: 7,
    difficulty: 3,
    question: "O que Gollum arranca de Frodo para tomar o Anel?",
    explanation: "Na beira do abismo, Gollum morde o dedo de Frodo e cai com o Anel.",
    answers: [
      {
        answer: "O Frasco de Galadriel",
        correct: false
      },
      {
        answer: "A capa élfica",
        correct: false
      },
      {
        answer: "A espada Ferroada",
        correct: false
      },
      {
        answer: "O dedo com o Anel",
        correct: true
      }
    ]
  },
  {
    region: 7,
    difficulty: 3,
    question: "Quem resgata Frodo e Sam após a destruição do Anel?",
    explanation: "Gwaihir e as Águias levam os dois Hobbits das encostas em chamas.",
    answers: [
      {
        answer: "Os Elfos de Valfenda",
        correct: false
      },
      {
        answer: "Os Ents",
        correct: false
      },
      {
        answer: "Os Rohirrim",
        correct: false
      },
      {
        answer: "As Águias",
        correct: true
      }
    ]
  },
  // Jornada bônus "O Hobbit" (8 = Montanhas Sombrias, 9 = Floresta das Trevas, 10 = Erebor,
  // 11 = O Condado, 12 = Bosque dos Trolls, 13 = Valfenda, 14 = Casa de Beorn, 15 = Cidade do Lago)
  ...hobbit([
    [8, 1, 'Que objeto Bilbo encontra no chão de uma caverna sob as Montanhas Sombrias?', ['Um anel de ouro', 'Uma espada élfica', 'Uma pedra preciosa', 'Um mapa antigo'], 0, 'Perdido no escuro, Bilbo encontra o Um Anel, que o Gollum havia deixado cair.'],
    [8, 2, 'Qual é a última pergunta de Bilbo no jogo de enigmas com o Gollum?', ['O que tem raízes que ninguém vê?', 'O que é que eu tenho no meu bolso?', 'O que não tem pernas e anda?', 'Qual é o meu nome?'], 1, 'Bilbo, sem enigmas, pergunta o que tem no bolso: o Anel. O Gollum não sabe responder.'],
    [8, 2, 'Como se chamam as espadas que Gandalf e Thorin pegam na toca dos trolls?', ['Andúril e Narsil', 'Glamdring e Orcrist', 'Ferroada e Herugrim', 'Anglachel e Gúthwinë'], 1, 'Glamdring, a Martelo-de-Inimigos, fica com Gandalf; Orcrist, a Fendedora-de-Orcs, com Thorin.'],
    [8, 1, 'Quem resgata a Companhia das árvores em chamas, perseguida por orcs e wargs?', ['Os elfos de Valfenda', 'Beorn', 'As Águias', 'Radagast'], 2, 'As Grandes Águias, a pedido de Gandalf, levam a Companhia para longe do fogo.'],
    [8, 2, 'Que forma Beorn, o troca-peles, pode assumir?', ['Lobo', 'Urso', 'Águia', 'Javali'], 1, 'Beorn vive entre as Montanhas Sombrias e a Floresta das Trevas e pode se tornar um grande urso negro.'],
    [9, 1, 'Que nome Bilbo dá à sua pequena espada depois de lutar contra as aranhas?', ['Ferroada', 'Glamdring', 'Orcrist', 'Picada'], 0, 'Ao vencer a aranha gigante sozinho, Bilbo chama a lâmina de Ferroada.'],
    [9, 2, 'Qual é o rei dos elfos da Floresta das Trevas que prende os anões?', ['Elrond', 'Celeborn', 'Thranduil', 'Thingol'], 2, 'Thranduil, pai de Legolas, prende Thorin e os anões em seus salões subterrâneos.'],
    [9, 1, 'Como os anões fogem dos salões do Rei Élfico?', ['Por um túnel secreto', 'Dentro de barris pelo rio', 'Voando nas Águias', 'Disfarçados de elfos'], 1, 'Bilbo, invisível, solta os anões e os coloca em barris vazios lançados ao rio.'],
    [9, 2, 'Que aviso Gandalf dá sobre a trilha da Floresta das Trevas?', ['Não beber de nenhum rio', 'Não sair da trilha', 'Não acender fogueiras', 'Andar só de dia'], 1, 'Sair da trilha leva a Companhia à perdição: logo os anões se perdem e caem nas teias das aranhas.'],
    [9, 3, 'Que nome Bilbo usa para provocar as aranhas e afastá-las dos anões?', ['Atercop', 'Gollum', 'Smaug', 'Morgoth'], 0, 'Bilbo canta zombando das aranhas e as chama de Atercop, até atraí-las para longe dos amigos.'],
    [10, 1, 'Que tesouro Thorin deseja acima de todos os outros em Erebor?', ['A Arkenstone', 'O Anel de Thrór', 'A Coroa de Durin', 'O Mithril de Moria'], 0, 'A Arkenstone, o Coração da Montanha, era a joia mais preciosa da casa de Durin.'],
    [10, 2, 'Quem mata o dragão Smaug?', ['Thorin', 'Bard, o Arqueiro', 'Gandalf', 'Beorn'], 1, 'Bard acerta a Flecha Negra no único ponto sem escamas do peito de Smaug, avisado por um tordo.'],
    [10, 2, 'Que cidade Smaug destrói depois de sair da Montanha Solitária?', ['Valle', 'Cidade do Lago (Esgaroth)', 'Bri', 'Minas Tirith'], 1, 'Furioso, Smaug ataca Esgaroth, a Cidade do Lago, onde acaba abatido por Bard.'],
    [10, 2, 'Como se chama a batalha que encerra a aventura de O Hobbit?', ['Batalha dos Campos de Pelennor', 'Batalha dos Cinco Exércitos', 'Batalha do Abismo de Helm', 'Batalha de Dagorlad'], 1, 'Elfos, homens e anões enfrentam orcs e wargs diante de Erebor, na Batalha dos Cinco Exércitos.'],
    [10, 3, 'O que Bilbo faz com a Arkenstone para tentar evitar a guerra?', ['Esconde no Condado', 'Entrega a Bard e Thranduil', 'Joga no Lago', 'Devolve a Smaug'], 1, 'Bilbo entrega a Arkenstone a Bard e Thranduil, para que a troquem por uma parte justa do tesouro.'],
    [11, 1, 'Quantos anões chegam a Bolsão para a aventura?', ['Sete', 'Treze', 'Doze', 'Nove'], 1, 'Treze anões, liderados por Thorin Escudo-de-Carvalho, se reúnem na toca de Bilbo.'],
    [11, 1, 'Que marca Gandalf deixa na porta verde de Bolsão?', ['Um desenho de anel', 'Um mapa pintado', 'Um sinal secreto riscado com o cajado', 'Uma estrela élfica'], 2, 'Gandalf risca um sinal na porta para mostrar aos anões onde mora o "ladrão" que procuram.'],
    [11, 2, 'Para que função Gandalf indica Bilbo à Companhia de Thorin?', ['Ladrão (saqueador)', 'Cozinheiro', 'Guia', 'Curandeiro'], 0, 'Gandalf apresenta Bilbo como o ladrão da Companhia, alguém capaz de entrar sem ser visto.'],
    [11, 2, 'Qual é o primeiro anão a bater à porta de Bolsão?', ['Thorin', 'Balin', 'Bombur', 'Dwalin'], 3, 'Dwalin chega primeiro, depois Balin; Thorin só aparece mais tarde, com outros anões.'],
    [11, 1, 'Que objetos de Thrór, avô de Thorin, mostram o caminho para a porta secreta da Montanha?', ['Uma espada e um escudo', 'Um anel e uma coroa', 'Um mapa e uma chave', 'Um chifre e um cajado'], 2, 'O mapa de Thrór e a chave guardada por Gandalf indicam a porta escondida da Montanha Solitária.'],
    [11, 2, 'Qual é o nome do pai de Bilbo?', ['Bungo Bolseiro', 'Drogo Bolseiro', 'Largo Bolseiro', 'Fosco Bolseiro'], 0, 'Bilbo é filho de Bungo Bolseiro e Beladona Tûk.'],
    [11, 3, 'Na pressa de partir, o que Bilbo esquece em Bolsão?', ['A espada', 'O lenço de bolso', 'O mapa', 'A cota de mithril'], 1, 'Bilbo corre até a taverna do Dragão Verde sem chapéu, sem bengala e sem lenço de bolso.'],
    [12, 1, 'Em que os trolls se transformam ao nascer do sol?', ['Em cinzas', 'Em árvores', 'Em sombras', 'Em pedra'], 3, 'A luz do sol transforma os trolls em pedra, e eles ficam ali até hoje.'],
    [12, 2, 'Como se chamam os três trolls que capturam os anões?', ['Tom, Bert e William', 'Uglúk, Grishnákh e Shagrat', 'Azog, Bolg e Gorbag', 'Glaurung, Ancalagon e Scatha'], 0, 'Os trolls Tom, Bert e William (Guilherme) discutem sobre como cozinhar os anões.'],
    [12, 2, 'O que Bilbo tenta fazer ao chegar perto da fogueira dos trolls?', ['Lutar com a espada', 'Apagar o fogo', 'Furtar a bolsa de um deles', 'Negociar com eles'], 2, 'Bilbo tenta furtar a bolsa de William, mas a bolsa fala e o denuncia.'],
    [12, 2, 'Que arma Bilbo pega na toca dos trolls?', ['Um arco', 'Um machado', 'Uma lança', 'Uma pequena faca élfica'], 3, 'A faca élfica, do tamanho de uma espada para um hobbit, mais tarde ganha o nome de Ferroada.'],
    [12, 1, 'Quem salva a Companhia dos trolls?', ['Elrond', 'Gandalf', 'Beorn', 'Thorin'], 1, 'Gandalf imita as vozes dos trolls e os faz brigar entre si até o sol nascer.'],
    [12, 3, 'Que ponte a Companhia cruza antes de chegar às terras dos trolls?', ['A Ponte do Brandevin', 'A Última Ponte', 'A Ponte de Khazad-dûm', 'A Ponte de Osgiliath'], 1, 'Depois da Última Ponte, sobre o Fontegris, a estrada entra nas terras ermas dos trolls.'],
    [12, 2, 'Por que a Companhia se aproxima da fogueira no bosque?', ['Seguiam o mapa de Thrór', 'Queriam caçar trolls', 'Estavam molhados e famintos', 'Gandalf mandou'], 2, 'Na chuva, com fome e sem Gandalf, os anões mandam Bilbo ver de onde vinha a luz.'],
    [13, 2, 'Que segredo Elrond descobre no mapa de Thrór?', ['Letras da lua', 'Um feitiço de fogo', 'O nome do dragão', 'Um caminho para Mordor'], 0, 'As letras da lua só aparecem sob uma lua da mesma forma e estação em que foram escritas.'],
    [13, 2, 'Elrond diz que Orcrist e Glamdring foram forjadas em que cidade antiga?', ['Minas Tirith', 'Moria', 'Númenor', 'Gondolin'], 3, 'As duas espadas foram feitas em Gondolin para as guerras contra os orcs.'],
    [13, 3, 'Segundo as letras da lua, quando a fechadura da porta secreta pode ser vista?', ['No solstício de verão', 'No aniversário de Bilbo', 'No Dia de Durin', 'Na primeira neve'], 2, 'Ao pôr do sol do Dia de Durin, com o tordo batendo na pedra, a última luz revela a fechadura.'],
    [13, 1, 'Quem recebe a Companhia em Valfenda?', ['Elrond', 'Thranduil', 'Celeborn', 'Círdan'], 0, 'Elrond, senhor de Valfenda, hospeda a Companhia e examina o mapa e as espadas.'],
    [13, 2, 'Como Valfenda é chamada em O Hobbit?', ['A Casa dos Reis', 'A Última Casa Amiga', 'O Porto Cinzento', 'O Salão do Fogo'], 1, 'Valfenda é a Última Casa Amiga a leste do Mar.'],
    [13, 2, 'Como os elfos de Valfenda recebem a Companhia?', ['Com flechas de aviso', 'De portões fechados', 'Em silêncio, escondidos', 'Cantando e brincando com os anões'], 3, 'Os elfos cantam nas árvores e riem das barbas dos anões e do pônei de Bilbo.'],
    [13, 2, 'Quanto tempo a Companhia descansa em Valfenda?', ['Cerca de duas semanas', 'Uma noite', 'Um ano', 'Três meses'], 0, 'A Companhia fica pelo menos catorze dias na casa de Elrond antes de enfrentar as montanhas.'],
    [8, 2, 'Quem é o chefe dos gobelins que Gandalf mata na fuga da Cidade dos Gobelins?', ['Azog', 'Bolg', 'O Grande Gobelim', 'Gothmog'], 2, 'Gandalf mata o Grande Gobelim com Glamdring e guia os anões para fora no escuro.'],
    [8, 1, 'Como a Companhia é capturada pelos gobelins?', ['Atravessando um rio', 'Numa emboscada na estrada', 'Perdida na neve', 'Dormindo numa caverna durante uma tempestade'], 3, 'Abrigados da tempestade numa caverna, eles são levados por uma fenda que se abre no fundo.'],
    [14, 1, 'Que animais servem Beorn em sua casa?', ['Lobos e corvos', 'Cavalos, cães e ovelhas', 'Águias e ursos', 'Aranhas e morcegos'], 1, 'Os animais de Beorn põem a mesa, trazem a comida e cuidam da casa.'],
    [14, 2, 'Como Gandalf apresenta a Companhia a Beorn sem irritá-lo?', ['Todos de uma vez', 'Aos pares, no meio da história', 'Por uma carta', 'Disfarçados de elfos'], 1, 'Gandalf conta a aventura e faz os anões aparecerem dois a dois, para Beorn não se zangar com tantos visitantes.'],
    [14, 2, 'Em que rocha do Anduin as Águias deixam a Companhia?', ['O Argonath', 'Amon Hen', 'A Carrocha', 'A Pedra de Erech'], 2, 'A Carrocha é uma ilhota de pedra no Anduin, perto da casa de Beorn.'],
    [14, 1, 'O que há na mesa de Beorn?', ['Mel, pão e creme', 'Carne de cervo', 'Peixe do rio', 'Lembas'], 0, 'Beorn não come os animais: sua mesa tem mel das suas abelhas, pão e creme.'],
    [14, 2, 'O que Beorn empresta à Companhia para chegar à floresta?', ['Barcos', 'Uma carroça', 'Arcos', 'Pôneis'], 3, 'Beorn empresta pôneis até a orla da Floresta das Trevas, e eles são devolvidos lá.'],
    [14, 2, 'Que aviso Beorn dá sobre o rio da Floresta das Trevas?', ['Segui-lo até o lago', 'Atravessá-lo a nado', 'Não beber nem se banhar nele', 'Pescar só à noite'], 2, 'O rio encantado traz sono e esquecimento a quem toca suas águas.'],
    [14, 3, 'Onde Gandalf se separa da Companhia?', ['Na entrada da Floresta das Trevas', 'Em Valfenda', 'Na Cidade do Lago', 'Nas Montanhas Sombrias'], 0, 'No portão da floresta, Gandalf parte para assuntos urgentes no sul.'],
    [9, 2, 'Qual anão cai no rio encantado e dorme por dias?', ['Bofur', 'Bombur', 'Kíli', 'Dori'], 1, 'Bombur cai no rio encantado e mergulha num sono profundo; os outros precisam carregá-lo.'],
    [9, 1, 'Como Bilbo engana as aranhas para salvar os anões?', ['Escondido num barril', 'Com uma tocha', 'Chamando os elfos', 'Usando o Anel para ficar invisível'], 3, 'Invisível, Bilbo confunde as aranhas e corta as teias que prendiam os anões.'],
    [15, 1, 'Qual é o nome da Cidade do Lago?', ['Esgaroth', 'Valle', 'Erebor', 'Annúminas'], 0, 'Esgaroth é a cidade dos homens do lago, construída sobre estacas.'],
    [15, 2, 'Por qual rio os barris levam os anões até o Lago Longo?', ['O Anduin', 'O Rio Corrente', 'O Rio da Floresta', 'O Brandevin'], 2, 'Dos salões do Rei Élfico, os barris descem o Rio da Floresta até o Lago Longo.'],
    [15, 2, 'Quem governa a Cidade do Lago quando a Companhia chega?', ['Bard', 'Girion', 'Dáin', 'O Mestre'], 3, 'A cidade é governada pelo Mestre, que pensa mais em comércio e ouro do que em canções.'],
    [15, 2, 'Que antiga canção o povo do lago lembra ao ver Thorin?', ['A queda de Gondolin', 'A volta do Rei sob a Montanha', 'O retorno do Rei de Gondor', 'A balada de Beren e Lúthien'], 1, 'As canções diziam que o Rei sob a Montanha voltaria e o ouro correria pelos rios.'],
    [15, 2, 'Que ave conta a Bard o ponto fraco de Smaug?', ['Um corvo', 'Um tordo', 'Uma águia', 'Uma coruja'], 1, 'O velho tordo ouviu Bilbo falar da falha na armadura de Smaug e levou o recado a Bard.'],
    [15, 3, 'Bard descende de qual antigo senhor?', ['Thrór, rei de Erebor', 'Isildur', 'Girion, senhor de Valle', 'Elendil'], 2, 'Bard é herdeiro de Girion, senhor de Valle, cidade destruída por Smaug.'],
    [15, 1, 'Sobre que lago fica a cidade dos homens do lago?', ['Lago Longo', 'Lago Evendim', 'Kheled-zâram', 'Mar de Núrnen'], 0, 'A cidade de madeira fica no Lago Longo, ao sul da Montanha Solitária.'],
    [10, 2, 'Como Bilbo descobre o ponto fraco de Smaug?', ['Lendo o mapa de Thrór', 'Ouvindo o tordo', 'Por Gandalf', 'Conversando com o dragão, invisível'], 3, 'Bilbo elogia Smaug, que exibe o peito coberto de joias, e vê uma falha do lado esquerdo.'],
    [10, 2, 'Quem se torna Rei sob a Montanha após a morte de Thorin?', ['Fíli', 'Balin', 'Dáin Pé-de-Ferro', 'Bard'], 2, 'Thorin, Fíli e Kíli morrem na batalha; Dáin, primo de Thorin, assume o reino.'],
  ]),
]

// Formato compacto: [região, dificuldade, pergunta, alternativas, índice da correta, explicação]
function hobbit(rows: [number, number, string, string[], number, string][]): SeedQuestion[] {
  return rows.map(([region, difficulty, question, options, correct, explanation]) => ({
    region,
    difficulty,
    question,
    explanation,
    answers: options.map((answer, i) => ({ answer, correct: i === correct })),
  }))
}
