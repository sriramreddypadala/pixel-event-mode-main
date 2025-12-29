# Pixxel8 Photo Booth System

A complete, production-ready photo booth management system with touch-optimized kiosk software and comprehensive admin portal.

## 🎯 System Overview

Pixxel8 consists of two main applications:

1. **Machine Software** - Touch-screen kiosk interface for photo booth operations
2. **Admin Portal** - Web-based management dashboard for configuration and monitoring

## 🏗️ Architecture

### Tech Stack

- **Frontend Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with custom design system
- **Animations**: Framer Motion + Lottie
- **State Management**: Zustand with persistence
- **Routing**: React Router v6
- **QR Generation**: qrcode.react
- **Icons**: Lucide React

### Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Base UI components (Button, Card, Input, etc.)
│   ├── machine/        # Machine-specific components
│   └── admin/          # Admin-specific components
├── pages/              # Application pages
│   ├── machine/        # Kiosk screens
│   └── admin/          # Admin portal pages
├── store/              # Zustand state management
│   ├── machineStore.ts # Machine state & session management
│   └── adminStore.ts   # Admin authentication & settings
├── services/           # API integration layer
│   ├── api.service.ts  # Core API client
│   ├── auth.service.ts # Authentication
│   ├── machine.service.ts
│   ├── content.service.ts
│   └── analytics.service.ts
├── types/              # TypeScript type definitions
│   ├── index.ts        # Core types
│   └── api.ts          # API contract types
├── utils/              # Utility functions
│   ├── helpers.ts      # Common helpers
│   └── mockData.ts     # Mock data for development
└── config/             # Configuration files
    └── api.config.ts   # API endpoints & settings
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Start development server
npm run dev
```

### Environment Variables

Create a `.env` file with:

```env
VITE_API_BASE_URL=http://localhost:8000/api
VITE_MACHINE_ID=machine-001
VITE_ENABLE_MOCK_API=true
```

## 📱 Machine Software (Kiosk)

### Operating Modes

**NORMAL MODE** (Paid)
- Payment required before printing
- Standard pricing applies
- Full session flow with payment screen

**EVENT MODE** (Free)
- No payment required
- Skips payment screen
- Event-specific branding and messages
- Separate print counter

### Screen Flow

1. **Idle Screen** - Looping video with "Touch to Start"
2. **Setup Screen** - Layout selection & copy count
3. **Capture Screen** - Photo capture with countdown
4. **Payment Screen** - Payment processing (Normal mode only)
5. **Printing Screen** - Print progress with animation
6. **QR Screen** - Digital copy download (optional)
7. **Thank You Screen** - Customizable thank you message

### Features

- ✅ Touch-optimized UI with large hit targets
- ✅ Fullscreen kiosk mode
- ✅ Offline-tolerant with local persistence
- ✅ Real-time photo preview
- ✅ Animated countdown timer
- ✅ Print count tracking (total, event, normal)
- ✅ Mode-based flow control
- ✅ Admin lock with password protection

### Accessing Machine Software

Navigate to: `http://localhost:3000/machine`

## 🎛️ Admin Portal

### Features

**Dashboard**
- Real-time statistics
- Machine status monitoring
- Recent activity feed
- Print count analytics

**Mode Management**
- Toggle between Normal/Event modes
- Event name and message configuration
- Event print counter reset
- Real-time sync status

**Content Management** (Placeholder)
- Opening video upload
- Promotional image manager
- Thank you message editor
- QR code enable/disable

**Layout Builder** (Placeholder)
- Visual layout designer
- Photo arrangement controls
- Color and font customization
- Logo placement

**Machine Management** (Placeholder)
- Multi-machine monitoring
- Remote ON/OFF control
- Health status tracking
- Paper and ink levels

**Analytics** (Placeholder)
- Machine-wise reports
- Event-wise statistics
- Date range filtering
- Export functionality

### Accessing Admin Portal

Navigate to: `http://localhost:3000/admin`

**Demo Credentials:**
- Email: `admin@pixxel8.com`
- Password: `admin123`

## 🔌 Backend Integration

### API Service Layer

The application includes a fully typed API service layer ready for backend integration:

