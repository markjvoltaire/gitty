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

    console.log('req.header.location', req.header.location);
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
    agent.get('/api/v1/github/login/callback?code=42').redirects(1);

    //request
    const res = await agent
      .post('/api/v1/posts')
      .send({ userposts: 'hello world' });

    expect(res.body).toEqual({
      id: '1',
      userposts: 'hello world',
    });
  });

  it('should get all posts', async () => {
    const agent = request.agent(app);
    const expected = await Posts.getAllPosts();
    const res = await agent.get('/api/v1/posts');
    console.log('res.body', res.body);
    expect(res.body).toEqual(expected);
  });
});
