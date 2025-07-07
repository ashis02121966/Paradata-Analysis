# Docker Setup for Survey Data Scrutiny Dashboard

This document explains how to run the Survey Data Scrutiny Dashboard using Docker.

## Prerequisites

- Docker installed on your system
- Docker Compose (optional, for multi-container setup)

## Quick Start

### Option 1: Using Docker directly

1. Build the Docker image:
```bash
docker build -t survey-dashboard .
```

2. Run the container:
```bash
docker run -p 3000:3000 survey-dashboard
```

3. Access the application at `http://localhost:3000`

### Option 2: Using Docker Compose (Recommended)

1. Run with Docker Compose:
```bash
docker-compose up -d
```

2. Access the application at `http://localhost` (port 80)

3. To stop the services:
```bash
docker-compose down
```

## Configuration

### Environment Variables

You can customize the application by setting environment variables:

```bash
docker run -p 3000:3000 -e NODE_ENV=production survey-dashboard
```

### Port Configuration

To run on a different port:

```bash
docker run -p 8080:3000 survey-dashboard
```

Then access at `http://localhost:8080`

## Production Deployment

### With Nginx Reverse Proxy

The included `docker-compose.yml` sets up an Nginx reverse proxy for production use:

- Application runs on internal port 3000
- Nginx serves on port 80 with:
  - Gzip compression
  - Static asset caching
  - Proper headers

### Health Checks

Add health checks to your deployment:

```yaml
healthcheck:
  test: ["CMD", "curl", "-f", "http://localhost:3000"]
  interval: 30s
  timeout: 10s
  retries: 3
```

## Development

For development with hot reload, mount your source code:

```bash
docker run -p 3000:3000 -v $(pwd):/app survey-dashboard npm run dev
```

## Troubleshooting

### Container won't start
- Check if port 3000 is already in use
- Verify Docker is running
- Check container logs: `docker logs <container-id>`

### Build fails
- Ensure all dependencies are properly listed in package.json
- Check for any missing files in .dockerignore

### Performance issues
- Use the nginx setup for better static file serving
- Consider using multi-stage builds for smaller images

## Security Considerations

- Run containers as non-root user in production
- Use specific version tags instead of 'latest'
- Regularly update base images for security patches
- Consider using distroless images for production

## Monitoring

Add monitoring tools like:
- Prometheus for metrics
- Grafana for visualization
- ELK stack for logging

Example monitoring setup can be added to docker-compose.yml as needed.