import { db } from '../config/database.js'

export async function inserirJogo(req, res) {
    const jogo = req.body

    try {
        if (!jogo.name || jogo.stockTotal <= 0 || jogo.pricePerDay <= 0) {
            return res.sendStatus(400)
        }
        const JogoExiste = await db.query('SELECT * FROM games where name= $1;', [jogo.name])


        if (JogoExiste.rows[0]?.name) {
            return res.sendStatus(409)
        }
        await db.query(`INSERT INTO games (name,image,"stockTotal", "pricePerDay") VALUES($1, $2, $3, $4);`, [jogo.name, jogo.image, jogo.stockTotal, jogo.pricePerDay])

        res.sendStatus(201)
    } catch (error) {
        res.status(500).send('Ocorreu um erro no servidor')
    }
}
export async function listarJogos(req,res){
        try {
            const listaJogos = await db.query(`SELECT * FROM games`)
            res.send(listaJogos.rows)
        } catch (error) {
            console.error(error)
            res.status(500).send('Ocorreu um erro no servidor')
        }

}