import { Router } from "express";
import { registerUser } from "./service.users.js";
import CustomError from "../errors/CustomError.js";
import EErrors from "../errors/enum.errors.js";
import generateUserErrorInfo from "../errors/info.errors.js";

const router = Router();

router.post('/', async (req, res) => {
    const { first_name, last_name, age, email, password } = req.body;
    if(!first_name || !last_name || !age || !email || !password) {
        CustomError.createError({
            name: 'User creation error',
            cause: generateUserErrorInfo({first_name, last_name, age, email}),
            message: 'Error trying to create user',
            code: EErrors.INVALID_TYPES_ERROR,
        });
    };
    
    const newUserInfo = {
        first_name,
        last_name,
        age,
        email,
        password
    };
    try {
        const response = await registerUser(newUserInfo);
        if(response.status === 'failed') return res.status(400).json({status: response.status, message: response.message, payload: {}});
        res.status(201).json({status: 'success', message: response.message, payload: response.payload});
    } catch(error) {
        console.log(error);
        if(error.code === 11000) return res.status(400).json({status: 'error', error: 'Ya existe un usuario con ese correo electrónico'});
        return res.status(500).json({status: 'error', error: error.message });
    }
});

export default router;