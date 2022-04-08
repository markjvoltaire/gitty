const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');
const Posts = require('../lib/models/Post');
const { agent } = require('supertest');

jest.mock('../lib/utils/github');

describe('gitty routes', () => {
  beforeEach(() => {
    return setup(pool);
  });

  afterAll(() => {
    pool.end();
  });

  it('should redirect to the github oauth page upon login', async () => {
    const req = await request(app).get('/api/v1/github/login');

    expect(req.header.location).toMatch(
      /https:\/\/github.com\/login\/oauth\/authorize\?client_id=[\w\d]+&scope=user&redirect_uri=http:\/\/localhost:7890\/api\/v1\/github\/login\/callback/i
    );
  });

  it('should direct users to post after loggin in', async () => {
    const req = await request
      .agent(app)
      .get('/api/v1/github/login/callback?code=42')
      .redirects(1);
    expect(req.redirects[0]).toEqual(expect.stringContaining('/api/v1/posts'));
  });

  it('should create a post if a user is signed in', async () => {
    const agent = request.agent(app);
    //sign in
    await agent.get('/api/v1/github/login');
    await agent.get('/api/v1/github/login/callback?code=42').redirects(1);

    //request
    const res = await agent
      .post('/api/v1/posts')
      .send({ userposts: 'hello world' });

    expect(res.body).toEqual({
      id: expect.any(String),
      userposts: 'hello world',
    });
  });

  it('should get all posts', async () => {
    const agent = request.agent(app);
    await agent.get('/api/v1/github/login');
    await agent.get('/api/v1/github/login/callback?code=42').redirects(1);
    const expected = await Posts.getAllPosts();
    const res = await agent.get('/api/v1/posts');

    expect(res.body).toEqual(expected);
  });

  it('should delete the cookie', async () => {
    const agent = request.agent(app);
    //sign in
    await agent.get('/api/v1/github/login');
    await agent.get('/api/v1/github/login/callback?code=42').redirects(1);

    //request
    const res = await agent
      .post('/api/v1/posts')
      .send({ userposts: 'hello world' });

    expect(res.body).toEqual({
      id: expect.any(String),
      userposts: 'hello world',
    });
    // signout user
    const res2 = await agent.delete('/api/v1/github');
    expect(res2.body.message).toEqual('signed out successfully');
    //signed out user should not be able to view post
    const res3 = await agent.get('/api/v1/posts');
    expect(res3.body).toEqual({ status: 401, message: 'please sign in' });
  });

  it('should return an array of quote objects from 3 sets of API', async () => {
    const res = await request(app).get('/api/v1/quotes');

    const expected = [
      {
        author: expect.any(String),
        content: expect.any(String),
      },
      {
        author: expect.any(String),
        content: expect.any(String),
      },
      {
        author: expect.any(String),
        content: expect.any(String),
      },
    ];
    console.log('res.body', res.body);
    expect(res.body).toEqual(expected);
  });
});
