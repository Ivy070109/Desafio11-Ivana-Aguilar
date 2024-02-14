import { CartService } from "../services/carts.mongo.dao.js"

const cartService = new CartService()

class CartManager {
    constructor() {
    }

    //obtener carritos
    getCarts = async () => {
        try {
            return await cartService.getCarts()
        } catch (err) {
            return err.message
        }
    }

    //obtener el carrito según id
    getCartById = async (cartId) => {
        try {
            return await cartService.getCartById(cartId)
        } catch (err) {
            return err.message
        }
    }

    //crear carrito
    addCart = async (cart) => {
        try {
            return await cartService.addCart(cart)
        } catch (err) {
            return err.message
        }
    }

     //modificar carrito
    updateCart = async (cartId, newProductBody) => {
        try {
            return await cartService.updateCart(cartId, newProductBody)
        } catch (err) {
            return err.message
        }
    }
    
    //borrar carrito según su id
    deleteCart = async (cartId) => {
        try {
            return await cartService.deleteCart(cartId)
        } catch (err) {
            return err.message
        }
    }
    
    //agregar producto en carrito
    addProductInCart = async (cartId, productId) => {
        try {
            return await cartService.addProductInCart(cartId, productId)
		} catch (err) {
			return err.message
    	}
    }

    //modificar cantidad del producto en carrito
    updateProductInCart = async (cartId, productId, quantity) => {
        try {
            return await cartService.updateProductInCart(cartId, productId, quantity)
        } catch (err) {
            return err.message
        }
    }

    //borrar los productos en el carrito
    async deleteProductInCart(cartId, productId) {
        try {
            return await cartService.deleteProductInCart(cartId, productId)
        } catch (err) {
            return err.message
        }
    }

    //borrar todos los productos en el carrito
    deleteAllProductsInCart = async (cartId) => {
        try {
            return await cartService.deleteAllProductsInCart(cartId)
        } catch (err) {
            return err.message
        }
    }

    finalizePurchase = async (cartId) => {
        try {
            return await cartService.finalizePurchase(cartId)
        } catch (err) {
            return err.message
        }
    }
}

export default CartManager
