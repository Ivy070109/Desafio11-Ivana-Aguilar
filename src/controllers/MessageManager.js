import { MessageService } from "../services/messages.mongo.dao.js"

const messageService = new MessageService()

class MessagesManager {
    constructor() {
    }

    //obtener los mensajes guardados en database
    getMessages = async () => {
        try {
            return await messageService.getMessages()
        } catch (err) {
            return err.message
        }
    }

    //crear y guardar los mensajes en database
    createMessage = async (message) => {
        try {
            return await messageService.createMessage(message)
        } catch (err) {
            return err.message
        }
    }
}

export default MessagesManager