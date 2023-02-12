import * as dotenv from "dotenv";
dotenv.config();
import passport from "passport";
import passportJWT from "passport-jwt";

import { db } from "./db";

const SECRET_KEY = process.env.SECRET;

passport.use(
  new passportJWT.Strategy(
    {
      secretOrKey: SECRET_KEY,
      jwtFromRequest: passportJWT.ExtractJwt.fromAuthHeaderAsBearerToken(),
    },
    async (payload, done) => {
      const user = await db.one(`SELECT * FROM users WHERE id=$1`, payload.id);
      // console.log(user);

      try {
        return user ? done(null, user) : done(new Error("User not found"));
      } catch (err) {
        done(err);
      }
    }
  )
);
