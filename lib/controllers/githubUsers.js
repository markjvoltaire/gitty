const { Router } = require('express');

module.exports = Router().get('/login', async (req, res) => {
  // TODO: Kick-off the github oauth flow
  res.redirect(
    `https://github.com/login/oauth/authorize?client_id=${process.env.CLIENT_ID}&scope=user&redirect_uri=http://localhost:7890/api/v1/github/login/callback`
  );
});
