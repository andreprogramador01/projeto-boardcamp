import express from 'express'
import cors from 'cors'
import gamesRouter from './routes/gamesRouter.js'
import customerRouter from './routes/customersRouter.js'
import rentalsRouter from './routes/rentalsRouter.js'

const app = express()

app.use(cors())
app.use(express.json())

app.use([gamesRouter,customerRouter, rentalsRouter])


app.listen(5000, () => { console.log('servidor rodando na porta 5000') })