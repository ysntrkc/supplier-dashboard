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
- Express Status Monitor

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
SHOW_ERRORS=true
SHOW_ERROR_MESSAGE_ONLY=true
DB_URI='mongodb://localhost:27017/supplier_dashboard'
```

4. Start the development server:
```bash
pnpm dev
```

## Loading Sample Data (Optional)

To test the application with sample data, you can import the provided JSON files into your MongoDB database:

1. Make sure MongoDB is running locally
2. Import the sample data using mongoimport:

```bash
mongoimport --db supplier_dashboard --collection orders --jsonArray --file data/orders.json
mongoimport --db supplier_dashboard --collection parent_products --jsonArray --file data/parent_products.json
mongoimport --db supplier_dashboard --collection vendors --jsonArray --file data/vendors.json
```

After importing the data, you'll be able to:
- View sample vendor data
- See sales graphs and analytics
- Test all API endpoints with realistic data

## API Routes

- `GET /health` - Health check endpoint
- `GET /vendor` - Get all vendors
- `GET /dashboard/monthly/:vendor_id` - Get monthly sales for a vendor
- `GET /dashboard/monthly/:vendor_id/:product_id` - Get monthly sales for a specific product
- `GET /dashboard/product/:vendor_id` - Get product-wise sales for a vendor

### Query Parameters for Product Sales

The `/api/dashboard/product/:vendor_id` endpoint supports the following query parameters:

- `page` (optional) - Page number for pagination (default: 1)
- `limit` (optional) - Number of items per page (default: 10)
- `sort_by` (optional) - Field to sort by (options: code, name, color, total)
- `sort_order` (optional) - Sort direction (options: asc, desc)
- `search` (optional) - Search term to filter products

Example request:
```
GET /dashboard/product/{vendor_id}?page=1&limit=10&sort_by=total&sort_order=desc&search=blue
```

### Request And Response Examples

For the detailed request and response examples, please refer to the Swagger UI documentation at `http://localhost:8000/api-docs`.

## Development Commands

- `pnpm dev` - Start development server
- `pnpm lint` - Run ESLint
- `pnpm lint:fix` - Fix ESLint errors

## API Documentation

Swagger UI documentation is available at `http://localhost:8000/api-docs` when running in development mode.

## Status Monitoring

The application includes real-time monitoring capabilities using express-status-monitor. You can access the monitoring dashboard at:

```
http://localhost:8000/status
```

The monitoring page automatically updates and provides historical data in charts.
