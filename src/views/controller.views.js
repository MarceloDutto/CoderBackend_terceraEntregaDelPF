import { Router } from "express";
import { getProducts, getProductById } from "../products/service.products.js";
import { getCartById } from "../carts/service.carts.js";
import handlePolicies from "../middlewares/handlePolicies.js";

const router = Router();

router.get('/', handlePolicies('PUBLIC'), (req, res) => {
    res.redirect('/products');
});

router.get('/signup', handlePolicies('PUBLIC'), (req, res) => {
    res.render('signup', {
        title: 'Registrate',
        style: 'signup.css'
    })
});

router.get('/login', handlePolicies('PUBLIC'), (req, res) => {
    res.render('login', {
        title: 'Iniciar sesión',
        style: 'login.css'
    })
});

router.get('/profile', handlePolicies(['USER', 'ADMIN']), (req, res) => {
    const user = req.user.user;

    res.render('profile', {
        title: 'Perfil',
        style: 'profile.css',
        user
    })
});

router.get('/products', handlePolicies(['USER', 'ADMIN']), async (req, res) => {
    const limit = req.query.limit || 5;
    const page = req.query.page || 1;
    const query = req.query.query || null;
    const sort = req.query.sort || null;
    let products = [];
    let showProducts = false;
    const user = req.user.user;
    
    try {
        const data = await getProducts(limit, page, query, sort);
        products = data.payload.payload
        
        products.length > 0 ? showProducts = true : showProducts = false;

        res.render('products', {
            title: 'Productos',
            style: 'products.css',
            user,
            showProducts,
            products: products.map(prod => prod.toJSON()),
            prevPageLink: data.payload.hasPrevPage? data.payload.prevLink : "",
            nextPageLink: data.payload.hasNextPage? data.payload.nextLink : ""
        });
    } catch(error) {
        console.log(error);
        res.render('products', {
            title: 'Productos',
            style: 'products.css',
            showProducts
        });
    }
});

router.get('/products/details/:pid', handlePolicies(['USER', 'ADMIN']), async (req, res) => {
    const { pid } = req.params;
    let showProduct = false;
    let product = {}

    try {
        product = await getProductById(pid);
        product.payload === {} ? showProduct = false : showProduct = true
        const { thumbnail, name, description, category, price, stock } = product.payload;

        res.render('details', {
            title: 'Detalles del producto',
            showProduct,
            thumbnail,
            name,
            description,
            category,
            price,
            stock,
            style: 'details.css'
        })

    } catch (error) {
        console.log(error);
        res.status(500).render('details.handlebars', {
            showProduct,
            style: 'details.css'
        })
    }
});

router.get('/cart/:cid', handlePolicies(['USER', 'ADMIN']), async (req, res) => {
    const { cid } = req.params;
    let showProducts = false;

    try {
        const cart = await getCartById(cid);
        const products = cart.payload.products
        console.log(products)
        products.length > 0 ? showProducts = true : showProducts = false;

        res.render('cart', {
            title: 'Mi carrito',
            style: 'cart.css',
            showProducts,
            products: products.map(prod => prod.toJSON())
        });
    } catch(error) {
        console.log(error);
        res.render('cart', {
            showProducts,
            style: 'cart.css'
        });
    }

});

export default router;