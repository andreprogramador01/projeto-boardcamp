import { inserirJogo } from "../controllers/gamesController.js";
import {Router} from 'express'


const gamesRouter = Router()

gamesRouter.post('/inserirJogo', inserirJogo)

export default gamesRouter