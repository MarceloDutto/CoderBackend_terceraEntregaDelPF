import * as dotenv from 'dotenv';
dotenv.config()

const config = {
    app: {
        port: process.env.PORT || 3000,
        persistence: process.env.PERSISTENCE 
    },
    db: {
        userDB: process.env.USER_DB,
        passDB: process.env.PASS_DB,
        hostDB: process.env.HOST_DB
    },
    session: {
        sessionSecret: process.env.SESSION_SECRET
    },
    admin: {
        admin_email: process.env.ADMIN_EMAIL,
        admin_password: process.env.ADMIN_PASSWORD
    }
}

export default config;