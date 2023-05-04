import User from "../models/user.models.js";

class UserManager {

    registerUser = async (newUserInfo) => {
        try {
            const newUser = await User.create(newUserInfo);
            return newUser;
        } catch (error) {
            req.logger.error(error);
            throw error;
        }
    };

    findUserByEmail = async (emailRef) => {
        try {
            const user = await User.findOne({email: emailRef});
            return user? user : {}
        } catch(error) {
            req.logger.error(error);
            throw error;
        }
    };

    findUserById = async (idRef) => {
        try {
            const user = await User.findById(idRef);
            return user? user : {};
        } catch(error) {
            req.logger.error(error);
            throw error;
        }
    }
};

export default UserManager;