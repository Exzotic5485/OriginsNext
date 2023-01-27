const localStrategy = require('passport-local').Strategy;
const discordStrategy = require('passport-discord').Strategy;
const passport = require('passport')
const bycrypt = require('bcrypt')
const fs = require('fs')
const axios = require('axios')

const users = require('./models/Users')

async function createUniqueUsername(username) {
    const usernameTaken = await users.exists({ username: username })

    if(!usernameTaken) return username;

    const random = Math.floor(Math.random() * 1000)

    return await createUniqueUsername(`${username}${random}`)
}

async function verifyLocal(username, password, done) {
    const user = await users.findOne({$or: [
        { email: username },
        { username: username }
    ]})

    if(!user) {
        return done(null, false)
    }

    if(!user.password) return done(null, false)

    const passwordMatches = await bycrypt.compare(password, user.password)

    return done(null, passwordMatches ? user : false);
}

async function verifyDiscord(accessToken, refreshToken, profile, done) {
    
    const discordUser = await users.findOne({ discordId: profile.id })

    if(discordUser) {
        return done(null, discordUser)
    }

    const emailUsed = await users.exists({ email: profile.email });

    if(emailUsed) {
        return done(null, false)
    }

    const username = await createUniqueUsername(profile.username.replace(/[^a-zA-Z0-9-_]/g, ''))

    const newUser = await users.create({
        discordId: profile.id,
        email: profile?.email,
        username
    })

    try {
        const avatar = await axios.get(`https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.png`, {
            responseType: 'arraybuffer'
        })
    
        fs.writeFileSync(`./public/uploads/user/${newUser._id}.png`, avatar.data)

        newUser.image = `${newUser._id}.png`
        await newUser.save()
    } catch (e) {

    }

    done(null, newUser)
}


passport.use(new localStrategy({}, verifyLocal))
passport.use(new discordStrategy({
    clientID: "1062409602685227068",
    clientSecret: "VNJRjqeMkiORyYjLRwHQA1t5CPYqNaBi",
    callbackURL: "http://localhost/auth/discord/callback",
    scope: ['identify', 'email']
}, verifyDiscord))

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