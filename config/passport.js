
const bcrypt = require('bcryptjs')
const pool = require('./database.js')
const LocalStrategy = require('passport-local').Strategy


function initialize(passport) {

  const authenticateUser = (userName, password, done) => {
    console.log("authenticateUser");

    pool.query(
      `SELECT * FROM users WHERE user_name = ($1)`,
      [userName],
      (err, results) => {
        if (err) {
          throw err;
        }
        if (results.rows.length > 0) {
          const user = results.rows[0];

          bcrypt.compare(password, user.pwd, (err, isMatch) => {
            if (err) {
              console.log(err);
            }
            if (isMatch) {
              console.log("match");
              return done(null, user);

            } else {
              //password is incorrect
              return done(null, false, { message: "User name or password is incorrect" } );
            }
          })
        } else {
          // No user
          return done(null, false, { message: "User name or password is incorrect"});
        }
      }
    );
  };

  passport.use('login',
    new LocalStrategy(
      { usernameField: "userName", passwordField: "password" },
      authenticateUser
    )
  );
  // Stores user details inside session. serializeUser determines which data of the user
  // object should be stored in the session. The result of the serializeUser method is attached
  // to the session as req.session.passport.user = {}. Here for instance, it would be (as we provide
  //   the user id as the key) req.session.passport.user = {id: 'xyz'}

  passport.serializeUser((user, done) => { console.log('ser ', user); done(null, user.user_id) });

  // In deserializeUser that key is matched with the in memory array / database or any data resource.
  // The fetched object is attached to the request object as req.user

  passport.deserializeUser((user, done) => {
    console.log("local")
    pool.query(`SELECT * FROM users WHERE user_id = $1`, [user], (err, results) => {
      if (err) {
        return done(err);
      }
      // console.log(`ID is ${results.rows[0]}`);
      return done(null, results.rows[0]);
    });
  });
}

module.exports = initialize;

