import { Router } from 'express'
import { authToken } from '../utils.js'
import { handlePolicies } from '../middlewares/athenticate.js'
import UserManager from '../controllers/UserManager.js'

const router = Router()
const controller = new UserManager()

router.get('/', authToken, handlePolicies(['admin']), async (req, res) => {
    try {
        const users = await controller.getUsers()
        res.status(200).send({ status: 'OK', data: users })
    } catch (err) {
        res.status(403).send({ status: 'ERR', data: 'Sin permisos suficientes' })
    }
})
// si no estoy logueado como admin me redireccionará al login

export default router