# 📚 Event Mode Photo Booth - Documentation

Welcome to the Pixxel8 Event Mode Photo Booth documentation!

## 📖 Documentation Files

### 1. [Event Mode Flow](./EVENT_MODE_FLOW.md)
Complete overview of the 7-step user flow, file structure, and navigation paths.

### 2. [Backend Integration Guide](./BACKEND_INTEGRATION.md)
Step-by-step guide for connecting the frontend to a backend API.

### 3. [Fixed Grid System](./FIXED_GRID_SYSTEM.md)
Documentation of the 4 fixed grid layouts and rendering system.

### 4. [API Reference](./API_REFERENCE.md)
Complete API endpoint documentation and data models.

### 5. [Deployment Guide](./DEPLOYMENT.md)
Instructions for building and deploying the application.

## 🚀 Quick Start

1. **Development:**
   ```bash
   npm install
   npm run dev
   ```

2. **Production Build:**
   ```bash
   npm run build
   ```

3. **Preview Build:**
   ```bash
   npm run preview
   ```

## 🎯 Application Overview

**Event Mode Photo Booth** is a streamlined photo booth application with:
- 4 fixed grid layouts (no customization)
- 7-step user flow
- Print counter tracking
- 300 DPI print-ready output
- Touch-optimized UI

## 📁 Project Structure

```
src/
├── pages/machine/      # 7 event mode screens
├── components/
│   ├── machine/        # Photo booth components
│   ├── ui/             # Reusable UI components
│   └── effects/        # Visual effects
├── store/              # State management (Zustand)
├── services/           # API services
├── types/              # TypeScript types
└── utils/              # Utility functions
```

## 🔗 Key Features

- ✅ Event mode only (no admin portal)
- ✅ Fixed grid layouts (4 options)
- ✅ Automatic print counter
- ✅ Session management
- ✅ 300 DPI rendering
- ✅ Offline-first architecture

## 📞 Support

For questions or issues, refer to the specific documentation files above.
