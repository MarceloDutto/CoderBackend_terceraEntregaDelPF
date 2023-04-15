import Product from "../models/product.models.js";

class ProductManager {

    getProducts = async (filter, options) => {
        try {
            const data = await Product.paginate(filter, options);

            const response = {
                status: "success",
                payload: data.docs,
                totalPages: data.totalPages,
                prevPage: data.prevPage,
                nextPage: data.nextPage,
                page: data.page,
                hasPrevPage: data.hasPrevPage,
                hasNextPage: data.hasNextPage,
                prevLink: `?limit=${options.limit}&page=${data.prevPage}`,
                nextLink: `?limit=${options.limit}&page=${data.nextPage}`
            } 
            return response;
        } catch(error) {
            console.log(error);
            throw error;
        }
    };

    getProductById = async (idRef) => {
        try {
            const data = await Product.findById(idRef);
            return data? data : {}
        } catch (error) {
            console.log(error);
            throw error;
        }
    };

    getProductByCode = async (codeRef) => {
        try {
            const data = await Product.find({code: codeRef});
            return data? data : {};
        } catch (error) {
            console.log(error);
            throw error;
        }
    };

    addProduct = async (productInfo) => {
        try {
            const newProduct = await Product.create(productInfo);
            return newProduct;
        } catch (error) {
            console.log(error);
            throw error;
        }
    };

    updateProduct = async (idRef, product) => {
        try {
            await Product.findByIdAndUpdate(idRef, product);
            return product;
        } catch (error) {
            console.log(error);
            throw error;
        }
    };

    deleteProduct = async (idRef) => {
        try {
            await Product.findByIdAndDelete(idRef);
            return 'Producto eliminado de la base de datos';
        } catch (error) {
            console.log(error);
            throw error;
        }
    };

    deleteAllProducts = async () => {
        try {
            await Product.deleteMany();
            return 'Todos los productos fueron eliminados';
        } catch (error) {
            console.log(error);
            throw error;
        }
    };
};

export default ProductManager;