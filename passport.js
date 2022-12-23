const localStrategy = require('passport-local').Strategy;
const passport = require('passport')
const bycrypt = require('bcrypt')

const users = require('./models/Users')

async function verify(username, password, done) {
    const user = await users.findOne({$or: [
        { email: username },
        { username: username }
    ]})

    if(!user) {
        return done(null, false)
    }

    const passwordMatches = await bycrypt.compare(password, user.password)

    return done(null, passwordMatches ? user : false);
}

passport.use(new localStrategy({}, verify))
passport.serializeUser((user, done) => done(null, user.id))
passport.deserializeUser(async (id, done) => {
    try {
        const user = await users.findById(id)

        if(!user) throw new Error("No user found.")

        done(null, user)
    } catch (e) {
        done(e, null)
    }
})