const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');
const User = require('../models/User');
const Blog = require('../models/Blog');

let token;
let userId;
let blogId;

beforeAll(async () => {
  await mongoose.connect(process.env.MONGODB_URI);
});

afterAll(async () => {
  await User.deleteMany({});
  await Blog.deleteMany({});
  await mongoose.connection.close();
});

describe('Auth Endpoints', () => {
  test('Register user', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        first_name: 'Test',
        last_name: 'User',
        email: 'test@test.com',
        password: 'password123'
      });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('token');
    token = res.body.token;
    userId = res.body.user.id;
  });

  test('Login user', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@test.com',
        password: 'password123'
      });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');
  });
});

describe('Blog Endpoints', () => {
  test('Create blog', async () => {
    const res = await request(app)
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Test Blog',
        description: 'Test Description',
        tags: ['test'],
        body: 'This is a test blog post with enough content to calculate reading time accurately.'
      });
    expect(res.statusCode).toBe(201);
    expect(res.body.blog).toHaveProperty('_id');
    blogId = res.body.blog._id;
  });

  test('Get user blogs', async () => {
    const res = await request(app)
      .get('/api/blogs/user/me')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.blogs.length).toBeGreaterThan(0);
  });

  test('Update blog to published', async () => {
    const res = await request(app)
      .patch(`/api/blogs/${blogId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ state: 'published' });
    expect(res.statusCode).toBe(200);
    expect(res.body.blog.state).toBe('published');
  });

  test('Get all published blogs', async () => {
    const res = await request(app).get('/api/blogs');
    expect(res.statusCode).toBe(200);
    expect(res.body.blogs.length).toBeGreaterThan(0);
  });

  test('Get single blog', async () => {
    const res = await request(app).get(`/api/blogs/${blogId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.blog).toHaveProperty('author');
    expect(res.body.blog.read_count).toBe(1);
  });

  test('Delete blog', async () => {
    const res = await request(app)
      .delete(`/api/blogs/${blogId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
  });
});
