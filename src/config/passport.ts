import passport from "passport";
import { Strategy as GoogleStrategy, Profile } from "passport-google-oauth20";

const GOOGLE_CLIENT_ID =process.env.GOOGLE_CLIENT_ID
const GOOGLE_CLIENT_SECRET =process.env.GOOGLE_CLIENT_SECRET
const CALLBACK_URL = "http://localhost:3000/auth/google/callback"

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((obj: any, done) => {
  done(null, obj);
});

passport.use(
  new GoogleStrategy(
    {
      clientID: String( GOOGLE_CLIENT_ID) ,
      clientSecret: String(GOOGLE_CLIENT_SECRET),
      callbackURL: CALLBACK_URL,
    },
    async (_accessToken, _refreshToken, profile: Profile, done) => {
      try {
        // You can persist user here (e.g., MongoDB)
        const user = {
          id: profile.id,
          displayName: profile.displayName,
          emails: profile.emails,
          photos: profile.photos,
        };
        return done(null, user);
      } catch (err) {
        return done(err, undefined);
      }
    }
  )
);

export { passport };
