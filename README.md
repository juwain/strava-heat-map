# Heat Map

A Strava activity visualization web application that displays your athletic activities on an interactive map. Connect your Strava account to view cycling, running, and walking activities with customizable display modes.

## Features

- **Strava Integration** - OAuth authentication to securely connect your Strava account
- **Interactive Map** - Built with Leaflet for smooth panning and zooming
- **Multiple Display Modes**
  - Heatmap view for activity density visualization
  - Colored polylines for individual activity routes
- **Activity Filtering** - Filter by activity type (Bicycle, Running, Walking)
- **Statistics Panel** - View total distance breakdown by activity type
- **Activity Sync** - Fetch and store new activities from Strava

## Screenshots

<!-- TODO: Add screenshots of the application -->

## Tech Stack

### Backend
- **Fastify** - Fast and low overhead web framework
- **Node.js** - JavaScript runtime (ES modules)
- **dotenv** - Environment variable management

### Frontend
- **Leaflet** - Open-source mapping library
- **TypeScript** - Type-safe JavaScript
- **Vanilla JS** - No framework, pure browser APIs

### Build Tools
- **esbuild** - Fast JavaScript bundler
- **tsx** - TypeScript execution for development
- **Vitest** - Testing framework

## Prerequisites

- **Node.js** - Version 18 or higher with ES module support
- **Strava API Access** - You'll need to create a Strava API application:
  1. Go to [Strava Developers](https://www.strava.com/settings/api)
  2. Create a new API application
  3. Note your Client ID and Client Secret
  4. Set the Authorization Callback Domain to `localhost:3000`

## Getting Started

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd heat-map

# Install dependencies
npm install
```

### Environment Setup

Create a `.env` file from the template:

```bash
cp .env.template .env
```

Edit `.env` and fill in your Strava API credentials:

```env
STRAVA_CLIENT_ID=your_client_id_here
STRAVA_CLIENT_SECRET=your_client_secret_here
REDIRECT_URI=http://localhost:3000/auth/callback
```

### Running the Application

```bash
# Development mode (with auto-restart)
npm run dev

# Production build
npm run build
npm start
```

The application will be available at `http://localhost:3000`

## Configuration

### Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `STRAVA_CLIENT_ID` | Your Strava API application client ID | `12345` |
| `STRAVA_CLIENT_SECRET` | Your Strava API application secret | `abc123...` |
| `REDIRECT_URI` | OAuth callback URL | `http://localhost:3000/auth/callback` |

## Project Structure

```
heat-map/
├── src/
│   ├── client/              # Frontend application
│   │   ├── index.html       # Main HTML entry point
│   │   ├── main.ts          # Application bootstrap
│   │   ├── style.css        # Global styles
│   │   ├── lib/             # Utility libraries
│   │   │   ├── categorization.ts  # Activity type classification
│   │   │   ├── geo.ts            # Geographic calculations
│   │   │   └── polyline.ts       # Polyline encoding/decoding
│   │   ├── map/             # Map-related code
│   │   │   ├── heatmap.ts        # Heatmap layer management
│   │   │   ├── layers.ts         # Layer control
│   │   │   └── lines.ts          # Activity polyline rendering
│   │   ├── ui/              # UI components
│   │   │   ├── controls.ts       # Map controls
│   │   │   ├── stats.ts          # Statistics panel
│   │   │   └── sync.ts           # Sync button handling
│   │   └── types/           # TypeScript type definitions
│   │       └── index.ts
│   └── server/             # Backend application
│       ├── index.ts        # Server entry point
│       ├── middleware/
│       │   └── auth.ts     # Authentication guard
│       ├── routes/
│       │   ├── auth.ts     # OAuth endpoints
│       │   └── api.ts      # API endpoints
│       ├── services/
│       │   ├── strava.ts   # Strava API client
│       │   └── storage.ts  # Activity data persistence
│       └── types/
│           └── strava.ts   # Strava type definitions
├── public/                 # Static assets (generated)
├── package.json
├── .env.template           # Environment variables template
└── README.md
```

## API Routes

### Authentication Routes

| Route | Method | Description |
|-------|--------|-------------|
| `/auth` | GET | Initiates Strava OAuth flow - redirects to Strava authorization page |
| `/auth/callback` | GET | OAuth callback handler - exchanges authorization code for access token |

### API Routes

All `/api/*` routes require authentication.

| Route | Method | Description | Response |
|-------|--------|-------------|----------|
| `/api/activities` | GET | Returns all stored activities | Array of activity objects |
| `/api/sync` | POST | Fetches new activities from Strava | Sync result with count |

### Error Responses

- `401 Unauthorized` - Authentication failed or expired. Re-connect your Strava account.
- `500 Internal Server Error` - Server error during sync or data retrieval.

## Development

### Build Scripts

```bash
# Build client bundle
npm run build:client

# Build server TypeScript
npm run build:server

# Build both
npm run build
```

### Testing

```bash
# Run tests in watch mode
npm test

# Run tests with coverage
npm run test:ci
```

## License

ISC
