import express from "express"
import handlebars from "express-handlebars"
import { Server } from "socket.io"
import cookieParser from 'cookie-parser'
import session from 'express-session'
import MongoStore from 'connect-mongo'
import passport from "passport"

import productRouter from "./routes/product.router.js"
import cartsRouter from "./routes/carts.router.js"
import viewsRouter from './routes/views.router.js'
import socketProducts from './socket/socketProducts.js'
import socketChat from './socket/socketChat.js'
import usersRouter from './routes/users.routes.js'
import sessionsRoutes from './routes/sessions.routes.js'
import MongoSingleton from "./services/mongoSingleton.js"
import addLogger from "./services/winston.logger.js"
// importo el logger y el router de loggerTest
import loggerRoutes from './routes/logger.router.js'

import config from "./config.js"

try {
    // ahora podemos conectar a base de datos desde services
    MongoSingleton.getInstance()
    
    const app = express()
    const httpServer = app.listen(config.PORT, () => {
        //console.log(`Servidor Express ejecutándose en el puerto ${config.PORT} conectado a BBDD ${config.MONGOOSE_URL}`)
        console.log(`Servidor Express activo en modo ${config.MODE}, ejecutándose en el puerto ${config.PORT}`)
    })

    // process.on exit
    process.on('exit', code => {
        switch (code) {
            case -4: 
                console.log(`Proceso finalizado por argumentación inválida en una función`)
                break

            default:    
                console.log(`El proceso de servidor finalizó (err: ${code})`)
        }
    })

    // process.on para procesos inesperados
    process.on('uncaughtException', exception => {
        console.log(exception.name)
        console.log(exception.message)
    })

    const socketServer = new Server(httpServer, {
        cors: {
            origin: "*",
            methods: ["PUT", "GET", "POST", "DELETE", "OPTIONS"],
            credentials: false
        }
    })

    //middleware a nuvel app, para captar los errores
    app.use((err, req, res, next) => {
        console.log(err.stack)
        res.status(500).send('Algo falló')
    })

    app.use(express.json())
    app.use(express.urlencoded({ extended: true }))
    app.use(cookieParser(config.SECRET_KEY))
    app.use(session({
        store: MongoStore.create({ mongoUrl: config.MONGOOSE_URL, mongoOptions: {}, ttl: 1800, clearInterval: 5000 }),
        secret: config.SECRET_KEY,
        resave: false, 
        saveUninitialized: false
    }))
    
    //inicializo passport 
    app.use(passport.initialize())
    app.use(passport.session())

    app.use('/static', express.static(`${config.__DIRNAME}/public`))

    app.engine('handlebars', handlebars.engine())
    app.set('views', `${config.__DIRNAME}/views`)
    app.set('view engine', 'handlebars')

    // inyecto el logger acá ya que es el primer eslabon de los routers y yo quiero acceder a cualquiera de ellos
    app.use(addLogger)
    app.use("/api/products", productRouter)
    app.use("/api/carts", cartsRouter)
    app.use("/api/users", usersRouter)
    app.use('/', viewsRouter)
    app.use('/api/sessions', sessionsRoutes)
    app.use('/api/loggerTest', loggerRoutes)

    socketProducts(socketServer)
    socketChat(socketServer)

    // app.use((err, req, res, next) => {
    //     const code = err.code || 500
    //     res.status(code).send({ status: 'ERR', data: err.message })
    // })

    app.all('*', (req, res, next) => {
        res.status(404).send({ status: 'ERR', data: 'Página no encontrada o parámetro no válido' })
    })
} catch (err) {
    console.log(`No se puede conectar con las bases de datos (${err.message})`)
}




