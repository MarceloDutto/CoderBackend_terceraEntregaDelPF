import Ticket from "../models/ticket.models.js";

class TicketManager {

    getTickets = async () => {
        try {
            const tickets = await Ticket.find();
            return tickets;
        } catch(error) {
            console.log(error);
            throw error;
        }
    };

    getTicketById = async (tidRef) => {
        try {
            const ticket = await Ticket.findById(tidRef);
            return ticket? ticket : {};
        } catch(error) {
            console,log(error);
            throw error;
        }
    }

    createTicket = async (ticketInfo) => {
        try {
            const newTicket = await Ticket.create(ticketInfo);
            return newTicket;
        } catch(error) {
            console.log(error);
            throw error;
        }
    };
};

export default TicketManager;