import { promises as fs } from 'fs'
import { nanoid } from 'nanoid'
import ProductManager from '../components/ProductManager.js'
//lo importo para poder ver lo que los carritos incluyan

const productAll = new ProductManager
class CartManager {
    constructor() {
        this.cart = []
        this.path = './files/carts.json'
    }

    readCarts = async () => {
        const carts = await fs.readFile(this.path, "utf-8")
        return JSON.parse(carts)
    }

    writeCarts = async (carts) => {
        await fs.writeFile(this.path, JSON.stringify(carts, null, '\t'))
    }

    exist = async (id) => {
        const carts = await this.readCarts()
        return carts.find(cart => cart.id === id)
    }

    addCarts = async () => {
        const oldCarts = await this.readCarts()
        const id = nanoid(3)
        const cartsConcat = [{id : id, products : []}, ...oldCarts]
        await this.writeCarts(cartsConcat)

        return "Carrito Agregado"
    }

    getCartById = async (id) => {
        const cartById = await this.exist(id)
            if(!cartById) {
                return "Carrito no encontrado"
            }
        return cartById
    }

    addProductInCart = async (cartId, productId) => {
        const listaCarts = await this.readCarts()
            const cart = listaCarts.find(e => e.id === cartId)
            const productIndex = cart.products.findIndex(p => p.productId === productId)
      
            if (productIndex !== -1) {
            cart.products[productIndex].quantity++
            } else {
            cart.products.push({
                productId,
                quantity: 1
            })
        }
        await this.writeCarts(listaCarts)
        return "Producto Agregado al carrito"
    }
}
export default CartManager