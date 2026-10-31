import { Router } from 'express'
import { RoundController } from '../controllers/RoundController'
import { authMiddleware } from '../middlewares/authMiddleware'
import { validateDTO } from '../middlewares/validateDTO'
import { AnswerDTO, HelpDTO, IdParamDTO, RankingQueryDTO, StartRoundDTO } from '../dtos/RoundDTOs'

const router = Router()
const controller = new RoundController()
const withId = validateDTO(IdParamDTO, 'params')

// Ranking é público (só nome e pontuação)
router.get('/ranking', validateDTO(RankingQueryDTO, 'query'), controller.ranking.bind(controller))

router.use(authMiddleware)
router.post('/', validateDTO(StartRoundDTO), controller.start.bind(controller))
router.get('/current', controller.current.bind(controller))
router.get('/:id', withId, controller.state.bind(controller))
router.get('/:id/question', withId, controller.question.bind(controller))
router.post('/:id/answer', withId, validateDTO(AnswerDTO), controller.answer.bind(controller))
router.post('/:id/help', withId, validateDTO(HelpDTO), controller.help.bind(controller))
router.post('/:id/pause', withId, controller.pause.bind(controller))
router.post('/:id/resume', withId, controller.resume.bind(controller))
router.post('/:id/abandon', withId, controller.abandon.bind(controller))
router.get('/:id/summary', withId, controller.summary.bind(controller))

export default router
