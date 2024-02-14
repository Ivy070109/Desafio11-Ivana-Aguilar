import mongoose from 'mongoose'

mongoose.pluralize(null)

const collection = "tickets"

const schema = new mongoose.Schema({
    code: {
        type: String,
        required: true,
        unique: true
    },
    purchase_datetime: {
        type: Date,
        default: Date.now()
    },
    amount: {
        type: Number,
        required: true
    },
    purchaser: {
        type: String,
        required: true
    }
})

const model = mongoose.model(collection, schema)
export default model