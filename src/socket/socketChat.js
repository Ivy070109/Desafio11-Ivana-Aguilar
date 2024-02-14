import MessageManager from "../controllers/MessageManager.js"

const messages = new MessageManager()

//establecer el ámbito de conección
const socketChat = (socketServer) => {
    //conectamos
    socketServer.on('connection', (socket) => {
        socket.on('mensaje', async (data) => {
            socket.broadcast.emit('user_connected', data)

            await messages.createMessage(data)
            const mensajes = await messages.getMessages()
            socketServer.emit('new_message', mensajes)
        })
    })
}


export default socketChat