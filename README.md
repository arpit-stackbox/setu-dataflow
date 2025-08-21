# Setu DataFlow Operations Dashboard

A production-ready frontend monitoring dashboard for Setu ETL routines and data operations. Built with Next.js 15, TypeScript, and enterprise-grade architecture patterns. This is a **pure frontend application** with mock data for demonstration and development purposes.

## 🚀 Features

- **Real-time Monitoring**: Monitor ETL routines with live status updates
- **Advanced Filtering**: Search and filter by routine type, status, and metadata
- **Responsive Design**: Optimized for desktop and mobile devices
- **Error Handling**: Comprehensive error boundary and logging system
- **Performance**: Optimized with caching, lazy loading, and code splitting
- **Security**: Security headers, input validation, and XSS protection
- **Production Ready**: Docker support and monitoring integration

## 📋 Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript with strict type checking
- **Styling**: Tailwind CSS with 8-point grid system
- **UI Components**: shadcn/ui with Radix primitives
- **State Management**: React hooks with optimistic updates
- **Error Monitoring**: Sentry integration
- **Testing**: Jest + React Testing Library + Playwright
- **Deployment**: Docker with multi-stage builds

## 🏗 Architecture

```
src/
├── app/                    # Next.js app router pages
├── components/            # Reusable UI components
│   ├── common/           # Common components (ErrorBoundary, etc.)
│   ├── layout/          # Layout components
│   └── ui/              # shadcn/ui components
├── config/              # Application configuration
├── hooks/               # Custom React hooks
├── lib/                # Utility libraries
│   ├── errors.ts       # Error handling and logging
│   ├── mock-routines.ts # Mock routine data
│   └── utils.ts        # Common utilities
├── services/           # Mock data services
│   └── mock-routine-service.ts  # Simulated API service
├── types/              # TypeScript type definitions
└── __tests__/          # Test files
```

## 🚀 Quick Start

### Prerequisites

- Node.js 20 or higher
- npm or yarn
- Docker (optional)

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd setu-dataflow
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Run the development server**

   ```bash
   npm run dev
   ```

4. **Open in browser**
   ```
   http://localhost:3000
   ```

**Note:** Environment variables are optional. The app works out of the box with mock data.

### Docker Development

```bash
# Build and run with Docker Compose
docker-compose up -d

# View logs
docker-compose logs -f app
```

## 🔧 Configuration

### Environment Variables

Optional environment variables for enhanced features:

```bash
# Feature Flags (Optional)
ENABLE_ANALYTICS=true
ENABLE_DARK_MODE=true

# Mock Data Configuration (Optional)
MOCK_DELAY_MS=1000
MOCK_ERROR_RATE=0.1
```

ENABLE_REAL_TIME_UPDATES=true
ENABLE_ADVANCED_FILTERS=true

````

**Note**: All environment variables are optional for basic functionality as the app uses mock data.

See `.env.example` for all available configuration options.

### Feature Flags

Control features using environment variables:

```bash
ENABLE_ANALYTICS=true
ENABLE_REAL_TIME_UPDATES=true
ENABLE_ADVANCED_FILTERS=true
````

## 🧪 Testing

### Unit Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### End-to-End Tests

```bash
# Run E2E tests
npm run test:e2e

# Run E2E tests in UI mode
npm run test:e2e:ui
```

### Type Checking

```bash
# Check TypeScript types
npm run type-check
```

## 📦 Production Deployment

### Docker Production Build

```bash
# Build production image
docker build -t setu-dataflow .

# Run production container
docker run -p 3000:3000 setu-dataflow
```

### Manual Production Build

```bash
# Build for production
npm run build

# Start production server
npm start
```

## 🔍 Monitoring & Observability

### Error Tracking

The application integrates with Sentry for error tracking:

```bash
# Configure Sentry
SENTRY_DSN=your-sentry-dsn
SENTRY_ORG=setu
SENTRY_PROJECT=dataflow-ops
```

### Logging

Structured logging with different levels:

- **Development**: Console logging with colors
- **Production**: JSON structured logs

### Performance Monitoring

- Bundle analyzer for build optimization
- Performance metrics collection
- Real-time monitoring integration

## 🔒 Security

### Security Features

- **Content Security Policy**: Prevents XSS attacks
- **CSRF Protection**: Built-in CSRF protection
- **Input Validation**: Zod schema validation
- **Mock Data Validation**: Type-safe mock data handling

### Security Headers

Automatically applied security headers:

- `X-Frame-Options: DENY`
- `X-Content-Type-Options: nosniff`
- `X-XSS-Protection: 1; mode=block`
- `Referrer-Policy: origin-when-cross-origin`

## 🎯 Development Workflow

### Code Quality

```bash
# Lint code
npm run lint

# Fix lint issues
npm run lint:fix

# Format code
npm run format
```

### Git Hooks

Pre-commit hooks ensure code quality:

- ESLint checking
- TypeScript type checking
- Prettier formatting
- Test execution

### Component Development

Components follow these patterns:

- **Functional components** with hooks
- **TypeScript interfaces** for all props
- **Error boundaries** for error handling
- **Loading states** for async operations
- **Accessibility** best practices

## 📊 Performance

### Optimization Features

- **Code Splitting**: Automatic route-based splitting
- **Image Optimization**: Next.js Image component
- **Bundle Analysis**: Webpack bundle analyzer
- **Mock Data Caching**: In-memory data caching
- **Compression**: Gzip compression enabled

### Performance Targets

- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Cumulative Layout Shift**: < 0.1
- **First Input Delay**: < 100ms

## 🤝 Contributing

### Development Setup

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Run the test suite
6. Submit a pull request

### Code Standards

- Follow TypeScript strict mode
- Use functional components with hooks
- Write comprehensive tests
- Document complex logic
- Follow the existing architecture patterns

## 🆘 Troubleshooting

### Common Issues

1. **Port already in use**

   ```bash
   # Kill process on port 3000
   npx kill-port 3000
   ```

2. **Mock data issues**

   ```bash
   # Check if mock data is loading correctly
   # All data should be available without external dependencies
   ```

3. **Build failures**
   ```bash
   # Clear Next.js cache
   rm -rf .next
   npm run build
   ```

### Debug Mode

Enable debug logging:

```bash
DEBUG=setu:* npm run dev
```

## 📞 Support

For support and questions:

- **Internal Slack**: #dataflow-ops
- **Documentation**: [Internal Wiki](link-to-wiki)
- **Issues**: Create GitHub issues for bugs and feature requests

## 📄 License

This project is proprietary software owned by Setu. All rights reserved.

---

Built with ❤️ by the Setu Engineering Team
