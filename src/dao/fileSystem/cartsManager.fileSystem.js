import { existsSync, writeFile, promises } from 'fs';
import { v4 as uuidv4 } from 'uuid';
import __dirname from '../../utils.js';

class CartManager {
    constructor(path) {
        this.carts = [];
        this.path = path;
    };

    getCarts = async () => {
        if(!existsSync(this.path)) {
            this.carts = []
            return this.carts;
        }

        try {
            const stats = await promises.stat(this.path);
          
          if(stats.size === 0) {
            this.carts = [];
            return this.carts;
        };

            const data = await promises.readFile(this.path, 'utf-8');
            this.carts = JSON.parse(data);
            return this.carts;
        } catch (error) {
            console.log(error);
            throw error;
        }
    };

    getCartById = async (cidRef) => {
        if(!existsSync(this.path)) {
            this.carts = []
            return {};
        }

        try {
        await this.getCarts();

            const cartById = this.carts.find(cart => cart.id === cidRef);
            return cartById ? cartById : {};
        } catch (error) {
            console.log(error);
            throw error;
        }
    };

    addCart = async () => {
        try {
            existsSync(this.path) ? await this.getCarts() : this.carts = [];
    
            let id;
            let uniqueId = false;
            while (uniqueId === false) {
                id = uuidv4();
                uniqueId = this.carts.forEach(cart => cart.id === id) ? false : true;
            };
    
            const newCart = {
                id,
                products: []
            };
    
            this.carts.push(newCart);
    
            const cartStr = JSON.stringify(this.carts, null, 2);
            writeFile(this.path, cartStr, error => {
                if(error) {
                    throw error;
                }
            });
            return newCart;
        } catch(error) {
            console.log(error);
            throw error;
        }
    };

    getProductIndex = async (pid, cart) => {
        try {
            const index = await cart.products.findIndex(prod => prod.product === pid);
            return index;
        } catch(error) {
            console.log(error);
            throw error;
        }
    };

    updateCart = async (cidRef, update) => {
        if(!existsSync(this.path)) {
            this.carts = []
            return {};
        }

        const cart = await this.getCartById(cidRef);
        if(Object.keys(cart).length === 0) return {};

        Object.keys(cart).forEach(key => {
            if(cart[key] && cart[key] !== update[key]) cart[key] = update[key];
        });

        const cartStr = JSON.stringify(this.carts, null, 2);
        writeFile(this.path, cartStr, error => {
            if(error) {
                throw error;
            }
        });
    };
};

export default CartManager;