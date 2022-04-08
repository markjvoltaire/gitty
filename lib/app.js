const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();

// Built in middleware
app.use(cookieParser());
app.use(express.json());

// App routes
app.use('/api/v1/github', require('./controllers/githubUsers'));
app.use('/api/v1/posts', require('./controllers/posts'));
app.use('/api/v1/quotes', require('./controllers/quotes'));
// Error handling & 404 middleware for when
// a request doesn't match any app routes
app.use(require('./middleware/not-found'));
app.use(require('./middleware/error'));

module.exports = app;
