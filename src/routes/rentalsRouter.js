import {Router} from 'express'
import { inserirAluguel } from '../controllers/rentalsController.js'

const rentalsRouter = Router()

rentalsRouter.post('/rentals', inserirAluguel)

export default rentalsRouter
