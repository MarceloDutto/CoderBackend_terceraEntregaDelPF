import productsController from "../products/controller.products.js";
import cartsController from "../carts/controller.carts.js";
import usersController from "../users/controller.users.js";
import authController from "../auth/controller.auth.js";
import viewsController from "../views/controller.views.js";
import mockingController from "../mocking/controller.mocking.js";
import loggerController from "../winston/controller.winston.js";

const router = (app) => {
    app.use('/api/products', productsController);
    app.use('/api/carts', cartsController);
    app.use('/api/users', usersController);
    app.use('/api/auth', authController);
    app.use('/', viewsController);
    app.use('/mockingproducts', mockingController);
    app.use('/loggerTest', loggerController)
}

export default router;