import { ProductService } from "../services/products.mongo.dao.js"
import { faker } from '@faker-js/faker'

const productService = new ProductService()

class ProductManager {
    constructor() {
    }

    //leer los productos
    readProducts = async () => {
        try {
            return await productService.readProducts()
        } catch (err) {
            return err.message
        }
    }

    //creación de productos
    addProduct = async (product) => {
        try {
            return await productService.addProduct(product)
        } catch (err) {
            return err.message
        }
    }

    //obtener todos los productos    
    getProducts = async (limit, page, category, sort) => {
        try {
            return await productService.getProducts(limit, page, category, sort)
        } catch (err) {
            return err.message
        }
    }

    //Obtener productos según su id
    getProductById = async (pid) => {
        try {
            return await productService.getProductById(pid)
        } catch (err) {
            return err.message
        }
    }

    //Actualizar productos según su id
    updateProduct = async (pid, objModif) => {
        try {
            return await productService.updateProductById(pid, objModif)
        } catch (err) {
            return err.message
        }
    }

    //Borrar productos según su id
    deleteProductById = async (pid) => {
        try {
            return await productService.deleteProductById(pid)
        } catch (err) {
            return err.message
        }
    }

    generateMockingProducts = async (qty) => {
        try {
            const mockProduct = []

            for (let i = 0; i <= qty; i++) {
                const product = {
                    _id: faker.database.mongodbObjectId(),
                    title: faker.commerce.product(),
                    description: faker.commerce.productDescription(),
                    price: faker.commerce.price(),
                    category: faker.commerce.department(),
                    thumbnail: faker.image.urlLoremFlickr({ category: 'fashion' }),
                    status: faker.datatype.boolean(0.9),
                    code: faker.string.nanoid(4),
                    stock: faker.string.numeric(4)
                }
                mockProduct.push(product)
            }

            return mockProduct
        } catch (err) {
            return err.message
        }
    }
}

export default ProductManager