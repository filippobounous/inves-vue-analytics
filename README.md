# Investment Analytics Dashboard

A sophisticated, responsive investment analytics dashboard that connects to a FastAPI backend for comprehensive portfolio and security analysis.

## Features

### 🔍 Entity Management

- **Portfolio & Security Browser**: Add and manage multiple portfolios and securities
- **Real-time Validation**: Instant feedback on entity existence via backend API calls
- **Interactive Selection**: Easy-to-use interface with visual badges and removal options

### 📈 Analytics & Visualization

- **Price History**: Interactive line charts showing historical price movements
- **Returns Analysis**: Configurable return calculations with logarithmic options
- **Volatility Modeling**: Multiple volatility models (Simple, GARCH, EWMA)
- **Correlation Matrix**: Interactive heatmap with multiple correlation methods
- **Performance Metrics**: Comprehensive risk-adjusted performance indicators
- **Value-at-Risk (VaR)**: Multiple VaR calculation methods with confidence levels

### 🎨 Modern UI/UX

- **Dark/Light Theme Toggle**: Professional financial interface optimized for data analysis
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Glass Morphism**: Modern visual effects with backdrop blur and transparency
- **Animated Transitions**: Smooth state changes and loading indicators
- **Professional Typography**: Optimized for financial data display

## Technology Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS with custom design system
- **Charts**: Recharts for interactive data visualization
- **UI Components**: shadcn/ui component library
- **State Management**: React hooks with real-time API integration
- **API Integration**: RESTful API service with TypeScript interfaces

## Quick Start

### Prerequisites

- Node.js 18+ and npm
- FastAPI backend running (see backend setup below)

### Installation

1. **Clone and install**:

   ```bash
   git clone <repository-url>
   cd investment-analytics-dashboard
   npm install
   ```

2. **Environment Setup**:

   ```bash
   cp .env.example .env
   ```

   Edit `.env` and configure:

   ```env
   VITE_API_URL=http://localhost:8000
   VITE_API_KEY=your_api_key_here
   ```

3. **Start the dashboard**:
   ```bash
   npm run dev
   ```

### Backend Setup

1. **Start the FastAPI backend**:

   ```bash
   cd /workspace/fbinv
   uvicorn api.investment.main:app --host 0.0.0.0 --port 8000 --reload
   ```

2. **Verify API connection**:
   - Dashboard will show connection status in the footer
   - Test with a sample portfolio or security code

## Docker

### Production

1. Ensure `.env` is configured.
2. Build and run the container:
   ```bash
   docker compose up --build
   ```
   The dashboard will be available at http://localhost:5173.

### Development

Use the dev compose file for hot reloading:

```bash
   docker compose -f docker-compose.dev.yml up --build
```

## API Integration

The dashboard connects to these FastAPI endpoints:

### Core Endpoints

- `GET /core/portfolio/{code}` - Get portfolio metadata
- `GET /core/security/{code}` - Get security metadata
- `POST /core/portfolio` - Bulk portfolio lookup
- `POST /core/security` - Bulk security lookup

### Analytics Endpoints

- `POST /analytics/prices` - Historical price data
- `POST /analytics/returns` - Return calculations
- `POST /analytics/realised-volatility` - Volatility modeling
- `POST /analytics/correlations` - Correlation analysis
- `POST /analytics/metrics` - Performance metrics
- `POST /analytics/var` - Value-at-Risk calculations

All requests automatically include the `X-API-Key` header using the configured API key.

## Dashboard Sections

### 1. Overview Tab

- Combined price and returns visualization
- Quick insights panel
- Summary statistics

### 2. Prices & Returns Tab

- Detailed price history charts
- Configurable return analysis
- Rolling window calculations
- Logarithmic return options

### 3. Volatility Tab

- Realised volatility time series
- Multiple volatility models
- Configurable window sizes
- Model comparison tools

### 4. Correlations Tab

- Interactive correlation heatmap
- Multiple correlation methods (Pearson, Spearman, Kendall)
- Configurable parameters
- Color-coded correlation strength

### 5. Risk Metrics Tab

- Performance metrics for each entity
- Sharpe ratio, Alpha, Beta calculations
- Maximum drawdown analysis
- Risk-adjusted returns

### 6. VaR Analysis Tab

- Value-at-Risk calculations
- Multiple confidence levels (90%, 95%, 99%)
- Various methods (Historical, Parametric, Monte Carlo)
- Risk severity indicators

## Customization

### Design System

The dashboard uses a comprehensive design system defined in `src/index.css`:

- **Colors**: Professional financial color palette with semantic tokens
- **Typography**: Optimized for numerical data display
- **Animations**: Smooth transitions and loading states
- **Glass Effects**: Modern transparency and blur effects

### API Configuration

Modify `src/services/api.ts` to:

- Add new endpoints
- Customize request/response handling
- Implement caching strategies
- Add error recovery mechanisms

### Chart Customization

Charts are built with Recharts and can be customized in component files:

- Color schemes in the design system
- Chart types and interactions
- Tooltip formatting
- Legend configurations

## Development

### Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── ui/              # shadcn/ui components
│   ├── EntitySelector.tsx
│   ├── PriceChart.tsx
│   └── ...
├── services/            # API integration
│   └── api.ts
├── pages/               # Main pages
│   └── Index.tsx
├── hooks/               # Custom React hooks
└── lib/                 # Utilities
```

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Contributing

1. Follow the established design system
2. Use TypeScript for all new code
3. Add proper error handling
4. Include loading states
5. Test with actual backend data

## Deployment

### Production Build

```bash
npm run build
```

### Environment Variables

Ensure production environment has:

- `VITE_API_URL` - Production API URL
- `VITE_API_KEY` - Production API key

### Backend Considerations

- Ensure FastAPI backend is accessible from frontend domain
- Configure CORS settings appropriately
- Set up proper authentication and rate limiting

## Troubleshooting

### Common Issues

1. **API Connection Failed**:
   - Verify backend is running on correct port
   - Check API key configuration
   - Ensure CORS is configured properly

2. **Charts Not Displaying**:
   - Check browser console for errors
   - Verify data format from API
   - Ensure Recharts components are properly imported

3. **Styling Issues**:
   - Verify Tailwind CSS is building correctly
   - Check for design system token usage
   - Ensure all custom CSS variables are defined

### Performance Optimization

- API responses are cached automatically
- Charts use responsive containers
- Loading states prevent UI blocking
- Error boundaries catch rendering issues

## License

This project is part of the FastAPI investment backend integration and follows the same licensing terms.
