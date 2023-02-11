import {Router} from 'express'
import { inserirAluguel,finalizarAluguel } from '../controllers/rentalsController.js'

const rentalsRouter = Router()

rentalsRouter.post('/rentals', inserirAluguel)
rentalsRouter.post('/rentals/:id/return', finalizarAluguel)

export default rentalsRouter
