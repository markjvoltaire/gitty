const { Router } = require('express');

module.exports = Router()
  .get('/login', async (req, res) => {
    // TODO: Kick-off the github oauth flow
    res.redirect(
      `https://github.com/login/oauth/authorize?client_id=${process.env.CLIENT_ID}&scope=user&redirect_uri=http://localhost:7890/api/v1/github/login/callback`
    );
  })

  .get('/login/callback', async (req, res) => {
    // get code
    const { code } = req.query;

    const token = await exchangeCodeForToken(code);
    const { login, avatar_url, email } = await getGithubProfile(token);
    let user = await GithubUser.findByUsername(login);
    if (!user) {
      user = await GithubUser.insert({
        username: login,
        avatar: avatar_url,
        email,
      });
    }

    const payload = jwt.sign(user.toJSON(), process.env.JWT_SECRET, {
      expiresIn: '1 day',
    });

    try {
      res
        //setting the cookie for our user
        .cookie(process.env.COOKIE_NAME, payload, {
          httpOnly: true,
          maxAge: ONE_DAY_IN_MS,
        })
        // sending the user to our dashboard
        .redirect('/api/v1/github/dashboard');
    } catch (error) {
      next(error);
    }
  });
