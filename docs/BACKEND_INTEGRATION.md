# Backend Integration Guide

## 🎯 Overview

This guide provides complete instructions for integrating the event mode photo booth frontend with a backend server.

## 📡 Required API Endpoints

### 1. Machine Configuration

#### GET `/api/machine/config`
Get machine configuration.

**Headers:**
```
X-Machine-ID: <machine-id>
Content-Type: application/json
```

**Response:**
```json
{
  "success": true,
  "data": {
    "config": {
      "mode": "EVENT",
      "activeGridId": "strip_2x6_2photos",
      "price": 70,
      "theme": "dark-premium"
    }
  }
}
```

---

### 2. Print Counter Sync

#### POST `/api/machine/sync-print-count`
Sync print counter with backend.

**Headers:**
```
X-Machine-ID: <machine-id>
Content-Type: application/json
```

**Request:**
```json
{
  "machineId": "machine-001",
  "totalPrints": 150,
  "eventPrints": 120,
  "normalPrints": 30,
  "timestamp": 1703520000000
}
```

**Response:**
```json
{
  "success": true,
  "message": "Print count synced successfully"
}
```

---

### 3. Booth Registration

#### POST `/api/booth/register`
Register booth identity (one-time setup).

**Request:**
```json
{
  "boothId": "booth-001",
  "boothName": "Main Hall Booth"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "boothId": "booth-001",
    "boothName": "Main Hall Booth",
    "installDate": "2024-01-15T10:00:00Z"
  }
}
```

---

### 4. Photo Upload (Optional)

#### POST `/api/photos/upload`
Upload photos to cloud storage.

**Request:** FormData with photos

**Response:**
```json
{
  "success": true,
  "data": {
    "sessionId": "session-1703520000000",
    "photoUrls": [
      "https://cdn.example.com/photo1.jpg",
      "https://cdn.example.com/photo2.jpg"
    ],
    "downloadUrl": "https://example.com/download/session-1703520000000"
  }
}
```

---

## 🔌 Integration Points

### 1. Machine Service

**File:** `src/services/machine.service.ts`

**Update with real API calls:**

```typescript
import { API_CONFIG } from '@/config/api.config';

export const machineService = {
  async getConfig() {
    const response = await fetch(
      `${API_CONFIG.BASE_URL}/api/machine/config`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-Machine-ID': API_CONFIG.MACHINE_ID,
        },
      }
    );
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    return await response.json();
  },

  async syncPrintCount(data: PrintCountSync) {
    const response = await fetch(
      `${API_CONFIG.BASE_URL}/api/machine/sync-print-count`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Machine-ID': API_CONFIG.MACHINE_ID,
        },
        body: JSON.stringify(data),
      }
    );
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    return await response.json();
  },
};
```

---

### 2. Booth Service

**File:** `src/services/booth.service.ts`

```typescript
import { API_CONFIG } from '@/config/api.config';

export const boothService = {
  async registerBooth(boothId: string, boothName: string) {
    const response = await fetch(
      `${API_CONFIG.BASE_URL}/api/booth/register`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ boothId, boothName }),
      }
    );
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    return await response.json();
  },
};
```

---

## 🔧 Configuration

### Update API Config

**File:** `src/config/api.config.ts`

```typescript
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  MACHINE_ID: import.meta.env.VITE_MACHINE_ID || 'machine-001',
  TIMEOUT: 10000,
};
```

### Environment Variables

**Create `.env` file:**

```env
VITE_API_URL=https://your-backend-api.com
VITE_MACHINE_ID=your-unique-machine-id
```

---

## 🐛 Error Handling

### Add Retry Logic

```typescript
async function fetchWithRetry(
  url: string,
  options: RequestInit,
  retries = 3
): Promise<Response> {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url, options);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return response;
    } catch (error) {
      if (i === retries - 1) throw error;
      // Exponential backoff
      await new Promise(resolve => 
        setTimeout(resolve, 1000 * Math.pow(2, i))
      );
    }
  }
  throw new Error('Max retries reached');
}
```

### Handle Network Errors

```typescript
try {
  await machineService.syncPrintCount(data);
} catch (error) {
  console.error('Failed to sync print count:', error);
  // App continues to work offline
  // Will retry on next sync attempt
}
```

---

## ✅ Testing Checklist

### Before Integration
- [ ] All screens work correctly
- [ ] Navigation flows properly
- [ ] Print counter increments
- [ ] Photos capture successfully
- [ ] Grid rendering works
- [ ] Session management works

### After Integration
- [ ] Machine config loads from backend
- [ ] Print count syncs to backend
- [ ] Booth registration works
- [ ] Error handling works
- [ ] Retry logic works
- [ ] Offline mode works gracefully

---

## 🚀 Deployment

### 1. Build Production Bundle

```bash
npm run build
```

### 2. Set Environment Variables

On your hosting platform (Vercel, Netlify, etc.):
- `VITE_API_URL` = Your backend API URL
- `VITE_MACHINE_ID` = Unique machine identifier

### 3. Deploy

```bash
# Vercel
vercel --prod

# Netlify
netlify deploy --prod

# Or copy dist/ folder to your server
```

---

## 📊 Data Flow

```
User Action
    ↓
Frontend Component
    ↓
Store (Zustand)
    ↓
Service Layer
    ↓
Backend API
    ↓
Database
```

---

## 🔐 Security

1. **API Authentication:**
   - Use API keys or JWT tokens
   - Validate machine ID on backend

2. **Rate Limiting:**
   - Limit API calls per machine
   - Prevent abuse

3. **Data Validation:**
   - Validate all inputs on backend
   - Sanitize photo uploads

---

## 📱 Offline Support

The app works offline by default:
- ✅ Print counter stored in localStorage
- ✅ Grid selection stored locally
- ✅ Photos stored in session state

When online:
- Sync print count to backend
- Upload photos (optional)
- Load remote config

---

## ✨ Summary

**Ready for Integration:**
- ✅ Frontend is bug-free
- ✅ State management working
- ✅ Service layer prepared
- ✅ Error handling ready
- ✅ Print counter functional

**Next Steps:**
1. Set up backend API
2. Update service files
3. Configure environment variables
4. Test integration
5. Deploy to production
