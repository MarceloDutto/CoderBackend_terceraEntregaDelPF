import { Router } from "express";
import passport from "passport";
import { userAuthentication } from "./service.auth.js";
import config from "../config/index.js";

const router = Router();
const { admin_email } = config.admin;

router.post('/', async (req, res) => {
    const { email, password } = req.body

    try {
        const response = await userAuthentication(email, password);
        if(response.status === 'failed') return res.status(400).json({status: response.status, message: response.message});
        res.cookie('authToken', response.payload, {maxAge: 900000, httpOnly: true}).json({status: response.status, message: response.message});
    } catch(error) {
        console.log(error);
        res.status(500).json({status: 'error', error: 'No se pudo autenticar el usuario'});
    }
});

router.get('/github', passport.authenticate('github', {scope:['user:email']}), async (req, res) => {});

router.get('/githubCallback', passport.authenticate('github', {failureRedirect: '/login'}), async (req, res) => {
    
    const user = req.user;
    console.log(user)
    //SE PUEDE MANDAR AL SERVICE DESDE

    let role = 'user';
    if(email === admin_email) role ='admin';
    const data = {
        first_name: user.first_name,
        last_name: user.last_name,
        email,
        role: role
    };

    let token = generateToken(data);
    //SE PUEDE MANDAR AL SERVICE HASTA
    res.json({status: 'success', message: 'Usuario autenticado', payload: token});

    /* res.redirect('/products'); */
});

export default router;