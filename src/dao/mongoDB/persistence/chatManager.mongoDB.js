import Message from "../models/chat.models.js";

class ChatManager {

    getMessages = async () => {
        try {
            const data = await Message.find();
            return data;
        } catch(error) {
            console.log(error);
            throw error;
        }
    };

    createMessage = async (message) => {
        try {
            const data = await Message.create(message);
            return data;
        } catch(error) {
            console.log(error);
            throw error;
        }
    };

    deleteMessages = async () => {
        try {
            await Message.deleteMany();
        } catch(error) {
            console.log(error);
            throw error;
        }
    }

};

export default ChatManager;