# Supplier Dashboard

A full-stack web application for managing supplier sales data with interactive charts and tables.

## Project Structure

```
lonca-supplier-dashboard/
├── frontend/         # React frontend application
└── backend/         # Node.js backend API
```

## Features

- Interactive sales dashboard with charts and tables
- Dark/light theme support
- Monthly sales visualization
- Product-wise sales breakdown
- Real-time data filtering
- Responsive design

## Getting Started

1. Clone the repository
```bash
git clone https://github.com/yourusername/lonca-supplier-dashboard.git
cd lonca-supplier-dashboard
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

## License

MIT License
