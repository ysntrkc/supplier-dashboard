# Supplier Dashboard Frontend

React frontend application for the Supplier Dashboard.

## Technologies Used

- React
- Vite
- TailwindCSS
- Chart.js
- React Table
- React Select
- Axios

## Prerequisites

- Node.js (v18 or higher)
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
VITE_BACKEND_URL=http://localhost:8000
```

4. Start the development server:
```bash
pnpm dev
```

The application will be available at `http://localhost:5173`

## Features

- Responsive dashboard layout
- Dark/light theme toggle
- Interactive charts:
  - Bar chart view
  - Line chart view
- Sortable data tables
- Real-time data filtering
- Loading states and error handling

## Project Structure

```
src/
├── App.jsx              # Main application component
├── DarkModeContext.jsx  # Theme context
├── main.jsx             # Application entry point
├── index.css            # Base styles
└── styles.css           # Component styles
```

## Development Commands

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm preview` - Preview production build
- `pnpm lint` - Run ESLint
- `pnpm lint:fix` - Fix ESLint errors
