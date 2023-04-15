import { existsSync, promises, writeFile } from 'fs';
import { v4 as uuidv4 } from 'uuid';

class ProductManager {
    constructor(path) {
        this.products = [];
        this.path = path;
    };

    getProducts = async (filter, options) => {
        if(!existsSync(this.path)) {
            this.products = [];
            return this.products;
        };
            
        try {
          const stats = await promises.stat(this.path);
          
          if(stats.size === 0) {
            this.products = [];
            return this.products;
        };

        const data = await promises.readFile(this.path, 'utf-8');
        const dataJSon = JSON.parse(data);

        let products = [];
        filter === null? products = dataJSon.filter(prod => prod.category === filter) : products = dataJSon;        
           
        const totalPages = Math.ceil(products.length / options.limit);
        const page = options.page;
        const offsetStart = (page - 1) * options.limit;
        const OffsetEnd = offsetStart + options.limit;
        this.products = products.slice(offsetStart, OffsetEnd);
        const prevPage = page - 1 < 1? null : page - 1;
        const nextPage = page + 1 > totalPages? null : page + 1;

        const response = {
            status: "success",
            payload: this.products,
            totalPages,
            prevPage,
            nextPage,
            page,
            hasPrevPage: !!prevPage,
            hasNextPage: !!nextPage,
            prevLink: `?limit=${options.limit}&page=${prevPage}`,
            nextLink: `?limit=${options.limit}&page=${nextPage}`
        }; 
        return response;
        } catch(error) {
          console.log(error);
          throw error;
        }
      };

    getProductById = async (idRef) => {
        if(!existsSync(this.path)) {
            this.products = [];
            return {};
        };

        try {
            const stats = await promises.stat(this.path);
            
            if(stats.size === 0) {
                this.products = [];
                return {};
            };

            const data = await promises.readFile(this.path, 'utf-8');
            this.products = JSON.parse(data);
            const prodById = this.products.find(prod => prod.id === idRef);
            return prodById ? prodById : {};
        } catch(error) {
            console.log(error);
            throw error;
        }
      
    };

    getProductByCode = async (codeRef) => {
        if(!existsSync(this.path)) {
            this.products = [];
            return {};
        };

        try {
            const stats = await promises.stat(this.path);
            
            if(stats.size === 0) {
                this.products = [];
                return {};
            };

            const data = await promises.readFile(this.path, 'utf-8');
            this.products = JSON.parse(data);
            const prodByCode = this.products.find(prod => prod.code === codeRef);
            return prodByCode ? prodByCode : {};
        } catch(error) {
            console.log(error);
            throw error;
        }
    };

    addProduct = async (productInfo) => {
        let id;
        let uniqueId = false;
        while (uniqueId === false) {
            id = uuidv4();
            uniqueId = this.products.forEach(prod => prod.id === id) ? false : true;
        };

        const productToAdd = {
            id,
            ...productInfo
        };

        this.products.push(productToAdd);
        const productsStr = JSON.stringify(this.products, null, 2);
        writeFile(this.path, productsStr, error => {
            if(error) {
                throw error;
            }
        }); 
        return productToAdd;
    };

    updateProduct = async (idRef, product) => {
        if(!existsSync(this.path)) {
            this.products = [];
            return {};
        };

        const indexById = this.products.findIndex(prod => prod.id === idRef);
        this.products[indexById] = product

        const productsStr = JSON.stringify(this.products, null, 2);
        writeFile(this.path, productsStr, error => {
            if(error) {
                throw error;
            }
        });
        return product;
    };

    deleteProduct = async (idRef) => {
        if(!existsSync(this.path)) {
            this.products = [];
            return 'No se encontró la base de datos';
        };

        const indexById = this.products.findIndex(prod => prod.id === idRef);
        if(indexById === -1 ) return 'Producto no encontrado en la base de datos';
        this.products.splice(indexById, 1);

        const productsStr = JSON.stringify(this.products, null, 2);
        writeFile(this.path, productsStr, error => {
            if(error) {
                throw error
            };
        });
        return 'Producto eliminado de la base de datos';
    };

    deleteAllProducts = async () => {
        if(!existsSync(this.path)) {
            this.products = [];
            return 'No se encontró la base de datos';
        };

        this.products = [];
        const productsStr = JSON.stringify(this.products, null, 2);
        writeFile(this.path, productsStr, error => {
            if(error) {
                throw error
            }
        });
        return 'Todos los productos fueron eliminados';
    };
};

export default ProductManager;