export default function schemaValidation (schema) {

    return (req, res, next) => {
        const validation = schema.validate(req.body,{abortEarly: false})
        console.log(validation.error)
        if(validation.error){
            const errorMessages = validation.error.details.map(detail=> detail.message)
            return res.status(400).send(errorMessages)
        }
        next()
    }
}