import request from 'supertest';
import app from '../app';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

describe('Auth Endpoints', () => {
  beforeAll(async () => {
    // Setup: limpar banco de teste se necessário
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Test User',
          email: 'test@example.com',
          password: 'password123',
          role: 'USER',
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.email).toBe('test@example.com');
    });

    it('should fail with invalid email', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Test User',
          email: 'invalid-email',
          password: 'password123',
        });

      expect(response.status).toBe(400);
    });

    it('should fail with short password', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Test User',
          email: 'test2@example.com',
          password: '123',
        });

      expect(response.status).toBe(400);
    });
  });

  describe('POST /api/auth/login', () => {
    it('should login with valid credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'password123',
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('accessToken');
      expect(response.body).toHaveProperty('refreshToken');
      expect(response.body).toHaveProperty('user');
    });

    it('should fail with invalid credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'wrongpassword',
        });

      expect(response.status).toBe(401);
    });
  });
});

describe('Users Endpoints', () => {
  let authToken: string;

  beforeAll(async () => {
    // Login para obter token
    const loginResponse = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'superadmin@demo.com',
        password: 'senha12345',
      });

    authToken = loginResponse.body.accessToken;
  });

  describe('GET /api/users', () => {
    it('should list users with authentication', async () => {
      const response = await request(app)
        .get('/api/users')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });

    it('should fail without authentication', async () => {
      const response = await request(app).get('/api/users');

      expect(response.status).toBe(401);
    });
  });
});

describe('Access Endpoints', () => {
  let authToken: string;

  beforeAll(async () => {
    const loginResponse = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'operador.escola@demo.com',
        password: 'senha12345',
      });

    authToken = loginResponse.body.accessToken;
  });

  describe('GET /api/access/stats', () => {
    it('should return access statistics', async () => {
      const response = await request(app)
        .get('/api/access/stats')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('total');
      expect(response.body).toHaveProperty('entries');
      expect(response.body).toHaveProperty('exits');
      expect(response.body).toHaveProperty('today');
    });
  });

  describe('POST /api/access', () => {
    it('should create access log', async () => {
      const response = await request(app)
        .post('/api/access')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          visitorName: 'Test Visitor',
          type: 'ENTRY',
          status: 'AUTHORIZED',
          method: 'MANUAL',
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.visitorName).toBe('Test Visitor');
    });
  });
});
