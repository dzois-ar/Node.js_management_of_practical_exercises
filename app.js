const express = require('express')
require('dotenv').config()

const startingServer = new Date().toLocaleString();
const app = express()


app.use('/images', express.static('images'))
app.use('/static', express.static('static'))
app.use('/views', express.static('views'))
app.set('view engine', 'ejs')
app.use(express.json())

const session = require('express-session')
const passport = require('passport')
const flash = require('connect-flash')
const bodyParser = require('body-parser')


app.use('/public', express.static('public'))

app.use(bodyParser.json({ limit: '50mb' }))

app.use(bodyParser.urlencoded({
    extended: true
}))

app.use(flash())
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())



// app.use(function (req, res, next) {
//     res.locals.message = req.flash('message');
//     next();
// });

require('./config/passport')(passport)

//index
const mainRoutes = require('./routes/mainRoute')
app.use('/', mainRoutes)

const studentRoute = require('./routes/studentRoute')
app.use('/student', studentRoute)

const supervisorRoute = require('./routes/supervisorRoute')
app.use('/supervisor', supervisorRoute)

const notFound = function (req, res) {
    let loggedin = 0
    res.render(`pages/notFound`, {
        title: '404 Page not Found',
        message: undefined,
        role: 0,
        loggedin: loggedin,
        isMainPage: 1
    })
}

app.use(notFound)

app.listen(process.env.APP_PORT || 8080, function () {
    console.log(`Server Starts at ${startingServer} and  Listening on port ${process.env.APP_PORT || 8080}!`)
})
