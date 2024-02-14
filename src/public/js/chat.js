const socket = io()

let user = ''

const nombreUsuario = document.getElementById('nombreUsuario')

if(!user) {
    Swal.fire({
        title: "Bienvenido al chat de atención al cliente",
        text: "Intruduzca su correo",
        input: "text",
        confirmButtonText: "Ingresar",
    }).then((username) => {
        user = username.value
        nombreUsuario.innerHTML = user
        socketClient.emit("nuevoUsuario", user)
    })
}

socket.on('user_connected', data => {
    Swal.fire({
        text: `${data.user} se ha conectado!`,
        toast: true, 
        position: 'top-right'
    })
})

const form = document.getElementById('formulario')

form.onsubmit = (e) => {
    e.preventDefault()
    const info = {
        user: user, 
        message: inputmensaje.value
    }
    console.log(info)
    socketClient.emit("mensaje", info)
    inputmensaje.value = " "
}

const caja = document.getElementById('mensaje')
const contenido = document.getElementById('contenido')

caja.addEventListener('change', (e) => {
    socket.emit('mensaje', {
        correo: user,
        mensaje: e.target.value, 
    })
})

socket.on('new_message', (data) => {
    const mensajes = data.map(({ correo, mensaje }) => {
        return `<p>${correo} dijo: ${mensaje}</p>`
    })

    contenido.innerHTML = mensajes.join('')
})