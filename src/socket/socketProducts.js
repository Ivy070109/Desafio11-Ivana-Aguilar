import ProductManager from "../controllers/ProductManager.js";

const productManager = new ProductManager()

const socketProducts = (socketServer) => {
    socketServer.on('connection', async (socket) => {
        console.log('Cliente conectado con ID:', socket.id)
        const productsArray = await productManager.getProducts()
        socketServer.emit('enviarproducts', productsArray)
    
        socket.on('addProduct', async (obj) => {
            await productManager.addProduct(obj)
            const updatedProducts = await productManager.getProducts()
        socketServer.emit('productsupdated', updatedProducts)
        })
    
        // socket.on('deleteProduct', async (id) => {
        //     await productManager.deleteProduct(id)
        //     const newProductList = await productManager.getProducts()
        // socketServer.emit('productsupdated', newProductList)
        // })

        socket.on('nuevoUsuario', (usuario) => {
            console.log('usuario', usuario)
            socket.broadcast.emit('broadcast', usuario)
        })
        socket.on('disconnect', () => {
            console.log(`Usuario con ID: ${socket.id} está desconectado`)
        })
    })
}

export default socketProducts