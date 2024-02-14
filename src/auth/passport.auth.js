import passport from 'passport'
import LocalStrategy from 'passport-local'
import GithubStrategy from 'passport-github2'
import jwt from 'passport-jwt'
import userModel from '../models/users.model.js'
import { createHash, isValidPassword } from '../utils.js'
//importo config
import config from '../config.js'

const initPassport = () => {
    //verificaicón login token
    const verifyLogin = async (req, username, password, done) => {
        try {
            const userInDb = await userModel.findOne({ email: username })
            
            if (userInDb !== null && isValidPassword(userInDb, password)) {
                const { _id, password, ...user } = userInDb._doc
                if (user) return done(null, user)
            }

            done(null, false)
        } catch (err) {
            return done(`Error passport login: ${err.message}`)
        }
    }

    //función de verificación de registro
    const verifyRegistration = async (req, username, password, done) => {
        try {
            const { first_name, last_name, email, age } = req.body

            if (!first_name || !last_name || !email || !age) {
                return done('Se requieren los campos completos', false)
            }

            const user = await userModel.findOne({ email: username })

            if (user) return done(null, false)
            
            const newUser = {
                first_name,
                last_name,
                email,
                age,
                password: createHash(password)
            }

            const process = await userModel.create(newUser)

            return done(null, process)
        } catch (err) {
            return done(`Error passport local: ${err.message}`)
        }
    }

    //función para la restauración de la contraseña
    const verifyRestoration = async (req, username, password, done) => {
        try {
            if (username.length === 0 || password.length === 0) {
                return done('Se requieren los campos completos', false)
            } 

            const user = await userModel.findOne({ email: username })
            if (!user) return done(null, false)

            const process = await userModel.findOneAndUpdate({ email: username }, { password: createHash(password) })

            return done(null, process)
        } catch(err) {
            return done(`Error passport local: ${err.message}`)
        }
    }

    //función para autenticación de github
    const verifyGithub = async (accessToken, refreshToken, profile, done) => {
        try {
            console.log(profile)
            const user = await userModel.findOne({ email: profile._json.email })
            if (!user) {
                const name_parts = profile._json.name.split(' ')
                const newUser = {
                    first_name: name_parts[0],
                    last_name: name_parts[1],
                    email: profile._json.email,
                    age: 19,
                    password: ' '
                }

                const process = await userModel.create(newUser)
    
                return done(null, process)
            } else {
                done(null, user)
            }
        } catch (err) {
            return done(`Error passport Github: ${err.message}`)
        }
    }

    const verifyJwt = async (payload, done) => {
        try {
            return done (null, payload)
        } catch (err) {
            return done(err)
        }
    }

    const cookieExtractor = (req) => {
        let token = null
        if (req && req.cookies) token = req.cookies['newCommerce']
        return token
    }

    //estrategjwtAuthia local de login
    passport.use('loginAuth', new LocalStrategy({
        passReqToCallback: true,
        usernameField: 'email', 
        passwordField: 'password', 
    }, verifyLogin))
    
    //estrategia local de autenticación de registro
    passport.use('register', new LocalStrategy({
        passReqToCallback: true,
        usernameField: 'email',
        passwordField: 'password'
    }, verifyRegistration))
    
    //estrategia local de autenticación de restauración de contraseña
    passport.use('restore', new LocalStrategy({
        passReqToCallback: true,
        usernameField: 'email',
        passwordField: 'password'
    }, verifyRestoration))

    //estrategia para autenticación externa con github
    passport.use('githubAuth', new GithubStrategy({
        clientID: config.GITHUB_AUTH.clientId,
        clientSecret: config.GITHUB_AUTH.clientSecret,
        callbackURL: config.GITHUB_AUTH.callbackUrl,
        passReqToCallback: true
    }, verifyGithub))

    passport.use('jwtAuth', new jwt.Strategy({
        jwtFromRequest: jwt.ExtractJwt.fromExtractors([cookieExtractor]),
        secretOrKey: config.PRIVATE_KEY
    }, verifyJwt))

    passport.serializeUser((user, done) => {
        done(null, user._id)
    })
    
    passport.deserializeUser(async (id, done) => {
        try {
            done(null, await userModel.findById(id))
        } catch (err) {
            done(err.message)
        }
    })
}

export default initPassport
