import { AppDataSource } from "../data-source";
import { Achievement } from "../models/Achievement";
import { Round } from "../models/Round";
import { User } from "../models/User";

export class UserService {
  // Repositório pra acessar o banco de dados de usuários
  private userRepository = AppDataSource.getRepository(User);
  // Repositório pra acessar o banco de dados de conquistas
  private achievementRepository = AppDataSource.getRepository(Achievement);

  private roundRepository = AppDataSource.getRepository(Round)

  // Método para criar um novo usuário
  async create(data: { name: string; email: string; password: string }) {
    // Verificica se já existe um usuário com o e-mail informado
    const exists = await this.userRepository.findOne({
      where: { email: data.email },
    });
    if (exists) throw new Error("E-mail já cadastrado");

    // Cria o usuário com os dados informados no parâmetro
    const user = this.userRepository.create(data);
    // Salva o usuário no banco de dados
    await this.userRepository.save(user);

    // Clona o usuário para remover a senha antes de retornar
    const clone: any = { ...user };
    delete clone.password;
    return clone;
  }

  // Método para buscar um usuário pelo e-mail
  async findByEmail(email: string) {
    return this.userRepository.findOne({ where: { email } });
  }

  async findByName(name: string) {
    return this.userRepository.findOne({ where: { name } });
  }

  // Método para buscar todos os usuários
  async findAll() {
    const users = await this.userRepository.find();

    return users;
  }

  // Método para remover um usuário pelo ID
  async removeById(id: number) {
    // Verifica se o usuário existe
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) throw new Error("Usuário não encontrado");

    // Remove o usuário do banco de dados
    await this.userRepository.remove(user);

    return { message: "Usuário removido" };
  }

  // Método para buscar um usuário pelo ID
  async findById(id: number) {
    // Verifica se o usuário existe
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) throw new Error("Usuário não encontrado");

    // Clona o usuário para remover a senha antes de retornar
    const clone: any = { ...user };
    delete clone.password;
    return clone;
  }

  // Método para atualizar um usuário pelo ID
  async update(id: number, data: Partial<User>) {
    // Verifica se o usuário existe
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) throw new Error("Jogador não encontrado");

    // Atualiza os dados do usuário
    if (data.password) {
      user.password = data.password;
    }

    // Remove a senha dos dados a serem atualizados
    const { password, ...rest } = data;
    Object.assign(user, rest);

    // Salva as alterações no banco de dados
    await this.userRepository.save(user);

    // Clona o usuário para remover a senha antes de retornar
    const userClone: any = { ...user };
    delete userClone.password;
    return userClone;
  }

  // Método para remover um usuário pelo ID
  async remove(id: number) {
    // Verifica se o usuário existe
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) throw new Error("Usuário não encontrado");

    // Remove o usuário do banco de dados
    return await this.userRepository.remove(user);
  }

  // Método para retornar o ranking dos 10 usuários com maior pontuação
  async ranking() {
  const rounds = await this.roundRepository.find({
    select: {
      id: true,
      scoreRound: true,
      user: {
        name: true,
      },
    },
    relations: {
      user: true,
    },
    order: {
      scoreRound: "DESC",
    },
    take: 10,
  });

  return rounds;
}


  // Método para criar conquistas com base na pontuação do usuário
  async createAchievement(user: User) {
    // Lista de conquistas disponíveis e pontuação necessária para cada uma
    const achievements = [
      { title: "Primeiro login", scoreNeeded: 1 },
      { title: "Usuário Lendário", scoreNeeded: 2000 },
      { title: "Usuário mais que lendário", scoreNeeded: 3000 },
      { title: "Usuário quase divino", scoreNeeded: 4000 },
      { title: "Usuário divino", scoreNeeded: 5000 },
    ];

    // Cria conquistas para o usuário com base na pontuação
    for (const achievementData of achievements) {
      if (user.score >= achievementData.scoreNeeded) {
        // Verifica se o usuário já possui a conquista
        const exists = await this.achievementRepository.findOne({
          where: { title: achievementData.title, user: { id: user.id } },
        });

        // Se não possui, cria a conquista
        if (!exists) {
          const achievement = this.achievementRepository.create({
            title: achievementData.title,
            user: user,
          });
          await this.achievementRepository.save(achievement);
        }
      }
    }
  }

  // Método para alterar a pontuação do usuário
  async changeScore(id: number, data: { score: number }) {
    // Verifica se o usuário existe
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) throw new Error("Usuário não encontrado");

    // Altera a pontuação do usuário de acordo com o valor informado no parâmetro
    user.score += data.score;

    // Salva as alterações do usuário no banco de dados
    await this.userRepository.save(user);
    // Verifica a pontuação do usuário para criar conquistas, se necessário
    await this.createAchievement(user);

    // Clona o usuário para remover a senha antes de retornar
    const clone: any = { ...user };
    delete clone.password;
    return clone;
  }

  async changeScoreForZero(id: number) {
    // Verifica se o usuário existe
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) throw new Error("Usuário não encontrado");

    // Altera a pontuação do usuário de acordo com o valor informado no parâmetro
    user.score = 0;

    // Salva as alterações do usuário no banco de dados
    await this.userRepository.save(user);
    // Verifica a pontuação do usuário para criar conquistas, se necessário
    await this.createAchievement(user);

    // Clona o usuário para remover a senha antes de retornar
    const clone: any = { ...user };
    delete clone.password;
    return clone;
  }

  async setScoreRound(id: number, data: {score: number}) {
    const user = await this.userRepository.findOne({ where: { id } });
    if(!user) throw new Error("Usuário não encontrado");

    const round = await this.roundRepository.create({ scoreRound: data.score, user: user});

    await this.roundRepository.save(round);

    return round;
  }
}