```typescript
// Example: Syncing print count
import { machineService } from '@/services/machine.service';

await machineService.syncPrintCount({
  machineId: 'machine-001',
  totalPrints: 150,
  eventPrints: 50,
  normalPrints: 100,
  timestamp: Date.now()
});
```

### API Endpoints

All endpoints are defined in `src/config/api.config.ts`:

- **Authentication**: `/auth/login`, `/auth/logout`
- **Machine**: `/machine/config`, `/machine/mode`, `/machine/print-count`
- **Content**: `/content/update`, `/content/upload/video`
- **Analytics**: `/analytics`, `/analytics/export`

### Offline Support

- Automatic request queuing when offline
- Background sync when connection restored
- Local state persistence with Zustand

### Mock API Mode

Set `VITE_ENABLE_MOCK_API=true` to use mock responses during development.

## 🎨 Design System

### Colors

- **Primary**: Blue gradient (#0ea5e9 → #0284c7)
- **Accent**: Purple gradient (#d946ef → #c026d3)
- **Success**: Green (#10b981)
- **Warning**: Yellow (#f59e0b)
- **Error**: Red (#ef4444)

### Typography

- **Display**: Poppins (headings, hero text)
- **Body**: Inter (UI text, content)

### Components

All components follow consistent patterns:
- Framer Motion animations
- Dark mode support
- Touch-friendly sizing
- Accessibility compliant

## 📊 State Management

### Machine Store

```typescript
import { useMachineStore } from '@/store/machineStore';

const {
  mode,              // 'NORMAL' | 'EVENT'
  session,           // Current session data
  printStats,        // Print counters
  startSession,      // Initialize new session
  incrementPrintCount, // Update counters
} = useMachineStore();
```

### Admin Store

```typescript
import { useAdminStore } from '@/store/adminStore';

const {
  user,              // Current admin user
  isAuthenticated,   // Auth status
  theme,             // 'light' | 'dark'
  toggleTheme,       // Theme switcher
} = useAdminStore();
```

## 🔧 Development

### Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

### Code Quality

- TypeScript strict mode enabled
- ESLint configured
- Prettier ready
- No console warnings in production

## 🚢 Production Deployment

### Build

```bash
npm run build
```

Output: `dist/` directory

### Deployment Checklist

- [ ] Update `.env` with production API URL
- [ ] Set `VITE_ENABLE_MOCK_API=false`
- [ ] Configure machine ID per device
- [ ] Test offline functionality
- [ ] Verify payment integration
- [ ] Test all screen flows
- [ ] Check responsive layouts
- [ ] Validate dark mode
- [ ] Test touch interactions
- [ ] Verify print count persistence

### Recommended Hosting

- **Kiosk**: Electron app or fullscreen browser
- **Admin**: Vercel, Netlify, or any static host

## 🔐 Security

- Password-protected admin access
- Token-based authentication ready
- Secure local storage
- HTTPS recommended for production
- Environment variable protection

## 📝 Backend Requirements

The frontend expects the following from the backend:

### Authentication
- JWT token-based auth
- User roles (ADMIN, OPERATOR)
- Session management

### Machine API
- Config retrieval
- Mode updates with real-time sync
- Print count synchronization
- Status reporting

### Content API
- File uploads (video, images)
- Content URL management
- QR code data generation

### Analytics API
- Print statistics
- Machine health metrics
- Date-range queries
- Export functionality

## 🎯 Key Features Implemented

✅ Complete machine software with all screens
✅ Admin portal with authentication
✅ Mode-based flow control (Normal/Event)
✅ Offline-first architecture
✅ Print count tracking and persistence
✅ Touch-optimized kiosk UI
✅ Cinematic animations
✅ Dark mode support
✅ Fully typed codebase
✅ Backend-ready API layer
✅ QR code generation
✅ Responsive admin dashboard

## 🐛 Known Limitations

- Layout builder is placeholder (UI only)
- Content management is placeholder (UI only)
- Machine management is placeholder (UI only)
- Analytics is placeholder (UI only)
- Payment integration is mocked
- Camera is mocked (uses placeholder)
- Printer is simulated

## 📞 Support

For backend integration support or questions:
- Review API contracts in `src/types/api.ts`
- Check service implementations in `src/services/`
- Refer to mock data in `src/utils/mockData.ts`

## 📄 License

Proprietary - All rights reserved

---

**Built with ❤️ for Pixxel8**
