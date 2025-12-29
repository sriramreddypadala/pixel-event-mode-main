# Fixed Grid System Documentation

## 📐 Overview

The Pixxel8 Event Mode uses **4 fixed, non-customizable grid layouts** for print-ready output at 300 DPI.

## 🎨 Available Grid Layouts

### 1. 2×6 Inch Vertical Strip (2 Photos)

**Specifications:**
- **ID:** `strip_2x6_2photos`
- **Size:** 2×6 inches (600×1800 pixels @ 300 DPI)
- **Orientation:** Vertical
- **Photo Count:** 2 photos
- **Layout:** One photo on top, one below
- **Price:** ₹70

**Slot Configuration:**
```typescript
slots: [
  { id: 's1', x: 5, y: 5, width: 90, height: 47, radius: 0 },
  { id: 's2', x: 5, y: 53, width: 90, height: 47, radius: 0 }
]
```

---

### 2. 2×6 Inch Duplicate Strips (4 Photos)

**Specifications:**
- **ID:** `strip_2x6_4photos_duplicate`
- **Size:** 4×6 inches (1200×1800 pixels @ 300 DPI)
- **Orientation:** Two vertical strips side-by-side
- **Photo Count:** 4 photos (2 photos duplicated in each strip)
- **Layout:** Two identical 2×6 strips
- **Price:** ₹100

**Slot Configuration:**
```typescript
slots: [
  // Left strip
  { id: 's1', x: 2.5, y: 5, width: 45, height: 47, radius: 0 },
  { id: 's2', x: 2.5, y: 53, width: 45, height: 47, radius: 0 },
  // Right strip (duplicate)
  { id: 's3', x: 52.5, y: 5, width: 45, height: 47, radius: 0 },
  { id: 's4', x: 52.5, y: 53, width: 45, height: 47, radius: 0 }
]
```

---

### 3. 4×6 Inch Single Photo

**Specifications:**
- **ID:** `single_4x6`
- **Size:** 4×6 inches (1200×1800 pixels @ 300 DPI)
- **Orientation:** Standard photo print
- **Photo Count:** 1 photo
- **Layout:** Photo fills entire frame
- **Price:** ₹50

**Slot Configuration:**
```typescript
slots: [
  { id: 's1', x: 5, y: 5, width: 90, height: 90, radius: 0 }
]
```

---

### 4. 4×6 Inch Grid (4 Photos)

**Specifications:**
- **ID:** `grid_4x6_2x2`
- **Size:** 4×6 inches (1200×1800 pixels @ 300 DPI)
- **Orientation:** Standard photo print
- **Photo Count:** 4 photos
- **Layout:** 2×2 grid (2 rows × 2 columns)
- **Price:** ₹100

**Slot Configuration:**
```typescript
slots: [
  { id: 's1', x: 5, y: 5, width: 45, height: 45, radius: 0 },
  { id: 's2', x: 52.5, y: 5, width: 45, height: 45, radius: 0 },
  { id: 's3', x: 5, y: 52.5, width: 45, height: 45, radius: 0 },
  { id: 's4', x: 52.5, y: 52.5, width: 45, height: 45, radius: 0 }
]
```

---

## 🚫 Strict Rules

### NOT Allowed
- ❌ Grid size cannot change
- ❌ Photo count cannot change
- ❌ Orientation cannot change
- ❌ No drag-and-drop
- ❌ No auto-layout
- ❌ No responsive adjustments
- ❌ No admin or user edits
- ❌ No custom grid creation

### Allowed Changes
- ✅ Photos inside the slots may change
- ✅ Branding/logo may change (if implemented)
- ✅ QR code content may change
- ✅ Colors outside photo area may change

---

## 🖨️ Rendering System

### DPI Standards

```typescript
export const DPI_PRESETS = {
  SCREEN: 72,           // For UI preview
  PRINT_STANDARD: 300,  // For printing (default)
  PRINT_HIGH: 600,      // High quality (optional)
};
```

### Rendering Functions

**Preview (72 DPI):**
```typescript
const preview = await generateGridPreview(grid, photos);
```

**Print (300 DPI):**
```typescript
const printImage = await generatePrintGrid(grid, photos);
```

**QR Code (300 DPI):**
```typescript
const qrImage = await generateQRGrid(grid, photos);
```

---

## 📏 Pixel Calculations

### Conversion Formula
```
pixels = inches × DPI
```

### Examples
- 2 inches @ 300 DPI = 600 pixels
- 6 inches @ 300 DPI = 1800 pixels
- 4 inches @ 300 DPI = 1200 pixels

### Grid Dimensions
| Layout | Inches | Pixels @ 300 DPI |
|--------|--------|------------------|
| 2×6 Strip | 2×6 | 600×1800 |
| 4×6 Duplicate | 4×6 | 1200×1800 |
| 4×6 Single | 4×6 | 1200×1800 |
| 4×6 Grid | 4×6 | 1200×1800 |

---

## 🎯 Usage

### Accessing Grids

```typescript
import { useGridStore } from '@/store/gridStore';

const { templates, activeGrid } = useGridStore();

// Get all grids
const allGrids = templates;

// Get active grid
const current = activeGrid;

// Select a grid
setActiveGrid('strip_2x6_2photos');
```

### Rendering a Grid

```typescript
import { GridRenderer } from '@/utils/gridRenderer';

const renderer = new GridRenderer(300); // 300 DPI
const photos = ['data:image/jpeg;base64,...'];

const finalImage = await renderer.renderGrid(
  activeGrid,
  photos,
  {
    dpi: 300,
    quality: 0.95,
    format: 'jpeg',
  }
);
```

---

## 📂 File Locations

**Grid Definitions:**
- `src/types/grid.ts` - FIXED_GRID_TEMPLATES

**Rendering Engine:**
- `src/utils/gridRenderer.ts` - GridRenderer class

**Components:**
- `src/components/machine/GridRenderer.tsx` - Display component
- `src/components/machine/GridSelector.tsx` - Selection UI

**State Management:**
- `src/store/gridStore.ts` - Grid selection state

---

## ✅ Quality Assurance

### Print Requirements
- ✅ 300 DPI resolution
- ✅ Exact inch dimensions
- ✅ No distortion or stretching
- ✅ Consistent across all outputs
- ✅ Print-ready JPEG format

### Consistency
- ✅ Same layout on screen and paper
- ✅ Identical preview, print, and QR output
- ✅ Fixed slot positions
- ✅ Equal spacing and margins

---

## 🎉 Summary

The Fixed Grid System provides:
- **4 locked layouts** - No customization allowed
- **300 DPI output** - Print-ready quality
- **Exact dimensions** - Precise inch specifications
- **Consistency** - Same across all outputs
- **Simplicity** - Select from 4 approved layouts only
