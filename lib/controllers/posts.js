const { Router } = require('express');
const Posts = require('../models/Post');

module.exports = Router()
  .post('/', async (req, res) => {
    try {
      const post = await Posts.createPost({
        userposts: req.body.userposts,
      });
      res.json(post);
    } catch (error) {
      return null;
    }
  })

  .get('/', async (req, res) => {
    try {
      const posts = await Posts.getAllPosts();
      res.send(posts);
    } catch (error) {
      return null;
    }
  });
