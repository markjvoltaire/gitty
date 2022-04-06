const { Router } = require('express');
const Posts = require('../models/Post');
const auth = require('../middleware/authentication');

module.exports = Router()
  .post('/', auth, (req, res, next) => {
    Posts.createPost({
      userposts: req.body.userposts,
    })
      .then((posts) => res.send(posts))
      .catch((error) => next(error));
  })

  .get('/', auth, (req, res, next) => {
    Posts.getAllPosts()
      .then((posts) => res.send(posts))
      .catch((error) => next(error));
  });
