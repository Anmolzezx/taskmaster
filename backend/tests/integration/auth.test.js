const { request, app } = require('../setup');
const { User, sequelize } = require('../../src/models');

describe('Auth Integration Tests', () => {
    beforeEach(async () => {
        // Clear users table before each test
        await User.destroy({ where: {}, force: true });
    });

    describe('POST /api/auth/register', () => {
        it('should register a new user successfully', async () => {
            const response = await request(app)
                .post('/api/auth/register')
                .send({
                    email: 'test@example.com',
                    password: 'password123',
                    fullName: 'Test User'
                });

            expect(response.status).toBe(201);
            expect(response.body.success).toBe(true);
            expect(response.body.data).toHaveProperty('accessToken');
            expect(response.body.data).toHaveProperty('refreshToken');
            expect(response.body.data.user.email).toBe('test@example.com');
        });

        it('should reject duplicate email', async () => {
            // Create first user
            await request(app)
                .post('/api/auth/register')
                .send({
                    email: 'test@example.com',
                    password: 'password123',
                    fullName: 'Test User'
                });

            // Try to create duplicate
            const response = await request(app)
                .post('/api/auth/register')
                .send({
                    email: 'test@example.com',
                    password: 'password456',
                    fullName: 'Another User'
                });

            expect(response.status).toBe(400);
        });

        it('should reject invalid email', async () => {
            const response = await request(app)
                .post('/api/auth/register')
                .send({
                    email: 'invalid-email',
                    password: 'password123',
                    fullName: 'Test User'
                });

            expect(response.status).toBe(400);
        });

        it('should reject weak password', async () => {
            const response = await request(app)
                .post('/api/auth/register')
                .send({
                    email: 'test@example.com',
                    password: '123',
                    fullName: 'Test User'
                });

            expect(response.status).toBe(400);
        });
    });

    describe('POST /api/auth/login', () => {
        beforeEach(async () => {
            // Register a user for login tests
            await request(app)
                .post('/api/auth/register')
                .send({
                    email: 'test@example.com',
                    password: 'password123',
                    fullName: 'Test User'
                });
        });

        it('should login successfully with correct credentials', async () => {
            const response = await request(app)
                .post('/api/auth/login')
                .send({
                    email: 'test@example.com',
                    password: 'password123'
                });

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.data).toHaveProperty('accessToken');
            expect(response.body.data).toHaveProperty('refreshToken');
        });

        it('should reject incorrect password', async () => {
            const response = await request(app)
                .post('/api/auth/login')
                .send({
                    email: 'test@example.com',
                    password: 'wrongpassword'
                });

            expect(response.status).toBe(401);
        });

        it('should reject non-existent email', async () => {
            const response = await request(app)
                .post('/api/auth/login')
                .send({
                    email: 'nonexistent@example.com',
                    password: 'password123'
                });

            expect(response.status).toBe(401);
        });
    });

    describe('POST /api/auth/refresh', () => {
        let refreshToken;

        beforeEach(async () => {
            // Register and login to get refresh token
            const response = await request(app)
                .post('/api/auth/register')
                .send({
                    email: 'test@example.com',
                    password: 'password123',
                    fullName: 'Test User'
                });

            refreshToken = response.body.data.refreshToken;
        });

        it('should refresh access token successfully', async () => {
            const response = await request(app)
                .post('/api/auth/refresh')
                .send({ refreshToken });

            expect(response.status).toBe(200);
            expect(response.body.data).toHaveProperty('accessToken');
        });

        it('should reject invalid refresh token', async () => {
            const response = await request(app)
                .post('/api/auth/refresh')
                .send({ refreshToken: 'invalid-token' });

            expect(response.status).toBe(401);
        });
    });

    describe('POST /api/auth/forgot-password', () => {
        beforeEach(async () => {
            await request(app)
                .post('/api/auth/register')
                .send({
                    email: 'test@example.com',
                    password: 'password123',
                    fullName: 'Test User'
                });
        });

        it('should generate reset token for existing email', async () => {
            const response = await request(app)
                .post('/api/auth/forgot-password')
                .send({ email: 'test@example.com' });

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);

            // Verify token was saved
            const user = await User.findOne({ where: { email: 'test@example.com' } });
            expect(user.resetToken).toBeTruthy();
            expect(user.resetTokenExpiry).toBeTruthy();
        });

        it('should not reveal if email does not exist', async () => {
            const response = await request(app)
                .post('/api/auth/forgot-password')
                .send({ email: 'nonexistent@example.com' });

            // Should still return 200 to prevent email enumeration
            expect(response.status).toBe(200);
        });
    });

    describe('POST /api/auth/reset-password', () => {
        let resetToken;

        beforeEach(async () => {
            // Register user and request password reset
            await request(app)
                .post('/api/auth/register')
                .send({
                    email: 'test@example.com',
                    password: 'password123',
                    fullName: 'Test User'
                });

            const resetResponse = await request(app)
                .post('/api/auth/forgot-password')
                .send({ email: 'test@example.com' });

            // In development, token is returned in response
            resetToken = resetResponse.body.data.resetToken;
        });

        it('should reset password with valid token', async () => {
            const response = await request(app)
                .post('/api/auth/reset-password')
                .send({
                    token: resetToken,
                    newPassword: 'newPassword456'
                });

            expect(response.status).toBe(200);

            // Verify can login with new password
            const loginResponse = await request(app)
                .post('/api/auth/login')
                .send({
                    email: 'test@example.com',
                    password: 'newPassword456'
                });

            expect(loginResponse.status).toBe(200);
        });

        it('should reject invalid token', async () => {
            const response = await request(app)
                .post('/api/auth/reset-password')
                .send({
                    token: 'invalid-token',
                    newPassword: 'newPassword456'
                });

            expect(response.status).toBe(400);
        });
    });
});
