import { Router } from 'express'
import ProductManager from '../controllers/ProductManager.js'
import CartManager from '../controllers/CartManager.js'
import { authToken } from '../utils.js'
import { publicAccess, privateAccess, handlePolicies } from '../middlewares/athenticate.js'

const productManager = new ProductManager()
const cartManager = new CartManager()

const router = Router()

router.get('/', publicAccess, async (req, res) => {
    const productsList = await productManager.getProducts({})
    res.render('home', { productsList })
})

// aqui puedo insertar y eliminar los productos
router.get('/realtimeproducts', authToken, handlePolicies(['ADMIN']), async (req, res) => {
    res.render('realtimeproducts')
})

router.get('/chat', authToken, privateAccess, handlePolicies(['USER']), (req, res) => {
    res.render('chat', {})
})

//products solo se mostrará luego de login 
router.get('/products', authToken, privateAccess, async (req, res) => {
    const data = await productManager.getProducts(req.query.page, req.query.limit)
    
    data.pages = []
    for (let i = 1; i <= data.totalPages; i++) data.pages.push(i)

    res.render('products', { data, login_type: 'jwt', user: req.user })    
})

//caso de ser necesario mantengo la página profile
router.get('/profile', authToken, privateAccess, async (req, res) => {
    res.render('profile', { user: req.user })
})

router.get('/carts', authToken, privateAccess, async (req, res) => {
    const cartsProducts = await cartManager.getCarts()
    res.render('carts', { cartsProducts })
})

// Ruta para obtener un carrito por su id.
router.get('/carts/:cid', authToken, privateAccess, async (req, res) => {
    const { cid } = req.params
    let cart = await cartManager.getCartById(cid)

    res.render('cart', { cart })
})

router.get('/register', publicAccess, async (req, res) => {
    res.render('register', {})
})

router.get('/login', publicAccess, async (req, res) => {
    res.render('login', {})
})

router.get('/restore', publicAccess, async (req, res) => {
    res.render('restore', {})
})

export default router