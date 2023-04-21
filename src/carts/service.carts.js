import { createTicket } from "../tickets/service.tickets.js";
import { CartDAO, ProductDAO } from "../dao/factory.js";
const cm = CartDAO;
const pm = ProductDAO;


export const getCarts = async () => {
    try {
        const carts = await cm.getCarts();
        if(carts === []) return {message: 'La base de datos no contiene carritos'};
        return {message: 'Carritos encontrados en la base de datos', payload: carts};
    } catch (error) {
        throw error;
    }
};

export const getCartById = async (cidRef) => {
    try {
        const cartById = await cm.getCartById(cidRef);
        if(Object.keys(cartById).length === 0) return {message: 'Carrito no encontrado en la base de datos'};
        return {message: 'Carrito encontrado', payload: cartById};
    } catch (error) {
        throw error;
    }
};

export const addCart = async () => {
    try {
        const newCart = await cm.addCart();
        return {message: 'Carrito creado', payload: newCart};
    } catch (error) {
        throw error;
    }
};

export const addProductToCart = async (cidRef, pidRef) => {
    try {
        const cart = await cm.getCartById(cidRef);
        if(Object.keys(cart).length === 0 ) return {status: 'failed', message: 'No se encontró el carrito'};

        const product = await pm.getProductById(pidRef);
        if(Object.keys(product).length === 0) return {status: 'failed', message: 'Producto no encontrado en la base de datos'};
        
        const prodIndex = await cm.getProductIndex(pidRef, cart);
        
        if(prodIndex !== -1) {
            cart.products[prodIndex].quantity ++;
            await cm.updateCart(cidRef, cart);
            return {message: 'Producto actualizado con éxito'};
        } else {
            cart.products.push({product: pidRef, quantity: 1});
            await cm.updateCart(cidRef, cart);
            return {message: 'Producto agregado al carrito'};
        }
    } catch (error) {
        throw error;
    }
};

export const updateProductsfromCart = async (cidRef, products) => {
    try {
        const cart = await cm.getCartById(cidRef);
        if(Object.keys(cart).length === 0 ) return {status: 'failed', message: 'No se encontró el carrito'};

        let updateIsValid = true;

        products.forEach(async prod => {
            let id = prod.product.id;

            try {
                const response = pm.getProductById(id);
                if(Object.keys(response).length !== 0) updateIsValid = false;
            } catch (error) {
                console.log(error);
                throw error;
            }
        });

        if(updateIsValid) {
            cart.products = products;
            await cm.updateCart(cidRef, cart);
            return {message: 'Productos del carrito actualizados'};
        } else {
            return {status: 'failed', message: 'Error al ingresar los productos'};
        }
    } catch (error) {
        throw error;
    }
};

export const updateQuantity = async (cidRef, pidRef, quantity) => {
    try {
        const cart = await cm.getCartById(cidRef);
        if(Object.keys(cart).length === 0 ) return {status: 'failed', message: 'No se encontró el carrito'};

        if(cart.products.length === 0) return {status: 'failed', message: 'El carrito no tiene productos'};

        const prodIndex = await cm.getProductIndex(pidRef, cart);
        if(prodIndex === -1) return {status: 'failed', message: 'El producto no se encontró en el carrito'};

        cart.products[prodIndex].quantity = quantity
        await cm.updateCart(cidRef, cart);
        return {status: 'success', message: 'Producto actualizado'};
    } catch (error) {
        throw error;
    }
};

export const deleteProductfromCart = async (cidRef, pidRef) => {
    try {
        const cart = await cm.getCartById(cidRef);
        if(Object.keys(cart).length === 0 ) return {status: 'failed', message: 'No se encontró el carrito'};

        if(cart.products.length === 0) return {status: 'failed', message: 'El carrito no tiene productos'};

        const prodIndex = await cm.getProductIndex(pidRef, cart);
        if(prodIndex === -1) return {status: 'failed', message: 'El producto no se encontró en el carrito'};

        cart.products.splice(prodIndex, 1);
        await cm.updateCart(cidRef, cart);
        return {status: 'success', message: 'Producto eliminado del carrito'};
    } catch (error) {
        throw error;
    }
};

export const deleteProductsfromCart = async (cidRef) => {
    try {
        const cart = await cm.getCartById(cidRef);
        if(Object.keys(cart).length === 0 ) return {status: 'failed', message: 'No se encontró el carrito'};

        if(cart.products.length === 0) return {status: 'failed', message: 'El carrito no tiene productos'};

        cart.products = [];
        await cm.updateCart(cidRef, cart);
        return {status: 'success', message: 'Productos eliminados del carrito'};
    } catch(error) {
        throw error;
    }
};

export const purchase = async (cidRef, user) => {
    try {
        const cart = await cm.getCartById(cidRef);
        if(Object.keys(cart).length === 0 ) return {status: 'failed', message: 'No se encontró el carrito'};
        const products = cart.products;
        if(products.length === 0) return {status: 'failed', message: 'El carrito no tiene productos'};

        let purchasedProducts = [];
        let rejectedProducts = [];

        for (const prod of products) {
            let id = prod.product.id
            let price = prod.product.price;
            let quantity = prod.quantity;

            let product = await pm.getProductById(id);
          
            if (quantity <= product.stock) {
              try {
                await pm.updateProduct(id, {stock: product.stock - quantity});
                const subtotal = price * quantity;
                const item = {
                    product: product.id,
                    subtotal
                };
                purchasedProducts.push(item);
                const prodIndex = await cm.getProductIndex(id, cart);
                cart.products.splice(prodIndex, 1);
            } catch (error) {
                console.log(error);
                throw error;
            }
        } else {
            rejectedProducts.push(product.id);
        };
    }; 
    
    await cm.updateCart(cidRef, cart);
    if(purchasedProducts.length === 0) return {status: 'failed', message: 'La compra no pudo realizarse. Revise el stock antes de comprar.', payload: rejectedProducts};

    const amount = purchasedProducts.reduce((accumulator, currentValue) => {
        return accumulator + currentValue.subtotal;
    }, 0);

    const ticketInfo = {
         amount,
        purchaser: user.fullname
    };

    const purchaseTicket = await createTicket(ticketInfo);
    if(rejectedProducts.length > 0) return {message: 'Algunos productos de tu carrito no tienen stock. La compra fue realizada exitosamente con los productos disponibles', payload: purchaseTicket};

    return {message: 'Compra realizada exitosamente', payload: purchaseTicket};
    } catch(error) {
        throw error;
    }
};