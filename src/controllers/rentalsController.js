import { db } from '../config/database.js'


export async function inserirAluguel(req, res) {
    const aluguel = req.body
    try {
        if (typeof (aluguel.customerId) != 'number' || typeof (aluguel.gameId) != 'number') {
            return res.sendStatus(400)
        }

        const jogo = await db.query(`SELECT * FROM games WHERE id=$1`, [aluguel.gameId])
        const cliente = await db.query(`SELECT * FROM customers WHERE id=$1`, [aluguel.customerId])
        if (aluguel.daysRented <= 0) {
            return res.sendStatus(400)
        }
        if (jogo.rowCount === 0 || cliente.rowCount === 0) {
            return res.sendStatus(400)
        }
        const precoDia = jogo?.rows[0]?.pricePerDay
        await db.query(`INSERT INTO rentals ("customerId", "gameId", "rentDate","daysRented","originalPrice") 
                        VALUES ($1,$2,NOW()::date,$3,$4);`,
            [aluguel.customerId, aluguel.gameId, aluguel.daysRented, precoDia * aluguel.daysRented])
        const stockTotal = await db.query(`SELECT "stockTotal" FROM games WHERE id= $1`, [aluguel.gameId])
        const gamesSelecionados = await db.query(`SELECT * from rentals WHERE "gameId"=$1`, [aluguel.gameId])

        const qtdStock = stockTotal?.rows[0]?.stockTotal

        if (qtdStock < gamesSelecionados.rowCount) {
            return res.sendStatus(400)
        }

        res.sendStatus(201)
    } catch (error) {
        res.status(500).send(error.message)
    }
}
export async function finalizarAluguel(req, res) {
    const { id } = req.params
    try {
        const verificaAluguelFinalizado = await db.query(`SELECT * FROM rentals WHERE id=$1 AND "delayFee" is not null`, [id])

        if (verificaAluguelFinalizado.rowCount > 0) {
            return res.sendStatus(400)
        }
        await db.query(`UPDATE rentals SET "returnDate"=NOW()::date WHERE id=$1`, [id])

        const diasAtraso = await db.query(` SELECT ("returnDate"-"rentDate")-"daysRented" 
                                        AS dias_atraso FROM rentals WHERE id=$1`, [id])
        if (diasAtraso.rowCount === 0) {
            return res.sendStatus(404)
        }
        const precoJogo = await db.query(`SELECT "pricePerDay" FROM games 
                                        JOIN rentals 
                                            ON games.id=rentals."gameId" WHERE rentals.id=$1`, [id])
        let calculaTaxa = diasAtraso.rows[0].dias_atraso * precoJogo.rows[0].pricePerDay
        if (calculaTaxa <= 0) {
            calculaTaxa = 0
        }

        await db.query(`UPDATE rentals SET "delayFee"=$1 WHERE id=$2`, [calculaTaxa, id])
        res.sendStatus(200)
    } catch (error) {
        res.status(500).send(error.message)
    }

}

export async function listarAlugueis(req, res) {
    try {
        const ListaDeAlugueis = await db.query(`SELECT json_build_object('id',rentals.id, 'customerId', rentals."customerId", 'gameId', rentals."gameId",'rentDate', 
        rentals."rentDate",'daysRented', rentals."daysRented", 'returnDate', rentals."returnDate", 'originalPrice', rentals."originalPrice",'delayFee', rentals."delayFee",
        'customer', json_build_object('id', customers.id, 'name', customers.name), 
        'game', json_build_object('id', games.id, 'name',games.name )) 
        from rentals 
        JOIN customers 
            ON customers.id=rentals."customerId" 
        JOIN games 
            ON games.id=rentals."gameId";`)
        let alugueisFormatado = []

        for (let i = 0; i < ListaDeAlugueis.rows.length; i++) {




            alugueisFormatado.push(ListaDeAlugueis.rows[i].json_build_object)

        }

        res.send(alugueisFormatado)
    } catch (error) {
        res.status(500).send(error.message)
    }

}
export async function apagarAluguel(req, res) {
    const { id } = req.params
    try {
        const existeAluguel = await db.query('SELECT * FROM rentals WHERE id=$1', [id])

        if(existeAluguel.rowCount===0){
            return res.sendStatus(404)
        }
        if(existeAluguel.rows[0].returnDate === null){
            return res.sendStatus(400)
        }
        await db.query('DELETE FROM rentals WHERE id=$1',[id])
       return res.status(200).send('Ok')
    } catch (error) {
        res.status(500).send(error.message)
    }
}