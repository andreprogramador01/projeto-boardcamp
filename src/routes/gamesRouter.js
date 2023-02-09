import { inserirJogo,listarJogos } from "../controllers/gamesController.js";
import {Router} from 'express'


const gamesRouter = Router()

gamesRouter.post('/games', inserirJogo)
gamesRouter.get('/games', listarJogos)

export default gamesRouter