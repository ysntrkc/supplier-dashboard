# Supplier Dashboard

A full-stack web application for suppliers to monitor their sales data and analyze product-wise sales trends.

## Project Structure

```
supplier-dashboard/
├── frontend/         # React frontend application
└── backend/         # Node.js backend API
```

## Key Features

- Monthly sales trends visualization
- Product-wise sales analysis
- Advanced filtering and sorting options
- Secure API endpoints with validation
- Request logging and monitoring
- Pagination support for large datasets
- Search functionality for products
- Real-time monitoring dashboard

## Technologies Used

### Backend
- Node.js with Express
- MongoDB with Mongoose
- Morgan for logging
- Joi for validation
- Swagger for API documentation
- Express Status Monitor

### Frontend
- React 
- TailwindCSS
- Responsive design
- Dark/light theme support

## Getting Started

1. Clone the repository
```bash
git clone https://github.com/ysntrkc/supplier-dashboard.git
cd supplier-dashboard
```

2. Set up the backend:
```bash
cd backend
pnpm install
cp .env.example .env
# Configure your environment variables
pnpm dev
```

3. Set up the frontend:
```bash
cd frontend
pnpm install
cp .env.example .env
# Configure your environment variables
pnpm dev
```

See the README in each directory for detailed setup instructions.

## API Documentation

Backend API documentation is available at `http://localhost:8000/api-docs` when running in development mode.

## Status Monitor

The Express Status Monitor is available at `http://localhost:8000/status` when running in development mode.