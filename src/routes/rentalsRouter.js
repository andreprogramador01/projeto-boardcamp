import { Router } from 'express'
import { inserirAluguel, finalizarAluguel, listarAlugueis } from '../controllers/rentalsController.js'

const rentalsRouter = Router()

rentalsRouter.get('/rentals', listarAlugueis)
rentalsRouter.post('/rentals', inserirAluguel)
rentalsRouter.post('/rentals/:id/return', finalizarAluguel)

export default rentalsRouter
