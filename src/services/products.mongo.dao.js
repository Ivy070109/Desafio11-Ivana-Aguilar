import productModel from "../models/products.model.js"
import mongoosePaginate from 'mongoose-paginate-v2'

export class ProductService {
    constructor() {
    }

    //leer los productos
    readProducts = async () => {
        try {
            const products = await productModel.find().lean()
            return products
        } catch (err) {
            return err.message
        }
    }

    //creación de productos
    addProduct = async (product) => {
        try {
            const productCreated = await productModel.create(product)
            return productCreated
        } catch (err) {
            return err.message
        }
    }

    //obtener todos los productos    
    getProducts = async (limit, page, category, sort) => {
        try {
            let query = {}
            
        if (category) {
            query.category = category
        }
    
        let options = {
            limit: parseInt(limit) || 10,
            page: parseInt(page) || 1,
            lean: true,
        }
    
        if (sort) {
            options.sort = {
                price: sort === 'asc' ? 1 : -1
            }
        }
    
        const result =  await productModel.paginate(query, options)
        return result
        } catch (err) {
            return err.message
        }
    }

    //Obtener productos según su id
    getProductById = async (pid) => {
        try {
            const productById = await productModel.findById(pid)
            return productById
        } catch (err) {
            return err.message
        }
    }

    //Actualizar productos según su id
    updateProduct = async (pid, objModif) => {
        try {
            const productUpdated = await productModel.findByIdAndUpdate(pid, { $set: objModif })
            return productUpdated
        } catch (err) {
            return err.message
        }
    }

    //Borrar productos según su id
    deleteProductById = async (pid) => {
        try {
            const deleteProduct = await productModel.deleteOne({ _id: pid })
            return deleteProduct
        } catch (err) {
            return err.message
        }
    }
}

