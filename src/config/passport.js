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
    passport.use('github', new GitHubStrategy(
        {
            clientID: clientID,
            clientSecret: clientSecret,
            callbackURL: 'http://localhost:3000/api/auth/githubCallback' //VER
        }, async (accesToken, refreshToken, profile, done) => {
            try{
                const user = findUserByEmail(profile._json.email);
                if(Object.keys(user).length !== 0) return done(null, user);

                const newUserInfo = {
                    first_name: profile._json.name,
                    last_name: '',
                    age: 18,
                    email: profile._json.email,
                    password: ''
                };

                const newUser = await registerUser(newUserInfo);
                return done(null, newUser)
            } catch(error) {
                return done(error);
            }
        }
    ));

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
