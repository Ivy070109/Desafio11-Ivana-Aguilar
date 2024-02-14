import { Router } from 'express'

const router = Router()

// la ruta para comprobar los loggers
router.get('/', (req, res) => {
    try {
        req.logger.fatal('Fatal error')
        req.logger.error('Error')
        req.logger.warning('Warning')
        req.logger.info('Info')
        req.logger.http('HTTP')
        req.logger.debug('Debug')

        res.status(200).send({ status: 'OK', data: 'Loggers trabajando correctamente' })    
    } catch (err) {
        res.status(500).send({ status: 'ERR', data: err.message })
    }
})

export default router