import cartModel from '../models/carts.model.js'

export class CartService {
    constructor() {
    }

    //obtener carritos
    getCarts = async () => {
        try {
            const carts = await cartModel.find().lean()
            return carts
        } catch (err) {
            return err.message
        }
    }

    //obtener el carrito según id
    getCartById = async (cartId) => {
        try {
            const cart = await cartModel.findById(cartId).populate('products.product').lean()
            return cart
        } catch (err) {
            return err.message
        }
    }

    //crear carrito
    addCart = async (cart) => {
        try {
            const cartExist = await cartModel.create(cart)
            return cartExist
        } catch (err) {
            return err.message
        }
    }

    //modificar carrito
    updateCart = async (cartId, newProductBody) => {
        try {
            const findCart = await cartModel.findById(cartId)
            const newProduct = newProductBody

            findCart.products = newProduct
            await findCart.save()
            return findCart
        } catch (err) {
            return err.message
        }
    }
    
    //borrar carrito según su id
    deleteCart = async (cartId) => {
        try {
            const cart = await cartModel.findByIdAndDelete({ _id: cartId })
            return cart
        } catch (err) {
            return err.message(`No se encuentra el carrito`)
        }
    }
    
    //agregar producto en carrito
    addProductInCart = async (cartId, productId) => {
        try {
            const cart = await cartModel.findById(cartId)
            if (!cart) {
                return ('El carrito no se puede encontrar')
            }
            const productIndex = cart.products.findIndex((prod) => prod.product.equals(productId))
            if (productIndex !== -1) {
                cart.products[productIndex].quantity++
            } else {
                cart.products.push({ product: productId, quantity: 1 })
            }

            return cart.save()
		} catch (err) {
			return err.message
    	}
    }

    //modificar cantidad del producto en carrito
    updateProductInCart = async (cartId, productId, quantity) => {
        try {
            const cart = await cartModel.findById(cartId)
            if (!cart) {
                return ('Carrito no encontrado')
            }
            const productArray = cart.products.findIndex((prod) => prod.product.equals(productId))
            if (productArray !== -1) {
                cart.products[productArray].quantity = quantity
            } else {
                cart.products.push({ product: productId, quantity: 1 })
            }

            return cart.save()
        } catch (err) {
            return err.message
        }
    }

    //borrar los productos en el carrito
    deleteProductInCart = async (cartId, productId) => {
        try {
            const cart = await cartModel.findById(cartId)
            if (!cart) {
                return ('Carrito no encontrado')
            }
            const productIndex = cart.products.findIndex(prod => prod.product._id.equals(productId))
            if (productIndex === -1) {
                return ('Producto no encontrado en el carrito')
            }

            cart.products.splice(productIndex, 1)
            await cart.save()
            return cart
        } catch (err) {
            return err.message
        }
    }

    //borrar todos los productos en el carrito
    deleteAllProductsInCart = async (cartId) => {
        try {
            const cart = await cartModel.findById(cartId)
            if (!cart) {
                return ('El carrito no se puede encontrar')
            }

            cart.products = []
            await cart.save()
            return cart
        } catch (err) {
            return err.message
        }
    }

    finalizePurchase = async (cartId) => {
        try {
            const result = await cartModel.findById(cartId)
            return result
        } catch (err) {
            return err.message
        }
    }
}

