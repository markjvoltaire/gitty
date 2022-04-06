const { Router } = require('express');
const Posts = require('../models/Post');
const auth = require('../middleware/authentication');

module.exports = Router()
  .post('/', auth, async (req, res, next) => {
    try {
      const post = await Posts.createPost({
        userposts: req.body.userposts,
      });
      res.json(post);
    } catch (error) {
      next();
    }
  })

  .get('/', auth, (req, res, next) => {
    Posts.getAllPosts()
      .then((posts) => res.send(posts))
      .catch((error) => next(error));
  });
