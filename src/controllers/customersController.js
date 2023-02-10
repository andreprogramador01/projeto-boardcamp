import { db } from '../config/database.js'

export async function listarClientes(req, res) {

    try {
        const clientes = await db.query('SELECT * from customers')
        res.send(clientes.rows)
    } catch (error) {
        res.status(500).send('Ocorreu um erro no servidor')
    }



}
export async function listarClientePorID(req, res) {
    const { id } = req.params
    try {
        const clienteFiltrado = await db.query('SELECT * FROM customers where id=$1', [id])

        if (clienteFiltrado.rowCount === 0) return res.sendStatus(404)

        res.send(clienteFiltrado.rows[0])

    } catch (error) {

    }
}
export async function inserirCliente(req, res) {
    const cliente = req.body
    console.log(cliente)
    try {
        const CpfExiste = await db.query('SELECT * FROM customers where cpf=$1', [cliente.cpf])
        if (CpfExiste.rowCount > 0) {
            return res.send(409)
        }
        await db.query('INSERT INTO customers (name,phone,cpf, birthday) VALUES($1,$2,$3,$4)', [cliente.name, cliente.phone, cliente.cpf, cliente.birthday])
        res.send(201)
    } catch (error) {

    }


} export async function atualizarCliente(req, res) {
    const cliente = req.body
    const { id } = req.params

    const cpfExiste = await db.query('SELECT * FROM customers WHERE cpf=$1 and id<>$2', [cliente.cpf, id])

    if(cpfExiste.rowCount>0){
        return res.send(409)
    }
    await db.query('UPDATE customers set name=$1, phone=$2, cpf=$3, birthday=$4 where id=$5',[cliente.name, cliente.phone, cliente.cpf, cliente.birthday, id])
    res.send(200)
}