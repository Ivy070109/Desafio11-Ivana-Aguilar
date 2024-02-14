//función de prueba de child process, son procesos paralelos que se ejecutan en el mismo momento que se ejecutan los procesos padres 
process.on('message', message => {
    let result = 0
    for (let i = 0; i < 5e9; i++) {
        result += i
    }

    process.send(result)
})