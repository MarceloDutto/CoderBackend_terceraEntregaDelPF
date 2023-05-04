import { existsSync, promises, writeFile } from 'fs';

class TicketManager {
    constructor(path) {
        this.tickets = [];
        this.path = path;
    };

    getTickets = async () => {
        try {
            if(!existsSync(this.path)) {
                this.tickets = [];
                return this.tickets;
            }
    
            const stats = await promises.stat(this.path);
            if(stats.size === 0) {
                this.tickets = [];
                return this.tickets;
            } 

            const data = await promises.readFile(this.path, 'utf-8');
            this.tickets = JSON.parse(data);
            return this.tickets;

        } catch (error) {
            req.logger.error(error);
            throw error;
        }
    };

    getTicketById = async (tidRef) => {
        try {
            await this.getTickets();
            const ticketById = this.tickets.find(ticket => ticket.id === tidRef);
            return ticketById? ticketById : {};
        } catch (error) {
            req.logger.error(error);
            throw error;
        }
    };

    createTicket = async (ticketInfo) => {
        try {
            await this.getTickets();

            let id;
            let uniqueId = false;
            while (uniqueId === false) {
                id = uuidv4();
                uniqueId = this.thickets.forEach(ticket => ticket.id === id) ? false : true;
            };

            const newTicket = {
                id,
                ...ticketInfo
            };

            this.tickets.push(newTicket);
            const ticketStr = JSON.stringify(this.tickets, null, 2);
            writeFile(this.path, ticketStr, error => {
                if(error) {
                    throw error;
                }
            }); 

            return newTicket
        } catch (error) {
            req.logger.error(error);
            throw error;
        }
    }
};

export default TicketManager;