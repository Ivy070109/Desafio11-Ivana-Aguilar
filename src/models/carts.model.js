import mongoose from 'mongoose'
//hay que importar el model de productos porque los vamos a utilizar para el populate
import productModel from './products.model.js'

mongoose.pluralize(null)

const collection = "carts"

const schema = new mongoose.Schema({
    products: [
        {
            product: { 
                type: mongoose.Schema.Types.ObjectId,
                ref: 'products'
            },
            quantity: {
                type: Number,
                _id: false,
            },
        },
    ],
})

//populate
schema.pre('find', function() {
    this.populate("products.product")
})

const model = mongoose.model(collection, schema)
export default model