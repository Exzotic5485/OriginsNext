const express = require('express')
const session = require('express-session')
const MongoDBStore = require('connect-mongodb-session')(session);
const bodyParser = require('body-parser')
const next = require('next')
const passport = require('passport')
const mongoose = require('mongoose');
require('dotenv').config()

const nextApp = next({ dev: process.env.DEV == 'true', dir: 'next' })
const nextHandler = nextApp.getRequestHandler();

const server = express();

require('./passport')

server.use(bodyParser.json())
server.use(bodyParser.urlencoded({extended: true}))
server.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: new MongoDBStore({
        uri: process.env.MONGODB_URI,
        collection: 'Sessions'
    }),
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7 // 1 week
    }
}))
server.use(passport.initialize())
server.use(passport.session())

server.use(express.static('public'))
server.use('/', require('./routes/index')({ nextApp, nextHandler, server }))

nextApp.prepare().then(() => {
    mongoose.connect(process.env.MONGODB_URI).then(() => {
        server.listen(process.env.PORT, () => {
            console.log(`Listening on http://localhost`)
        })

        require('./utils/cron')();
    })
})