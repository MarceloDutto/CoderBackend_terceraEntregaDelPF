import passport from "passport";
import GitHubStrategy from 'passport-github2';
import jwt from 'passport-jwt';
import { findUserByEmail, registerUser } from "../users/service.users.js";
import cookieExtractor from "../utils/cookieExtractor.utils.js";
import config from "./index.js";

const { clientID, clientSecret } = config.github;
const { jwt_secret } = config.jwt;

const JWTStrategy = jwt.Strategy;
const ExtractJWT = jwt.ExtractJwt;

const initializePassport = () => {

    passport.use('jwt', new JWTStrategy(
        {jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor]),
            secretOrKey: jwt_secret,
        }, async (jwt_payload, done) => {
            try {
                return done(null, jwt_payload);
            } catch(error) {
                return done(error);
            }
        }
    ));

};

export default initializePassport;
