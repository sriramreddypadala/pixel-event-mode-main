# Event Mode Flow - File Structure

## 📋 Current Flow

```
IDLE → GRID SELECTION → CAPTURE → PREVIEW → PRINTING → QR → THANK YOU
```

## 📁 File Structure by Flow

### 1️⃣ Idle Screen
**Route:** `/`  
**File:** `src/pages/machine/IdleScreen.tsx`  
**Purpose:** Welcome screen with "Tap to Start" button  
**Features:** Print counter display (top-right corner)  
**Navigation:** → `/setup` (Grid Selection)

---

### 2️⃣ Grid Selection
**Route:** `/setup`  
**File:** `src/pages/machine/SetupScreen.tsx`  
**Purpose:** Choose from 4 fixed grid layouts  
**Grid Definitions:** `src/types/grid.ts` (FIXED_GRID_TEMPLATES)  
**Grid Component:** `src/components/machine/GridSelector.tsx`  
**Navigation:** 
- Back → `/` (Idle)
- Continue → `/capture` (Capture)

**Available Grids:**
1. 2×6" Vertical Strip (2 photos) - ₹70
2. 2×6" Duplicate Strips (4 photos) - ₹100
3. 4×6" Single Photo (1 photo) - ₹50
4. 4×6" Grid 2×2 (4 photos) - ₹100

---

### 3️⃣ Capture Screen
**Route:** `/capture`  
**File:** `src/pages/machine/CaptureScreen.tsx`  
**Purpose:** Take photos using camera  
**Components:**
- `src/components/machine/PoseSuggestionOverlay.tsx`
- `src/components/machine/PhotoPreview.tsx`

**Navigation:** → `/preview` (Preview)

---

### 4️⃣ Preview Screen
**Route:** `/preview`  
**File:** `src/pages/machine/PreviewScreen.tsx`  
**Purpose:** Review photos in selected grid layout  
**Components:**
- `src/components/machine/GridRenderer.tsx`

**Navigation:**
- Cancel → `/setup` (Grid Selection)
- Retake → `/capture` (Capture)
- Confirm → `/printing` (Printing)

---

### 5️⃣ Printing Screen
**Route:** `/printing`  
**File:** `src/pages/machine/PrintingScreen.tsx`  
**Purpose:** Simulate printing process with progress bar  
**Features:** Automatically increments print counter when complete  
**Navigation:** → `/qr` (QR Code) - Auto-advance after 100%

---

### 6️⃣ QR Screen
**Route:** `/qr`  
**File:** `src/pages/machine/QRScreen.tsx`  
**Purpose:** Display QR code for photo download  
**Navigation:** → `/thankyou` (Thank You) - Auto-advance after 60s or manual

---

### 7️⃣ Thank You Screen
**Route:** `/thankyou`  
**File:** `src/pages/machine/ThankYouScreen.tsx`  
**Purpose:** Final screen, session complete  
**Navigation:** → `/` (Idle) - Auto-advance

---

## 🗂️ Core Files

### App Configuration
- **`src/App.tsx`** - Main app with routing (event mode only)
- **`src/store/machineStore.ts`** - Session state & print counter
- **`src/store/gridStore.ts`** - Grid selection state
- **`src/store/boothStore.ts`** - Booth identity

### Grid System
- **`src/types/grid.ts`** - Grid type definitions + FIXED_GRID_TEMPLATES
- **`src/components/machine/GridRenderer.tsx`** - Renders photos in grid
- **`src/components/machine/GridSelector.tsx`** - Grid selection UI
- **`src/utils/gridRenderer.ts`** - 300 DPI rendering engine

### UI Components
- **`src/components/ui/GlassButton.tsx`** - Glassmorphism buttons
- **`src/components/ui/GlassPanel.tsx`** - Glassmorphism panels
- **`src/components/effects/VideoBackground.tsx`** - Background video
- **`src/components/effects/TouchRippleEffect.tsx`** - Touch interactions

### Assets
- **`src/assets/bg.mp4`** - Background video
- **`src/assets/pixel.jpg`** - Logo image

---

## 🔄 Navigation Summary

```
┌─────────────┐
│    IDLE     │ ──────────────────────┐
└─────────────┘                       │
       │                              │
       ↓                              │
┌─────────────┐                       │
│    GRID     │ ←─────────┐           │
│  SELECTION  │           │           │
└─────────────┘           │           │
       │                  │           │
       ↓                  │           │
┌─────────────┐           │           │
│   CAPTURE   │ ──────────┘           │
└─────────────┘                       │
       │                              │
       ↓                              │
┌─────────────┐                       │
│   PREVIEW   │ ──────────────────────┤
└─────────────┘                       │
       │                              │
       ↓                              │
┌─────────────┐                       │
│  PRINTING   │                       │
└─────────────┘                       │
       │                              │
       ↓                              │
┌─────────────┐                       │
│     QR      │                       │
└─────────────┘                       │
       │                              │
       ↓                              │
┌─────────────┐                       │
│  THANK YOU  │ ──────────────────────┘
└─────────────┘
```

---

## 📊 State Management

### Machine Store (`useMachineStore`)
- Session data (photos, layout, copies)
- Mode (event/normal)
- Print count tracking
- Session lifecycle (start/end)

### Grid Store (`useGridStore`)
- Fixed grid templates (4 layouts)
- Active grid selection
- Pending grid (for session-safe switching)

### Booth Store (`useBoothStore`)
- Booth identity (ID, name)
- One-time setup

---

## ✅ Implementation Status

- [x] Event mode only (no admin)
- [x] Fixed grid layouts (4 options)
- [x] Complete flow: Idle → Grid → Capture → Preview → Print → QR → Thank You
- [x] All navigation paths updated
- [x] Background video (bg.mp4)
- [x] Session management
- [x] Grid rendering at 300 DPI
- [x] Touch-optimized UI
- [x] Print counter display
