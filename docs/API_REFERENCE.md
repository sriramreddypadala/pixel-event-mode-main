# API Reference

## 📡 Endpoints

### Machine Management

#### GET `/api/machine/config`
Get machine configuration.

**Headers:**
- `X-Machine-ID`: Machine identifier
- `Content-Type`: application/json

**Response:**
```json
{
  "success": true,
  "data": {
    "config": {
      "mode": "EVENT" | "NORMAL",
      "activeGridId": "string",
      "price": number,
      "theme": "string"
    }
  }
}
```

#### POST `/api/machine/sync-print-count`
Sync print counter.

**Request:**
```json
{
  "machineId": "string",
  "totalPrints": number,
  "eventPrints": number,
  "normalPrints": number,
  "timestamp": number
}
```

**Response:**
```json
{
  "success": true,
  "message": "Print count synced"
}
```

---

### Booth Management

#### POST `/api/booth/register`
Register booth identity.

**Request:**
```json
{
  "boothId": "string",
  "boothName": "string"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "boothId": "string",
    "boothName": "string",
    "installDate": "ISO string"
  }
}
```

---

### Photo Upload (Optional)

#### POST `/api/photos/upload`
Upload session photos.

**Request:** FormData with photos

**Response:**
```json
{
  "success": true,
  "data": {
    "sessionId": "string",
    "photoUrls": ["string"],
    "downloadUrl": "string"
  }
}
```

---

## 📊 Data Models

### GridTemplate
```typescript
{
  id: string;
  name: string;
  stillCount: number;
  price: number;
  aspectRatio: string;
  canvasWidth: number;
  canvasHeight: number;
  previewType: 'grid' | 'strip' | 'collage';
  backgroundColor?: string;
  slots: GridSlot[];
  isEnabled: boolean;
  sortOrder: number;
  createdAt: number;
  updatedAt: number;
}
```

### GridSlot
```typescript
{
  id: string;
  x: number;        // percentage (0-100)
  y: number;        // percentage (0-100)
  width: number;    // percentage (0-100)
  height: number;   // percentage (0-100)
  radius?: number;  // border radius in pixels
  zIndex?: number;  // layer order
}
```

### SessionData
```typescript
{
  sessionId: string;
  layout: GridTemplate | null;
  copies: number;
  photos: CapturedPhoto[];
  mode: 'EVENT' | 'NORMAL';
  startTime: number;
}
```

### CapturedPhoto
```typescript
{
  id: string;
  dataUrl: string;
  timestamp: number;
  frameNumber: number;
}
```

### PrintStats
```typescript
{
  totalPrints: number;
  eventPrints: number;
  normalPrints: number;
  paperRemaining: number;
  lastPrintTime?: number;
}
```

---

## 🔧 Configuration

### API_CONFIG
```typescript
{
  BASE_URL: string;
  MACHINE_ID: string;
  TIMEOUT: number;
}
```

### Environment Variables
- `VITE_API_URL` - Backend API URL
- `VITE_MACHINE_ID` - Machine identifier

---

## 🐛 Error Responses

### Standard Error Format
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable message"
  }
}
```

### Common Error Codes
- `INVALID_MACHINE_ID` - Machine not found
- `INVALID_REQUEST` - Bad request data
- `SERVER_ERROR` - Internal server error
- `NETWORK_ERROR` - Connection failed
