import { Router } from "express"
import CartManager from "../controllers/CartManager.js"
import TicketManager from "../controllers/TicketManager.js"
import ProductManager from '../controllers/ProductManager.js'
import { authToken } from '../utils.js'
import { handlePolicies } from "../middlewares/athenticate.js"

const router = Router()
const cart = new CartManager()
const productManager = new ProductManager()
const ticket = new TicketManager()

//ver todos los carritos
router.get('/', async (req, res) => {
    try {
        const carts = await cart.getCarts()
    
        return res.status(200).send({ status: "OK", data: carts })    
    } catch (err) {
        res.status(500).send({ status: 'ERR', data: err.message })
    }
})

//obtener carrito por id
router.get('/:cid', async (req, res) => {
    try {
        const { cid } = req.params
        const foundCart = await cart.getCartById(cid)
        if (!foundCart) {
            return res.status(404).send({ status: 'ERR', message: 'Carrito no encontrado'})
        }
    
        return res.status(200).send({ status: "OK", data: foundCart })    
    } catch (err) {
        res.status(500).send({ status: 'ERR', data: err.message })
    }
})

//crear carrito
router.post('/', async (req, res) => {
    try {
        const product = req.body
        const newCart = await cart.addCart(product)
        
        return res.status(200).send({ status: 'OK', data: newCart })
    } catch (err) {
        res.status(500).send({ status: 'ERR', data: err.message })
    }
})

//modificar carrito
router.put(':/cid', authToken, handlePolicies(['USER']), async (req, res) => {
    try {
        const { cid } = req.params
        const { newProducts } = req.body 
        const updated = await cart.updateCart(cid, newProducts)
        if (!updated) {
            return res.status(400).send({ status: 'ERR', message: 'El carrito no se encuentra' })
        }
        return res.status(200).send({ status: 'OK', data: updated })
    } catch (err) {
        res.status(500).send({ status: 'ERR', data: err.message })
    }
})

//eliminar carrito por id
router.delete('/:cid', async (req, res) => {
    try {
        const cid = req.params.cid
        const deleteCart = await cart.deleteCart(cid)

        if (deleteCart === true) {
            res.status(200).send({ status: 'OK', data: deleteCart })
        } else {
            res.status(404).send({ status: 'ERR', data: 'Carrito no encontrado'})
        }
    } catch (err) {
        res.status(500).send({ status: 'ERR', data: err.message })
    }
})

//agregar producto en carrito
router.post('/:cid/products/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params
        const addProduct = await cart.addProductInCart(cid, pid)
        return res.status(200).send({ status: 'OK', data: addProduct })
    } catch (err) {
        res.status(500).send({ status: 'ERR', data: err.message })
    }
})

//actualizar cantidad de productos
router.put('/:cid/products/:pid', authToken, handlePolicies(['USER']), async (req, res) => {
    try {
        const { pid, cid } = req.params
        const { quantity } = req.body

        const updateCart = await cart.updateProductInCart(cid, pid, quantity)
        return res.status(200).send({ status: 'OK', data: updateCart })
    } catch (err) {
        res.status(500).send({ status: 'ERR', data: err.message })
    }
})

//eliminar del carrito el producto seleccionado
router.delete('/:cid/products/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params
        const deleteProduct = await cart.deleteProductInCart(cid, pid)
        return res.status(200).send({ status: 'OK', data: deleteProduct })
    } catch (err) {
        res.status(500).send({ status: 'ERR', data: err.message })
    }
})

router.delete('/:cid/clear', async (req, res) => {
    try {
        const cartId = req.params.cid
        const result = await cart.deleteAllProductsInCart(cartId)

        return res.status(200).send(result)
    } catch (err) {
        res.status(500).send({ status: 'ERR', data: err.message })
    }
})

router.param('cid', async (req, res, next, pid) => {
    const regex = new RegExp(/^[a-fA-F0-9]{24}$/)
    if (regex.test(req.params.cid)) {
        next()
    } else {
        res.status(404).send({ status: 'ERR', data: 'Parámetro no válido' })
    }
})  

// finalizacion de compras 
router.get('/:cid/purchase', authToken, handlePolicies(['USER']), async (req, res) => {
    const { cid } = req.params
    try {
        //busco el carrito 
        const purchase = await cart.getCartById(cid)
        //creo un array vacio en el que se mostrarán los productos que no tengan stock
        const unavalibleProducts = []
        let totalAmount = 0

        //busco en el array del carrito los productos
        for (const item of purchase.products) {
            const product = item.product
            const quantity = item.quantity

            // busco el producto 
            const productInStock = await productManager.getProductById(product._id)

            // si el producto se encuentra en el stock le indico que se disminuya en la cantidad disponible 
            if (productInStock.stock >= quantity) {
                productInStock.stock -= quantity
                await productInStock.save()

                totalAmount += product.price * quantity
                cart.deleteProductInCart(cid, product._id)
            } else {
                // muestro en el array los productos cuyo stock no este disponible
                unavalibleProducts.push(product._id)
            }
        }
        // ticket
        await ticket.createTicket(totalAmount, req.user.email)
        res.status(200).send({ status: 'OK', data: unavalibleProducts })
    } catch (error) {
        res.status(500).send({status: 'ERR', data: error.message })
    }
})

export default router