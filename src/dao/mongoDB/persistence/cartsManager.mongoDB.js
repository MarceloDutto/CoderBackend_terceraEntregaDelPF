import Cart from "../models/cart.models.js";

class CartManager {

    getCarts = async () => {
        try {
            const data = await Cart.find();
            return data
        } catch (error) {
            req.logger.error(error);
            throw error;
        }
    };

    getCartById = async (idRef) => {
        try {
            const data = await Cart.findOne({_id: idRef});
            return data? data : {};
        } catch (error) {
            req.logger.error(error);
            throw error;
        }
    };

    addCart = async () => {
        try {
            const newCart = await Cart.create({products: []});
            return newCart;
        } catch (error) {
            req.logger.error(error);
            throw error;
        }
    };

    getProductIndex = async (pid, cart) => {
        try {
            const index = await cart.products.findIndex(prod => prod.product.equals(pid));
            return index;
        } catch(error) {
            req.logger.error(error);
            throw error;
        }
    };

    updateCart = async (cidRef, update) => {
        try {
            await Cart.updateOne({_id: cidRef}, update);
        } catch (error) {
            req.logger.error(error);
            throw error;
        }
    };
};

export default CartManager;