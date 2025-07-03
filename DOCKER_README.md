# Docker Setup for Skylink Exam Project

This project includes Docker configuration for development, testing, and production environments.

## Prerequisites

- Docker
- Docker Compose

## Quick Start

### Development Environment

Run the application in development mode with hot reloading:

```bash
# Using docker-compose
docker-compose --profile dev up

# Or using docker directly
docker build -t skylink-exam:dev --target development .
docker run -p 5173:5173 -v $(pwd):/app -v /app/node_modules skylink-exam:dev
```

The application will be available at `http://localhost:5173`

### Production Environment

Build and run the production version:

```bash
# Using docker-compose
docker-compose --profile prod up

# Or using docker directly
docker build -t skylink-exam:prod --target production .
docker run -p 80:80 skylink-exam:prod
```

The application will be available at `http://localhost`

### Testing

Run tests in a containerized environment:

```bash
# Using docker-compose
docker-compose --profile test up

# Or using docker directly
docker build -t skylink-exam:test --target development .
docker run -v $(pwd):/app -v /app/node_modules skylink-exam:test npm run test
```

## Docker Architecture

### Multi-Stage Build

The Dockerfile uses a multi-stage build approach:

1. **Builder Stage**: Installs dependencies and builds the application
2. **Production Stage**: Serves the built application using Nginx
3. **Development Stage**: Runs the Vite dev server with hot reloading

### Services

- **skylink-dev**: Development environment with hot reloading
- **skylink-prod**: Production environment with Nginx
- **skylink-test**: Testing environment

## Available Commands

```bash
# Development
docker-compose --profile dev up -d          # Run in background
docker-compose --profile dev logs -f        # View logs
docker-compose --profile dev down           # Stop services

# Production
docker-compose --profile prod up -d
docker-compose --profile prod down

# Testing
docker-compose --profile test up
docker-compose run --rm skylink-test npm run test:coverage

# Build specific targets
docker build --target development -t skylink-exam:dev .
docker build --target production -t skylink-exam:prod .
```

## Environment Variables

You can create environment-specific files:

- `.env.development` - Development environment variables
- `.env.production` - Production environment variables
- `.env.test` - Test environment variables

## Volumes

- Development mode mounts the source code for hot reloading
- Node modules are stored in an anonymous volume to prevent conflicts

## Ports

- **Development**: 5173
- **Production**: 80
- **Testing**: No exposed ports (runs tests and exits)

## Nginx Configuration

The production build uses a custom Nginx configuration that:

- Enables gzip compression
- Handles client-side routing (React Router)
- Sets appropriate cache headers for static assets
- Includes security headers
- Removes server version information

## Troubleshooting

### Port Already in Use
```bash
# Check what's using the port
lsof -i :5173  # or :80 for production

# Use different ports
docker run -p 3000:5173 skylink-exam:dev
```

### Permission Issues (Linux/macOS)
```bash
# Fix file permissions
sudo chown -R $USER:$USER .
```

### Clear Docker Cache
```bash
# Remove all containers and images
docker system prune -a

# Rebuild without cache
docker-compose build --no-cache
```
