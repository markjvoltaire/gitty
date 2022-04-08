const fetch = require('cross-fetch');

const exchangeCodeForToken = (code) => {
  // TODO: Implement me!

  return fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    // header will be key value pair
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    // body stringified
    body: JSON.stringify({
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
      code,
    }),
  })
    .then((fetched) => fetched.json())
    .then(({ access_token }) => access_token);
};

const getGithubProfile = (token) => {
  // TODO: Implement me!
  return fetch('https://api.github.com/user', {
    headers: {
      Authorization: `token ${token}`,
    },
  })
    .then((fetched) => fetched.json())
    .then((profile) => {
      profile;
      console.log('profile', profile);
    });
};

module.exports = { exchangeCodeForToken, getGithubProfile };
