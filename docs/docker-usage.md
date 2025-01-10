# Docker Usage Guide

## Development Environment

Start the development environment with hot-reload and debugging:

```bash
# Using npm script
npm run docker:dev

# Or using docker-compose directly
docker-compose up dev
```

To rebuild the development environment:
```bash
npm run docker:dev:build
```

Debug port 9229 is exposed for development environment. You can attach your IDE debugger to this port.

## Production Environment

Start the production environment:

```bash
# Using npm script
npm run docker:prod

# Or using docker-compose directly
docker-compose up prod
```

To rebuild the production environment:
```bash
npm run docker:prod:build
```

## Managing Environments

Stop all containers:
```bash
npm run docker:stop
```

Clean up all containers, volumes, and images:
```bash
npm run docker:clean
```

## Environment Variables

### Development
- NODE_ENV=development
- NEXT_PUBLIC_ENV=development
- NEXT_TELEMETRY_DISABLED=1

### Production
- NODE_ENV=production
- NEXT_PUBLIC_ENV=production
- NEXT_TELEMETRY_DISABLED=1

## Health Checks

Both environments include health checks that monitor the application status every 30 seconds.
- URL: http://localhost:3000
- Interval: 30s
- Timeout: 10s
- Retries: 3

## Networking

Both environments use the 'wlc-network' Docker network for container communication.
