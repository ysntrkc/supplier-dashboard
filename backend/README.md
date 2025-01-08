# Supplier Dashboard Backend

Node.js backend API for the Supplier Dashboard application.

## Technologies Used

- Node.js
- Express.js
- MongoDB with Mongoose
- Swagger UI for API documentation
- Morgan for logging
- Joi for validation
- CORS enabled

## Prerequisites

- Node.js (v18 or higher)
- MongoDB (v4.4 or higher)
- pnpm (v8 or higher)

## Setup

1. Install dependencies:
```bash
pnpm install
```

2. Configure environment variables:
```bash
cp .env.example .env
```

3. Update the `.env` file with your configuration:
```properties
NODE_ENV=dev
PORT=8000
SWAGGER_URI=127.0.0.1:8000
SHOW_ERRORS=true
SHOW_ERROR_MESSAGE_ONLY=true
DB_URI='mongodb://localhost:27017/lonca_supplier'
```

4. Start the development server:
```bash
pnpm dev
```

## API Routes

- `GET /api/health` - Health check endpoint
- `GET /api/vendor` - Get all vendors
- `GET /api/dashboard/monthly/:vendor_id` - Get monthly sales for a vendor
- `GET /api/dashboard/product/:vendor_id` - Get product-wise sales for a vendor

## Development Commands

- `pnpm dev` - Start development server
- `pnpm lint` - Run ESLint
- `pnpm lint:fix` - Fix ESLint errors

## API Documentation

Swagger UI documentation is available at `http://localhost:8000/api-docs` when running in development mode.
