import {Router} from 'express'
import { listarClientes,inserirCliente,listarClientePorID,atualizarCliente } from '../controllers/customersController.js'
import customerSchema from '../schemas/customerSchema.js'
import schemaValidation from '../middlewares/schemaValidationMiddleware.js'

const customerRouter = Router()

customerRouter.get('/customers', listarClientes)
customerRouter.get('/customers/:id', listarClientePorID)
customerRouter.post('/customers',schemaValidation(customerSchema), inserirCliente)
customerRouter.put('/customers/:id',schemaValidation(customerSchema), atualizarCliente)

export default customerRouter