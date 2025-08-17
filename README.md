# WhatsTask Frontend

A modern, modular React frontend for the WhatsTask platform, featuring task management and WhatsApp integration.

## 🚀 Features

- **Modular Architecture**: Clean separation of concerns with module-based organization
- **Task Management**: Create, edit, and manage tasks with real-time updates
- **WhatsApp Integration**: Monitor service health and send test messages
- **System Overview**: Real-time monitoring of modules and event statistics
- **Authentication**: Secure login/logout with JWT tokens
- **Responsive Design**: Mobile-first design with Tailwind CSS

## 🏗️ Architecture

```
src/
├── modules/           # Feature modules
│   ├── auth/         # Authentication module
│   ├── tasks/        # Task management module
│   ├── whatsapp/     # WhatsApp integration module
│   └── system/       # System monitoring module
├── components/        # Shared UI components
├── stores/           # State management (Zustand)
├── lib/              # Utilities and API client
└── App.tsx           # Main application component
```

## 🛠️ Tech Stack

- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **Zustand** for state management
- **React Query** for server state management
- **Axios** for HTTP requests
- **React Router** for navigation

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd vitan-task-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Configure your backend API URL:
   ```env
   REACT_APP_API_BASE_URL=https://your-backend-url.com
   REACT_APP_USE_MODULAR_TASKS=true
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Build for production**
   ```bash
   npm run build
   ```

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

### Module Development

Each module follows a consistent structure:

```
modules/{module-name}/
├── api.ts           # API functions and types
├── store.ts         # Local state management
├── components/      # Module-specific components
├── views/           # Main view components
└── routes/          # Route definitions (if needed)
```

### Adding New Modules

1. Create the module directory structure
2. Implement the API layer
3. Create the store for state management
4. Build the UI components
5. Add routes to the main App component

## 🌐 API Integration

The frontend integrates with the modular backend via:

- **Auth Module**: `/api/modules/auth/*`
- **Tasks Module**: `/api/modules/tasks/*` (with legacy fallback)
- **WhatsApp Module**: `/api/modules/whatsapp/*`
- **System Module**: `/api/modules/*` and `/api/events/*`

## 🎨 UI Components

- **AppShell**: Main application layout with navigation
- **Toast System**: Notification system for user feedback
- **TaskCard**: Individual task display with inline editing
- **LoginForm**: Authentication form with email/phone support

## 🔐 Authentication

- JWT-based authentication
- Automatic token refresh
- Protected routes
- Persistent login state

## 📱 Responsive Design

- Mobile-first approach
- Responsive grid layouts
- Touch-friendly interactions
- Accessible components

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests in watch mode
npm test -- --watch
```

## 🚀 Deployment

### Railway Deployment

1. Connect your Railway account
2. Set environment variables
3. Deploy automatically on push to main branch

### Environment Variables

- `REACT_APP_API_BASE_URL`: Backend API URL
- `REACT_APP_USE_MODULAR_TASKS`: Enable modular task endpoints
- `NODE_ENV`: Environment (development/production)

## 📊 Performance

- **Code Splitting**: Lazy-loaded modules
- **Optimistic Updates**: Immediate UI feedback
- **Efficient Re-renders**: React Query for server state
- **Bundle Optimization**: Vite for fast builds

## 🔍 Troubleshooting

### Common Issues

1. **Module not loading**: Check API endpoints and authentication
2. **Build errors**: Ensure all dependencies are installed
3. **API errors**: Verify backend URL and CORS configuration

### Debug Mode

Enable debug logging by setting:
```env
REACT_APP_DEBUG=true
```

## 🤝 Contributing

1. Follow the modular architecture pattern
2. Use TypeScript for type safety
3. Follow the established component patterns
4. Test your changes thoroughly
5. Update documentation as needed

## 📄 License

MIT License - see LICENSE file for details

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the backend documentation
- Review the API endpoints
