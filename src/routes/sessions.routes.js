import { Router } from 'express'
//importar de passport
import passport from 'passport'

import { createHash, isValidPassword, generateToken, passportCall } from '../utils.js'
import initPassport from '../auth/passport.auth.js'

initPassport()

const router = Router()

//middleware de autenticación del admin
const auth = (req, res, next) => {
    try {
        if (req.user.admin) {
            if (req.user.admin === true) {
                next()
            } else {
                res.status(403).send({ status: 'ERR', data: 'Usuario no admin', role: 'user' })
            }
        } else {
            res.status(401).send({ status: 'ERR', data: 'Usuario no autorizado' })
        }
    } catch (err) {
        res.status(500).send({ status: 'ERR', data: err.message })
    }
}

// Middleware de permisos, nos permite checkear y también controla los errores para los endpoints
// const authorization = role => {
//     return async (req, res, next) => {
//         if (!req.user) return res.status(401).send({ status: 'ERR', data: 'Usuario no autenticado' })
//         console.log(req.user)
//         if (req.user.role !== role) return res.status(403).send({ status: 'ERR', data: 'Sin permisos suficientes' })
//         next()
//     }
// }

const handlePolicies = policies => {
    return async (req, res, next) => {
        if (!req.user) return next(new CustomError(errorsDictionary.UNAUTHORIZED_USER))

        // Normalizamos todo a mayúsculas para comparar efectivamente
        const userRole = req.user.role.toUpperCase();
        policies.forEach((policy, index) => policies[index] = policies[index].toUpperCase());

        if (policies.includes('PUBLIC') || policies.includes(userRole)) return next()
        return next(new CustomError(errorsDictionary.INSUFFICIENT_PERMISSIONS));
    }
}

// cerrar sesion
router.get('/logout', async (req, res) => {
    try {
        req.user = {}
        res.clearCookie('newCommerce')

        req.session.destroy((err) => {
            if (err) {
                res.status(500).send({ status: 'ERR', data: err.message })
            } else {
                res.redirect('/login')
            }
        })
    } catch (err) {
        res.status(500).send({ status: "ERR", data: err.message })
    }
})

// pequeña autenticación del admin, utilizaré un middleware para ésto  
router.get('/admin', auth, async (req, res) => {
    try {
        res.status(200).send({ status: 'OK', data: 'Éstos son los datos para el administrador'})
    } catch (err) {
        res.status(500).send({ status: 'ERR', data: err.message })
    }
})

//para hashear passwords planos anteriores. Es un endpoint de uso interno!
router.get('/hash/:pass', async (req, res) => {
    res.status(200).send({ status: 'OK', data: createHash(req.params.pass) })
})

//endpoint de fail de register
router.get('/failregister', async (req, res) => {
    res.status(400).send({ status: 'ERR', data: 'El email ya existe o faltan completar campos obligatorios' })
})

//endpoint de fail restore
router.get('/failrestore', async (req, res) => {
    res.status(400).send({ status: 'ERR', data: 'El email no existe o faltan completar campos obligatorios' })
})

//ruta de autenticación fail de login
router.get('/failauth', async (req, res) => {
    res.status(400).send({ status: 'ERR', data: 'Ha habido un error en el login' })
})

//endpoint de github con autenticación con passport
router.get('/github', passport.authenticate('githubAuth', { scope: ['user: email'] }), async (req, res) => {
})

//endpoint de callback de github
router.get('/githubcallback', passport.authenticate('githubAuth', { failureRedirect: '/login' }), async (req, res) => {
    req.session.user = { username: req.user.email, admin: true }
    //req.session.user = req.user
    res.redirect('/profile')
})

//router de prueba para process.on()
router.get('/listnumbers', async (req, res) => {
    listNumbers(1, 15, 'tres', 22, 5)
    res.status(200).send('Éste endpoint es solo de prueba para process.on() clase 25')
})

router.get('/longfile', async (req, res) => {
    const childProcess = fork('./src/longExecutionFunction.js')
    childProcess.send('iniciar')
    childProcess.on('message', result => {
        res.status(200).send({ status: 'OK', data: result })
    })
})

// tengo que ser un admin para poder ingesar
router.get('/current', passportCall('jwtAuth', { session: false }), async (req, res) => {
    res.status(200).send({ status: 'OK', data: req.user })

})

/*
router.get('/current', passportCall('jwtAuth', { session: false }), handlePolicies(['user', 'premium', 'admin']), async (req, res) => {
    res.status(200).send({ status: 'OK', data: req.user })
})
*/

//login con token
/*
router.post('/login', async (req, res) => {
    try { 
        const { email, password } = req.body

        const userInDb = await usersModel.findOne({ email: email })

        if (userInDb !== null && isValidPassword(userInDb, password)) {
            //req.session.user = { username: email, admin: true } 
            //res.redirect('/products')

            const access_token = generateToken({ username: email, role: 'admin' }, '1h')
            //res.status(200).send({ status: 'OK', data: access_token })
           // res.redirect(`/profile?access_token=${access_token}`)
            res.cookie('newCommerce', access_token, { maxAge: 60 * 60 * 1000, httpOnly: true })
            //res.status(200).send({ status: 'OK', data: { access: "authorized", token: access_token } })
            res.redirect(`/profile?access_token=${access_token}`)
        } else {
            res.status(401).send({ status: 'ERR', data: `Datos no válidos` })
        } 
    } catch (err) {
        res.status(500).send({ status: 'ERR', data: err.message })
        }
})
*/

router.post('/login', passport.authenticate('loginAuth', { failureRedirect: '/login?msg=Usuario o clave no válidos', session: false }), async (req, res) => {
    const access_token = generateToken(req.user, '1h')
    res.cookie('newCommerce', access_token, { maxAge: 60 * 60 * 1000, httpOnly: true })
    setTimeout(() => res.redirect('/products'), 200);
})

//register con passport
router.post('/register', passport.authenticate('register', { failureRedirect: '/api/sessions/failregister'}), async (req, res) => {
    try {
        res.status(200).send({ status: 'OK', data: 'Usuario registrado' })
        //res.redirect('/login')
    } catch(err) {
        res.status(500).send({ status: 'ERR', data: err.message })
    }
})

//restaurar contraseña
router.post('/restore', passport.authenticate('restore', { failureRedirect: '/api/sessions/failrestore' }), async (req, res) => {
    try {
        res.status(200).send({ status: 'OK', data: "Contraseña actualizada" })
    } catch (err) {
        res.status(500).send({ status: 'ERR', data: err.message })
    }
})

export default router
