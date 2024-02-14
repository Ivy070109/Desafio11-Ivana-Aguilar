import { TicketService } from "../services/ticket.mongo.dao.js"

const ticketService = new TicketService()

class TicketManager {
    constructor() {
    }

    createTicket = async (totalAmount, purchaser) => {
        try {
            return await ticketService.create(totalAmount, purchaser)
        } catch (err) {
            return err.message
        }
    }
}

export default TicketManager