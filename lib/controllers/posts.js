const { Router } = require('express');
const Posts = require('../models/Post');
const auth = require('../middleware/authentication');

module.exports = Router()
  .post('/', async (req, res, next) => {
    try {
      const post = await Posts.createPost({
        userposts: req.body.userposts,
      });
      res.json(post);
    } catch (error) {
      next();
    }
  })

  .get('/', async (req, res, next) => {
    try {
      const posts = await Posts.getAllPosts();
      res.json(posts);
    } catch (error) {
      next();
    }
  });
