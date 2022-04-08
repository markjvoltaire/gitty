const { Router } = require('express');
const { exchangeCodeForToken, getGithubProfile } = require('../utils/github');
const Users = require('../models/Users');
const jwt = require('jsonwebtoken');

const ONE_DAY_IN_MS = 1000 * 60 * 60 * 24;

module.exports = Router()
  .get('/login', (req, res) => {
    // TODO: Kick-off the github oauth flow
    res.redirect(
      `https://github.com/login/oauth/authorize?client_id=${process.env.CLIENT_ID}&scope=user&redirect_uri=http://localhost:7890/api/v1/github/login/callback`
    );
  })

  .get('/login/callback', (req, res) => {
    // get code
    const { code } = req.query;
    let user;
    exchangeCodeForToken(code)
      .then((token) => {
        return getGithubProfile(token);
      })
      .then((profile) => {
        Users.getByUsername(profile.login)
          .then((foundUser) => {
            if (foundUser) {
              user = foundUser;
            } else {
              Users.createUser({
                username: profile.login,
                avatar: profile.avatar_url,
                email: profile.email,
              }).then((createdUser) => (user = createdUser));
            }
          })
          .then(() => {
            const payload = jwt.sign({ ...user }, process.env.JWT_SECRET, {
              expiresIn: '1 day',
            });

            res
              //setting the cookie for our user
              .cookie(process.env.COOKIE_NAME, payload, {
                httpOnly: true,
                maxAge: ONE_DAY_IN_MS,
              })
              // sending the user to our dashboard
              .redirect('/api/v1/posts');
          })
          .catch((error) => next(error));
      });
  })

  .delete('/', (req, res) => {
    res
      .clearCookie(process.env.COOKIE_NAME)
      .json({ success: true, message: 'signed out successfully' });
  });
