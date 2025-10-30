import request from 'supertest';
import { promises as fs } from 'fs';
import path from 'path';
import { createApp } from '../app';
import { Express } from 'express';

const TEST_DATA_PATH = path.join(__dirname, '../../test-data');
const TEST_FILE = path.join(TEST_DATA_PATH, 'todos-api-test.json');

describe('Todo API', () => {
  let app: Express;

  beforeEach(async () => {
    await fs.mkdir(TEST_DATA_PATH, { recursive: true });
    app = createApp(TEST_FILE);
  });

  afterEach(async () => {
    try {
      await fs.unlink(TEST_FILE);
    } catch (error) {
      // File might not exist
    }
  });

  afterAll(async () => {
    try {
      await fs.rmdir(TEST_DATA_PATH);
    } catch (error) {
      // Directory might not be empty
    }
  });

  describe('GET /api/todos', () => {
    it('should return empty array when no todos exist', async () => {
      const response = await request(app)
        .get('/api/todos')
        .expect(200);

      expect(response.body).toEqual([]);
    });

    it('should return all todos', async () => {
      // Create a todo first
      await request(app)
        .post('/api/todos')
        .send({ title: 'Test Todo', description: 'Test Description' });

      const response = await request(app)
        .get('/api/todos')
        .expect(200);

      expect(response.body).toHaveLength(1);
      expect(response.body[0]).toHaveProperty('id');
      expect(response.body[0]).toHaveProperty('title', 'Test Todo');
      expect(response.body[0]).toHaveProperty('description', 'Test Description');
      expect(response.body[0]).toHaveProperty('completed', false);
      expect(response.body[0]).toHaveProperty('createdAt');
      expect(response.body[0]).toHaveProperty('updatedAt');
    });

    it('should return multiple todos', async () => {
      await request(app)
        .post('/api/todos')
        .send({ title: 'First', description: 'First desc' });

      await request(app)
        .post('/api/todos')
        .send({ title: 'Second', description: 'Second desc' });

      const response = await request(app)
        .get('/api/todos')
        .expect(200);

      expect(response.body).toHaveLength(2);
    });
  });

  describe('GET /api/todos/:id', () => {
    it('should return 404 when todo not found', async () => {
      await request(app)
        .get('/api/todos/nonexistent-id')
        .expect(404);
    });

    it('should return todo by id', async () => {
      const createResponse = await request(app)
        .post('/api/todos')
        .send({ title: 'Test Todo', description: 'Description' });

      const todoId = createResponse.body.id;

      const response = await request(app)
        .get(`/api/todos/${todoId}`)
        .expect(200);

      expect(response.body.id).toBe(todoId);
      expect(response.body.title).toBe('Test Todo');
    });
  });

  describe('POST /api/todos', () => {
    it('should create a new todo', async () => {
      const response = await request(app)
        .post('/api/todos')
        .send({ title: 'New Todo', description: 'New Description' })
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.title).toBe('New Todo');
      expect(response.body.description).toBe('New Description');
      expect(response.body.completed).toBe(false);
    });

    it('should return 400 when title is missing', async () => {
      await request(app)
        .post('/api/todos')
        .send({ description: 'No title' })
        .expect(400);
    });

    it('should return 400 when title is empty', async () => {
      await request(app)
        .post('/api/todos')
        .send({ title: '', description: 'Empty title' })
        .expect(400);
    });

    it('should allow empty description', async () => {
      const response = await request(app)
        .post('/api/todos')
        .send({ title: 'No Description', description: '' })
        .expect(201);

      expect(response.body.description).toBe('');
    });
  });

  describe('PUT /api/todos/:id', () => {
    it('should update todo title', async () => {
      const createResponse = await request(app)
        .post('/api/todos')
        .send({ title: 'Original', description: 'Description' });

      const todoId = createResponse.body.id;

      const response = await request(app)
        .put(`/api/todos/${todoId}`)
        .send({ title: 'Updated' })
        .expect(200);

      expect(response.body.title).toBe('Updated');
      expect(response.body.description).toBe('Description');
    });

    it('should update todo description', async () => {
      const createResponse = await request(app)
        .post('/api/todos')
        .send({ title: 'Title', description: 'Original' });

      const todoId = createResponse.body.id;

      const response = await request(app)
        .put(`/api/todos/${todoId}`)
        .send({ description: 'Updated' })
        .expect(200);

      expect(response.body.title).toBe('Title');
      expect(response.body.description).toBe('Updated');
    });

    it('should return 404 when todo not found', async () => {
      await request(app)
        .put('/api/todos/nonexistent-id')
        .send({ title: 'Updated' })
        .expect(404);
    });

    it('should return 400 when updating title to empty', async () => {
      const createResponse = await request(app)
        .post('/api/todos')
        .send({ title: 'Original', description: 'Description' });

      await request(app)
        .put(`/api/todos/${createResponse.body.id}`)
        .send({ title: '' })
        .expect(400);
    });
  });

  describe('PATCH /api/todos/:id/toggle', () => {
    it('should toggle todo completion status', async () => {
      const createResponse = await request(app)
        .post('/api/todos')
        .send({ title: 'Todo', description: 'Description' });

      const todoId = createResponse.body.id;

      const response = await request(app)
        .patch(`/api/todos/${todoId}/toggle`)
        .expect(200);

      expect(response.body.completed).toBe(true);

      const toggleBackResponse = await request(app)
        .patch(`/api/todos/${todoId}/toggle`)
        .expect(200);

      expect(toggleBackResponse.body.completed).toBe(false);
    });

    it('should return 404 when todo not found', async () => {
      await request(app)
        .patch('/api/todos/nonexistent-id/toggle')
        .expect(404);
    });
  });

  describe('DELETE /api/todos/:id', () => {
    it('should delete todo', async () => {
      const createResponse = await request(app)
        .post('/api/todos')
        .send({ title: 'To Delete', description: 'Will be deleted' });

      const todoId = createResponse.body.id;

      await request(app)
        .delete(`/api/todos/${todoId}`)
        .expect(204);

      await request(app)
        .get(`/api/todos/${todoId}`)
        .expect(404);
    });

    it('should return 404 when todo not found', async () => {
      await request(app)
        .delete('/api/todos/nonexistent-id')
        .expect(404);
    });
  });
});
