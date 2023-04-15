import mongoose from "mongoose";

const cartsCollection = 'carts';

const cartSchema = new mongoose.Schema({
    products: {
        type: [
            {
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "products"
                },
                quantity: Number
            }
        ],
        default: []
    }
});

cartSchema.pre('find', function () {
    this.populate('products.product');
});

const Cart = mongoose.model(cartsCollection, cartSchema);

export default Cart;