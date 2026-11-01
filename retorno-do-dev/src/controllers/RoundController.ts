import { Request, Response } from 'express'
import { RoundService } from '../services/RoundService'

const service = new RoundService()

// id da partida já validado pelo validateDTO(IdParamDTO, 'params')
const roundId = (req: Request) => Number((req as any).validated.params.id)

export class RoundController {
  async start(req: Request, res: Response) {
    res.status(201).json(await service.start(req.user!.id, req.body.mode, req.body.journey, req.body.persona))
  }

  async current(req: Request, res: Response) {
    res.json(await service.current(req.user!.id))
  }

  async state(req: Request, res: Response) {
    res.json(await service.state(req.user!.id, roundId(req)))
  }

  async question(req: Request, res: Response) {
    res.json(await service.currentQuestion(req.user!.id, roundId(req)))
  }

  async answer(req: Request, res: Response) {
    const { questionId, answerId, useRing } = req.body
    res.json(await service.answer(req.user!.id, roundId(req), questionId, answerId ?? null, !!useRing))
  }

  async help(req: Request, res: Response) {
    res.json(await service.help(req.user!.id, roundId(req), req.body.help))
  }

  async pause(req: Request, res: Response) {
    res.json(await service.pause(req.user!.id, roundId(req)))
  }

  async resume(req: Request, res: Response) {
    res.json(await service.resume(req.user!.id, roundId(req)))
  }

  async abandon(req: Request, res: Response) {
    res.json(await service.abandon(req.user!.id, roundId(req)))
  }

  async summary(req: Request, res: Response) {
    res.json(await service.summary(req.user!.id, roundId(req)))
  }

  async ranking(req: Request, res: Response) {
    const { mode, period } = (req as any).validated.query
    res.json(await service.ranking(mode, period))
  }
}
