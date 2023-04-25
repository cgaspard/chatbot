const GoogleStrategy = require('passport-google-oauth20').Strategy;
const passport = require('passport');
const User = require('./models/User');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '.env.local') });

const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, JWT_SECRET } = process.env;

passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: '/auth/google/callback',
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const existingUser = await User.findOne({ googleId: profile.id });

        if (existingUser) {
          done(null, existingUser);
        } else {
          const user = await new User({ googleId: profile.id }).save();
          done(null, user);
        }
      } catch (err) {
        done(err, null);
      }
    },
  ),
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id);
  done(null, user);
});

const generateToken = (user) => {
  return jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1h' });
};

module.exports = {
  passport,
  generateToken,
};
