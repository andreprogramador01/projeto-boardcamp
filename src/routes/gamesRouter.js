import { inserirJogo,listarJogos } from "../controllers/gamesController.js";
import {Router} from 'express'


const gamesRouter = Router()

gamesRouter.post('/inserirJogo', inserirJogo)
gamesRouter.get('/listarJogos', listarJogos)

export default gamesRouter