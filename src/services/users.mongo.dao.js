import usersModels from '../models/users.model.js'

export class UserService {
    constructor() {
    }

    //obtener users
    getUsers = async () => {
        try {
            const users = await usersModels.find().lean()
            return users
        } catch (err) {
            return err.message
        }
    }

    // crear los users
    createUser = async (first_name, last_name, email, age, password, cart, role) => {
        try {
            const result = await usersModels.create(first_name, last_name, email, age, password, cart, role)
            return result
        } catch (err) {
            return err.message
        }
    }
}

