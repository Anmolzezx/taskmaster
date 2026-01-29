# TaskMaster Backend Deployment Guide

## Prerequisites

- Node.js 18+ installed
- PostgreSQL database (local or cloud)
- Git installed

## Local Development Setup

### 1. Clone and Install Dependencies

```bash
cd backend
npm install
```

### 2. Environment Configuration

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Update the following variables in `.env`:

```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=taskmaster_db
DB_USER=your_db_user
DB_PASSWORD=your_db_password

# JWT Secrets (generate using: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
JWT_SECRET=your_generated_secret_here
JWT_REFRESH_SECRET=your_generated_refresh_secret_here

# CORS
CORS_ORIGIN=http://localhost:3000
```

### 3. Database Setup

Create the database:

```sql
CREATE DATABASE taskmaster_db;
```

Run database initialization:

```bash
npm run db:init
```

### 4. Start Development Server

```bash
npm run dev
```

The server will start on `http://localhost:5000`

## Testing

### Run All Tests

```bash
npm test
```

### Run Tests in Watch Mode

```bash
npm run test:watch
```

### Run Unit Tests Only

```bash
npm run test:unit
```

### Run Integration Tests Only

```bash
npm run test:integration
```

## Production Deployment

### Environment Variables

Ensure all environment variables are set in your production environment:

- `NODE_ENV=production`
- `PORT` - Server port (default: 5000)
- `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD` - Database credentials
- `JWT_SECRET`, `JWT_REFRESH_SECRET` - Strong random secrets (64+ characters)
- `CORS_ORIGIN` - Your frontend domain

### Build and Start

```bash
npm start
```

### Deployment Platforms

#### Render

1. Create new Web Service
2. Connect your GitHub repository
3. Set build command: `npm install`
4. Set start command: `npm start`
5. Add environment variables in Render dashboard
6. Deploy

#### Heroku

```bash
heroku create taskmaster-api
heroku addons:create heroku-postgresql:mini
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=your_secret
heroku config:set JWT_REFRESH_SECRET=your_refresh_secret
heroku config:set CORS_ORIGIN=https://your-frontend.com
git push heroku main
```

#### Railway

1. Create new project
2. Connect GitHub repository
3. Add PostgreSQL database
4. Set environment variables
5. Deploy automatically on push

## API Documentation

Once deployed, access the Swagger API documentation at:

```
https://your-domain.com/api-docs
```

## Health Check

Check if the API is running:

```
GET https://your-domain.com/health
```

Expected response:

```json
{
  "success": true,
  "message": "TaskMaster API is running",
  "timestamp": "2026-01-29T10:35:00.000Z"
}
```

## Security Checklist

- [ ] Strong JWT secrets (64+ characters, randomly generated)
- [ ] CORS configured for specific frontend domain
- [ ] Database credentials secured
- [ ] HTTPS enabled in production
- [ ] Rate limiting configured (optional)
- [ ] Environment variables not committed to Git

## Monitoring

### Logs

Check application logs:

```bash
# Render
View in Render dashboard

# Heroku
heroku logs --tail

# Railway
View in Railway dashboard
```

### Database Connection

Test database connection:

```bash
npm run db:init
```

## Troubleshooting

### Database Connection Issues

- Verify database credentials
- Check if database is accessible from your deployment platform
- Ensure database allows connections from deployment IP

### JWT Errors

- Verify JWT secrets are set correctly
- Ensure secrets are at least 32 characters long

### CORS Errors

- Update `CORS_ORIGIN` to match your frontend domain
- Include protocol (http/https) in CORS_ORIGIN

## Maintenance

### Database Migrations

When models change, update the database:

```bash
npm run db:init
```

**Warning**: This will drop and recreate all tables. Use migrations for production.

### Backup Database

```bash
# PostgreSQL
pg_dump -U username -d taskmaster_db > backup.sql
```

## Support

For issues or questions, refer to:
- API Documentation: `/api-docs`
- Testing Documentation: `backend/docs/`
