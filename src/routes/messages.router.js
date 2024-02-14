import { Router } from 'express'
import MessagesManager from '../controllers/MessageManager.js'

const router = Router()
const controller = new MessagesManager()

router.get('/', async (req, res) => {
    try {
        const messages = await controller.getMessages()
        res.status(200).send({ status: 'OK', data: messages })
    } catch (err) {
        res.status(500).send({ status: 'ERR', data: err.message })
    }
})

export default router