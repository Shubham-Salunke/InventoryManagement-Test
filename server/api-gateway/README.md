# API Gateway

This is the API Gateway for the Inventory Management microservices architecture. It acts as a single entry point for all client requests, providing routing, authentication, rate limiting, and other production-level features.



## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure environment variables in `.env` file:
   - `PORT`: Port for the gateway (default: 3000)
   - `ALLOWED_ORIGINS`: Allowed CORS origins
   - `AUTH_SERVICE_URL`: URL of the auth service
   - `PRODUCT_SERVICE_URL`: URL of the product service
   - `JWT_SECRET`: Secret key for JWT verification

3. Start the gateway:
   ```bash
   npm start
   ```

   For development:
   ```bash
   npm run dev
   ```

## API Routes


- `/auth/*`: Proxied to auth-service
- `/product/*`: Proxied to product-service (requires authentication)

