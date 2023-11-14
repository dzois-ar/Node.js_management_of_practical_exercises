
const express = require('express')
const router = express.Router()
const passport = require('passport')
const pool = require('../config/database.js')
const sqlMod = require('../modules/sqlModule.js')
var path = require('path')
const ui = require('../modules/uiModule.js')


// const { flashMesssage } = require('../modules/uiModule.js')



router.get('/login', checkAuthenticated, (req, res) => {
  const errors = req?.query?.errors === undefined ? undefined : JSON.parse(req.query.errors)
  const errorsFlash = req.flash('error')
  const incorrectInputMessage = errorsFlash.length === 0 ? '' : errorsFlash[0] 
  res.render('pages/login.ejs', {
    title: 'Login',
    errors : errors,
    incorrectInputMessage: incorrectInputMessage,
    loggedin: 0,
    role: 'none'
  });
});


router.get("/logout", function (req, res, next) {
  console.log('logout')
  req.logout(function (err) {
    if (err) {
      return next(err);
    }

  });
  console.log('logout done')
  res.redirect("/login");
});

router.get('/GetPdf', async function (req, res) {
  console.log('GetPdf')
  if (!req.isAuthenticated()) {
      ui.sendToRestrictedPage(req, res)
      return
  } else {
      if (req.query.path === undefined) {
          res.send('need path')
      }
      res.sendFile(path.join(__dirname, req.query.path))
  }
})


router.get('/', async function (req, res) {
  if (req.isAuthenticated()) {
    const role = await sqlMod.getRole(req.user.user_id)
    if (role === 'student')
      res.redirect('/student/StudentProfile')
    else
      res.redirect('/supervisor/Applications')
    return
  }
  res.render(`pages/main`, {
    title: 'Home',
    role: 'none',
    loggedin: 0,
    isMainPage: 1
  })
})

router.get('/help', async function (req, res) {
  const questions = await pool.query('select question, answer from questions').then(result => result.rows)
  const loggedin = req.isAuthenticated()
  res.render(`pages/help`, {
    title: 'Help',
    questions: questions,
    role: loggedin? await sqlMod.getRole(req.user.user_id): 'none',
    loggedin: loggedin,
    isMainPage: 0
  })
})

router.post('/login', (req, res, next) => {
  let errors = {}
  if (req.body.userName === '')
    errors['userName'] = 'Please give a user name'
  if (req.body.password === '')
    errors['password'] = 'Please give a password'
  if (Object.keys(errors).length === 0) {
    next()
  }
  else {
    res.status = 400
    res.redirect(`/login?errors=${JSON.stringify(errors)}`)
  }
},
  passport.authenticate('login', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
  }));

function checkAuthenticated(req, res, next) {

  if (req.isAuthenticated()) {
    return res.redirect("/");
  }
  next();
}

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {

    return next();
  }
  res.redirect("pages/login.ejs");
}

module.exports = router;
