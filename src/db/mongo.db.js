import mongoose from "mongoose";
import config from "../config/index.js";

const { userDB, passDB, hostDB } = config.db;
const url = `mongodb+srv://${userDB}:${passDB}@${hostDB}/?retryWrites=true&w=majority`;
const options = {useNewUrlParser: true, useUnifiedTopology: true};

class mongoConnection {
    static #instance;

    static getInstance() {
        if(this.#instance) {
            console.log('db is already connected');
            return this.#instance;
        }

        mongoose.connect(url, options)
            .then((connection) => {
                this.#instance = connection;
                console.log('db succesfully connected');
                return this.#instance;
            })
            .catch(error => {console.log('Failed to connect to DB.', error)});
    }
}

export default mongoConnection;