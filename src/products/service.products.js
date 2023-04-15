import { ProductDAO } from "../dao/factory.js";
const pm = ProductDAO;

export const getProducts = async (limit, page, query, sort) => {
    let filter = {};
    query? filter = { category: query } : filter = {};
    
    const sortLowercase = sort? sort.toLowerCase() : sort;

    const options = {
        limit, 
        page,
        sort: { price: sortLowercase }
    }

    try {
        const products = await pm.getProducts(filter, options);
        if(products.payload === []) return {status: 'failed', message: 'La base de datos no contiene productos'};

        return {message: 'Productos encontrados en la base de datos', payload: products};
    } catch (error) {
        throw error;
    }
};

export const getProductById = async (idRef) => {
    try {
        const productById = await pm.getProductById(idRef);
        if(Object.keys(productById).length === 0) return {status: 'failed', message: 'Producto no encontrado en la base de datos', payload: productById};
        return {message: 'Producto encontrado', payload: productById};
    } catch (error) {
        throw error;
    }
};

export const addProduct = async (productInfo) => {
    try {
        const { code } = productInfo;
        const productByCode = await pm.getProductByCode(code);
        if(Object.keys(productByCode).length !== 0) return {status: 'failed', message: 'El producto ya se encuentra ingresado en la base de datos'};

        const newProduct = await pm.addProduct(productInfo);
        return {message: 'El producto fue ingresado correctamente', payload: newProduct};
    } catch (error) {
        throw error;
    }
};

export const updateProduct = async (idRef, updates) => {
    try {
        const product = await pm.getProductById(idRef);
        if(Object.keys(product).length === 0) return {status: 'failed', message: 'Producto no encontrado en la base de datos'};

        Object.keys(updates).forEach(key => {
            if(updates[key] && updates[key] !== product[key]) product[key] = updates[key];
        })

        const updatedProduct = await pm.updateProduct(idRef, product);
        return {message: 'Producto actualizado', payload: updatedProduct};
    } catch (error) {
        throw error;
    }
};

export const deleteProduct = async (idRef) => {
    try {
        const response = await pm.deleteProduct(idRef);
        return response;
    } catch (error) {
        throw error;
    }
};

export const deleteAllProducts = async () => {
    try {
        const response = await pm.deleteAllProducts();
        return response;
    } catch (error) {
        throw error;
    }
};
