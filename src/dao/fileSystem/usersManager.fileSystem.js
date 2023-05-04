import { existsSync, promises, writeFile } from 'fs';
import { v4 as uuidv4 } from 'uuid';

class UserManager {
    constructor(path) {
        this.users = [];
        this.path = path;
    }

    getUsers = async () => {
        if(!existsSync(this.path)) {
            this.users = [];
            return this.users;
        }
        try {
            const stats = await promises.stat(this.path);
    
            if(stats.size === 0) {
                this.users = [];
                return this.users;
            }
    
            const data = await promises.readFile(this.path, 'utf-8');
            this.users = JSON.parse(data); 
            return this.users;
        } catch(error) {
            req.logger.error(error);
            throw error;
        }
    };

    registerUser = async (newUserInfo) => {
        try  {
            await this.getUsers();
            
            let id;
            let uniqueId = false;
            while (uniqueId === false) {
                id = uuidv4();
                uniqueId = this.users.forEach(user => user.id === id) ? false : true;
            };

            const newUser = {
                id,
                ...newUserInfo
            };
            
            this.users.push(newUser);
            const userStr = JSON.stringify(this.users, null, 2);
            writeFile(this.path, userStr, error => {
                if(error) {
                    throw error;
                }
            })
            return newUser;
        } catch(error) {
            req.logger.error(error);
            throw error;
        }
    };

    findUserByEmail = async (emailRef) => {
        try {
            await this.getUsers();

            const user = this.users.find(user => user.email === emailRef);
            return user? user : {};
        }catch(error) {
            req.logger.error(error);
            throw error;
        }
    };

    findUserById = async (idRef) => {
        try {
            await this.getUsers();

            const user = this.users.find(user => user.id === idRef);
            return user? user : {};
        } catch(error) {
            req.logger.error(error);
            throw error;
        }
    }
};

export default UserManager;