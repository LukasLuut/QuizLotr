import { Router } from 'express'
import { UserController } from '../controllers/UserController'
import { authMiddleware } from '../middlewares/authMiddleware';
import { validateDTO } from '../middlewares/validateDTO';
import { QuestionController } from '../controllers/QuestionController';

const questionRouter = Router()
const controller = new QuestionController()

// Rota para buscar uma pergunta pelo ID
questionRouter.get('/:id', controller.getById.bind(controller));
// Rota para buscar todas as perguntas e respostas
questionRouter.get('/', controller.list.bind(controller));
// Rota para validar se a resposta está correta
questionRouter.post('/validate', controller.validateQuestion.bind(controller));

export default questionRouter
