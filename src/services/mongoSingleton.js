import mongoose from 'mongoose'
import config from '../config.js'

export default class MongoSingleton {
    static #instance

    constructor() {
        mongoose.connect(config.MONGOOSE_URL)
    }

    static getInstance() {
        if (!this.#instance) {
            this.#instance = new MongoSingleton()
            console.log('Conexión a Base de Datos CREADA')
        } else {
            console.log('Conexión a Base de Datos RECUPERADA')
        }

        return this.#instance
    }
}