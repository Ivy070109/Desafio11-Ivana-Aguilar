export default class UserDTO {
    constructor(user) {
        this.first_name = user.first_name.trim(),
            this.last_name = user.last_name.trim(),
            this.email = user.email.toLowerCase().trim(),
            this.age = +user.age,
            this.password = user.password.trim(),
            this.cart = user.cart,
            this.role = user.role === "admin" || user.role === "user" ? user.role : "user"
    }
}

// prefiero exportarlo directamente porque los trim no funcionaban al hacerlos en el router o desde los controllers