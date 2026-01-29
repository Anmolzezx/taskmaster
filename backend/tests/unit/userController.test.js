const { User } = require('../../src/models');
const userController = require('../../src/controllers/userController');
const bcrypt = require('bcryptjs');

describe('UserController Unit Tests', () => {
    let mockReq, mockRes, mockNext;

    beforeEach(() => {
        mockReq = {
            user: { userId: 'test-user-id' },
            body: {}
        };
        mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis()
        };
        mockNext = jest.fn();
    });

    describe('getProfile', () => {
        it('should return user profile successfully', async () => {
            const mockUser = {
                id: 'test-user-id',
                email: 'test@example.com',
                fullName: 'Test User',
                avatarUrl: null
            };

            User.findByPk = jest.fn().mockResolvedValue(mockUser);

            await userController.getProfile(mockReq, mockRes, mockNext);

            expect(User.findByPk).toHaveBeenCalledWith('test-user-id', {
                attributes: { exclude: ['passwordHash', 'resetToken', 'resetTokenExpiry'] }
            });
            expect(mockRes.json).toHaveBeenCalled();
            expect(mockNext).not.toHaveBeenCalled();
        });

        it('should return 404 if user not found', async () => {
            User.findByPk = jest.fn().mockResolvedValue(null);

            await userController.getProfile(mockReq, mockRes, mockNext);

            expect(mockRes.status).toHaveBeenCalledWith(404);
            expect(mockRes.json).toHaveBeenCalled();
        });

        it('should handle errors', async () => {
            const error = new Error('Database error');
            User.findByPk = jest.fn().mockRejectedValue(error);

            await userController.getProfile(mockReq, mockRes, mockNext);

            expect(mockNext).toHaveBeenCalledWith(error);
        });
    });

    describe('updateProfile', () => {
        it('should update profile successfully', async () => {
            mockReq.body = {
                fullName: 'Updated Name',
                avatarUrl: 'https://example.com/avatar.jpg'
            };

            const mockUser = {
                id: 'test-user-id',
                fullName: 'Old Name',
                avatarUrl: null,
                save: jest.fn().mockResolvedValue(true)
            };

            User.findByPk = jest.fn()
                .mockResolvedValueOnce(mockUser)
                .mockResolvedValueOnce({
                    ...mockUser,
                    fullName: 'Updated Name',
                    avatarUrl: 'https://example.com/avatar.jpg'
                });

            await userController.updateProfile(mockReq, mockRes, mockNext);

            expect(mockUser.save).toHaveBeenCalled();
            expect(mockRes.json).toHaveBeenCalled();
        });

        it('should reject invalid avatar URL', async () => {
            mockReq.body = {
                avatarUrl: 'not-a-valid-url'
            };

            await userController.updateProfile(mockReq, mockRes, mockNext);

            expect(mockRes.status).toHaveBeenCalledWith(400);
        });

        it('should reject fullName that is too short', async () => {
            mockReq.body = {
                fullName: 'A'
            };

            await userController.updateProfile(mockReq, mockRes, mockNext);

            expect(mockRes.status).toHaveBeenCalledWith(400);
        });
    });

    describe('updatePassword', () => {
        it('should update password successfully', async () => {
            mockReq.body = {
                currentPassword: 'oldPassword123',
                newPassword: 'newPassword456'
            };

            const hashedPassword = await bcrypt.hash('oldPassword123', 10);
            const mockUser = {
                id: 'test-user-id',
                passwordHash: hashedPassword,
                save: jest.fn().mockResolvedValue(true)
            };

            User.findByPk = jest.fn().mockResolvedValue(mockUser);
            bcrypt.compare = jest.fn().mockResolvedValue(true);
            bcrypt.genSalt = jest.fn().mockResolvedValue('salt');
            bcrypt.hash = jest.fn().mockResolvedValue('newHashedPassword');

            await userController.updatePassword(mockReq, mockRes, mockNext);

            expect(mockUser.save).toHaveBeenCalled();
            expect(mockRes.json).toHaveBeenCalled();
        });

        it('should reject if current password is incorrect', async () => {
            mockReq.body = {
                currentPassword: 'wrongPassword',
                newPassword: 'newPassword456'
            };

            const mockUser = {
                id: 'test-user-id',
                passwordHash: 'hashedPassword'
            };

            User.findByPk = jest.fn().mockResolvedValue(mockUser);
            bcrypt.compare = jest.fn().mockResolvedValue(false);

            await userController.updatePassword(mockReq, mockRes, mockNext);

            expect(mockRes.status).toHaveBeenCalledWith(401);
        });

        it('should reject weak new password', async () => {
            mockReq.body = {
                currentPassword: 'oldPassword123',
                newPassword: '123'
            };

            await userController.updatePassword(mockReq, mockRes, mockNext);

            expect(mockRes.status).toHaveBeenCalledWith(400);
        });
    });
});
