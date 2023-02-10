
import DateExtension from '@joi/date';
import JoiImport from 'joi';
const joi = JoiImport.extend(DateExtension)

const customerSchema = joi.object({
cpf: joi.string().required().length(11),
 phone: joi.string().required().min(10).max(11),
 name: joi.string().required(),
 birthday: joi.date().format('YYYY-MM-DD').required()
})
export default customerSchema