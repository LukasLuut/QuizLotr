import { AppDataSource } from "../data-source";
import { Answer } from "../models/Answer";
import { Question } from "../models/Question";

export class QuestionService {
    // Repositório pra acessar o banco de dados de perguntas
    private questionRepository = AppDataSource.getRepository(Question)
    // Repositório pra acessar o banco de dados de respostas
    private answerRepository = AppDataSource.getRepository(Answer)

    // Método para criar uma nova pergunta
    async findById(id: number) {
        // Verifica se a pergunta existe
        const question = await this.questionRepository.findOne({ where: { id } })
        if (!question) throw new Error('Pergunta não encontrada');

        // Busca as respostas relacionadas à pergunta
        const answers = await this.answerRepository.find({ where: { question: { id: question.id } } });

        // Retorna a pergunta junto com as respostas
        const result = { ...question, answers };

        return result;
    }

    // Método para buscar todas as perguntas
    async findAll() {
        // Verifica se a pergunta existe
        const questions = await this.questionRepository.find({ select: { id: true, question: true }, relations: ['answers'] });
        if (!questions) throw new Error('Pergunta não encontrada');

        return questions;

    }

    // Método para validar se a resposta está correta
    async validateQuestion(data: { questionId: number; answerId: number }) {
        // Verifica se a pergunta existe
        const question = await this.questionRepository.find({ where: { id: data.questionId } });
        if (question.length === 0) return { message: 'Pergunta não encontrada.', isCorrect: false };

        // Verifica se a pergunta existe e trás junto as alternativas
        // para verificar se a alternativa pertence a pergunta
        const searchQuestion = await this.questionRepository.findOne({ where: { id: data.questionId }, relations: ['answers'] });
        if (!searchQuestion) return { message: 'Pergunta não encontrada.', isCorrect: false };

        // Verifica se a resposta existe
        const answer = await this.answerRepository.find({ where: { id: data.answerId } });
        if (answer.length === 0) return { message: 'Resposta não encontrada.', isCorrect: false };

        // Verifica se a resposta pertence a pergunta
        const searchAnswer = searchQuestion.answers.find(a => a.id === data.answerId);
        if (!searchAnswer) return { message: 'Resposta incorreta.', isCorrect: false };

        // Retorna se a resposta está correta, com a pergunta, resposta e a mensagem
        const result = {
            question, answer,
            message: searchAnswer.correct ? 'Resposta correta!' : 'Resposta incorreta.', isCorrect: searchAnswer.correct
        };

        return result;
    }

}
