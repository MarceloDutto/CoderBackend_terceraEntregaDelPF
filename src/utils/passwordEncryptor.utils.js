import bcrypt from 'bcrypt';

const createHash = (password) => {
    const salt = bcrypt.genSaltSync(10);
    const encryptedPassword = bcrypt.hashSync(password, salt);

    return encryptedPassword;
};

const isValidPassword = (user, password) => {
    const response = bcrypt.compareSync(password, user.password);

    return response
};

export {createHash, isValidPassword};