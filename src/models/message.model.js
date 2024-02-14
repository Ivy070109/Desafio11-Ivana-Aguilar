import mongoose from "mongoose"

mongoose.pluralize(null)

const collection = 'messages'

const schema = new mongoose.Schema({
    correo: {
        type: String,
        required: true,
    },
    mensaje: {
        type: String, 
        required: true,
    },
})

const model = mongoose.model(collection, schema)
export default model