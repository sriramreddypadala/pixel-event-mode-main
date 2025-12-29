import type { GridTemplate, GridSlot, GridRenderOptions } from '@/types/grid';
import { DPI_PRESETS } from '@/types/grid';

// ====================================================
// CANVAS-BASED GRID RENDERER (300 DPI PRODUCTION)
// ====================================================

export class GridRenderer {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private dpi: number;

  constructor(dpi: number = DPI_PRESETS.PRINT_STANDARD) {
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d')!;
    this.dpi = dpi;
  }

  /**
   * Render grid with photos to canvas
   */
  async renderGrid(
    grid: GridTemplate,
    photos: string[],
    options: GridRenderOptions = {}
  ): Promise<string> {
    const {
      dpi: _dpi = this.dpi,
      quality = 0.95,
      format = 'jpeg',
      includeBackground = true,
      includeLogo = true,
      printAndCut = false,
    } = options;

    // Set canvas size based on grid dimensions
    this.canvas.width = grid.canvasWidth;
    this.canvas.height = grid.canvasHeight;

    // Clear canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Draw background
    if (includeBackground) {
      await this.drawBackground(grid);
    }

    // Draw photo slots
    await this.drawSlots(grid, photos);

    // Draw logo
    if (includeLogo && grid.logo) {
      await this.drawLogo(grid);
    }

    // Draw cut line in middle if Print & Cut is enabled
    if (printAndCut) {
      this.drawCutLine();
    }

    // Export as data URL
    return this.canvas.toDataURL(`image/${format}`, quality);
  }

  /**
   * Draw background color or image
   */
  private async drawBackground(grid: GridTemplate): Promise<void> {
    if (grid.backgroundImage) {
      const img = await this.loadImage(grid.backgroundImage);
      this.ctx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height);
    } else if (grid.backgroundColor) {
      this.ctx.fillStyle = grid.backgroundColor;
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }
  }

  /**
   * Draw all photo slots with images
   */
  private async drawSlots(grid: GridTemplate, photos: string[]): Promise<void> {
    // Sort slots by zIndex
    const sortedSlots = [...grid.slots].sort((a, b) => (a.zIndex || 0) - (b.zIndex || 0));

    for (let i = 0; i < sortedSlots.length; i++) {
      const slot = sortedSlots[i];
      // Handle duplicate photos: if we have fewer photos than slots,
      // duplicate photos for slots beyond the photo count
      let photoIndex = i;
      if (photos.length > 0 && i >= photos.length) {
        // Duplicate: use modulo to repeat photos
        photoIndex = i % photos.length;
      }
      const photoData = photos[photoIndex];

      if (photoData) {
        await this.drawSlot(slot, photoData);
      } else {
        // Draw empty slot placeholder
        this.drawEmptySlot(slot);
      }
    }
  }

  /**
   * Draw single photo slot with image
   */
  private async drawSlot(slot: GridSlot, photoData: string): Promise<void> {
    const img = await this.loadImage(photoData);

    // Calculate slot position and size in pixels
    const x = (slot.x / 100) * this.canvas.width;
    const y = (slot.y / 100) * this.canvas.height;
    const width = (slot.width / 100) * this.canvas.width;
    const height = (slot.height / 100) * this.canvas.height;

    // Save context
    this.ctx.save();

    // Create rounded rectangle clip path
    if (slot.radius) {
      this.roundRect(x, y, width, height, slot.radius);
      this.ctx.clip();
    }

    // Calculate crop to fit (cover behavior)
    const { sx, sy, sWidth, sHeight } = this.calculateCrop(
      img.width,
      img.height,
      width,
      height
    );

    // Draw image
    this.ctx.drawImage(img, sx, sy, sWidth, sHeight, x, y, width, height);

    // Restore context
    this.ctx.restore();

    // Draw border (optional)
    if (slot.radius) {
      this.ctx.strokeStyle = 'rgba(0, 0, 0, 0.1)';
      this.ctx.lineWidth = 2;
      this.roundRect(x, y, width, height, slot.radius);
      this.ctx.stroke();
    }
  }

  /**
   * Draw empty slot placeholder
   */
  private drawEmptySlot(slot: GridSlot): void {
    const x = (slot.x / 100) * this.canvas.width;
    const y = (slot.y / 100) * this.canvas.height;
    const width = (slot.width / 100) * this.canvas.width;
    const height = (slot.height / 100) * this.canvas.height;

    this.ctx.save();

    // Draw rounded rectangle
    if (slot.radius) {
      this.roundRect(x, y, width, height, slot.radius);
    } else {
      this.ctx.rect(x, y, width, height);
    }

    // Fill with light gray
    this.ctx.fillStyle = '#f3f4f6';
    this.ctx.fill();

    // Draw dashed border
    this.ctx.strokeStyle = '#d1d5db';
    this.ctx.lineWidth = 2;
    this.ctx.setLineDash([10, 5]);
    this.ctx.stroke();
    this.ctx.setLineDash([]);

    this.ctx.restore();
  }

  /**
   * Draw logo
   */
  private async drawLogo(grid: GridTemplate): Promise<void> {
    if (!grid.logo) return;

    const img = await this.loadImage(grid.logo.url);

    const x = (grid.logo.x / 100) * this.canvas.width;
    const y = (grid.logo.y / 100) * this.canvas.height;
    const width = (grid.logo.width / 100) * this.canvas.width;
    const height = (grid.logo.height / 100) * this.canvas.height;

    this.ctx.drawImage(img, x, y, width, height);
  }

  /**
   * Calculate crop dimensions for cover fit
   */
  private calculateCrop(
    imgWidth: number,
    imgHeight: number,
    targetWidth: number,
    targetHeight: number
  ): { sx: number; sy: number; sWidth: number; sHeight: number } {
    const imgRatio = imgWidth / imgHeight;
    const targetRatio = targetWidth / targetHeight;

    let sx = 0;
    let sy = 0;
    let sWidth = imgWidth;
    let sHeight = imgHeight;

    if (imgRatio > targetRatio) {
      // Image is wider - crop width
      sWidth = imgHeight * targetRatio;
      sx = (imgWidth - sWidth) / 2;
    } else {
      // Image is taller - crop height
      sHeight = imgWidth / targetRatio;
      sy = (imgHeight - sHeight) / 2;
    }

    return { sx, sy, sWidth, sHeight };
  }

  /**
   * Draw rounded rectangle path
   */
  private roundRect(
    x: number,
    y: number,
    width: number,
    height: number,
    radius: number
  ): void {
    this.ctx.beginPath();
    this.ctx.moveTo(x + radius, y);
    this.ctx.lineTo(x + width - radius, y);
    this.ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    this.ctx.lineTo(x + width, y + height - radius);
    this.ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    this.ctx.lineTo(x + radius, y + height);
    this.ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    this.ctx.lineTo(x, y + radius);
    this.ctx.quadraticCurveTo(x, y, x + radius, y);
    this.ctx.closePath();
  }

  /**
   * Draw vertical cut line in the middle of the canvas
   */
  private drawCutLine(): void {
    const cutX = this.canvas.width / 2;
    const lineWidth = Math.max(2, this.canvas.width * 0.001); // 0.1% of width, min 2px
    const dashLength = Math.max(10, this.canvas.height * 0.02); // 2% of height, min 10px
    const dashGap = Math.max(5, this.canvas.height * 0.01); // 1% of height, min 5px

    this.ctx.save();
    
    // Draw dashed vertical line in the middle
    this.ctx.strokeStyle = '#FF0000'; // Red color for visibility
    this.ctx.lineWidth = lineWidth;
    this.ctx.setLineDash([dashLength, dashGap]);
    this.ctx.lineCap = 'round';
    
    // Draw from top to bottom
    this.ctx.beginPath();
    this.ctx.moveTo(cutX, 0);
    this.ctx.lineTo(cutX, this.canvas.height);
    this.ctx.stroke();

    // Draw registration marks at top and bottom for precise cutting
    const markSize = Math.max(8, this.canvas.width * 0.01); // 1% of width, min 8px
    const markOffset = markSize * 2;
    
    // Top registration mark (L shape)
    this.ctx.strokeStyle = '#FF0000';
    this.ctx.lineWidth = lineWidth * 1.5;
    this.ctx.setLineDash([]); // Solid line for marks
    
    // Left mark (L pointing right)
    this.ctx.beginPath();
    this.ctx.moveTo(cutX - markOffset, markSize);
    this.ctx.lineTo(cutX, markSize);
    this.ctx.lineTo(cutX, 0);
    this.ctx.stroke();
    
    // Right mark (L pointing left)
    this.ctx.beginPath();
    this.ctx.moveTo(cutX + markOffset, markSize);
    this.ctx.lineTo(cutX, markSize);
    this.ctx.lineTo(cutX, 0);
    this.ctx.stroke();
    
    // Bottom registration marks
    const bottomY = this.canvas.height - markSize;
    
    // Left mark (L pointing right)
    this.ctx.beginPath();
    this.ctx.moveTo(cutX - markOffset, bottomY);
    this.ctx.lineTo(cutX, bottomY);
    this.ctx.lineTo(cutX, this.canvas.height);
    this.ctx.stroke();
    
    // Right mark (L pointing left)
    this.ctx.beginPath();
    this.ctx.moveTo(cutX + markOffset, bottomY);
    this.ctx.lineTo(cutX, bottomY);
    this.ctx.lineTo(cutX, this.canvas.height);
    this.ctx.stroke();

    this.ctx.restore();
  }

  /**
   * Load image from URL or data URL
   */
  private loadImage(src: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });
  }

  /**
   * Get canvas element (for preview)
   */
  getCanvas(): HTMLCanvasElement {
    return this.canvas;
  }

  /**
   * Download rendered grid as file
   */
  downloadGrid(filename: string, format: 'png' | 'jpeg' = 'jpeg'): void {
    const link = document.createElement('a');
    link.download = `${filename}.${format}`;
    link.href = this.canvas.toDataURL(`image/${format}`, 0.95);
    link.click();
  }
}

// ====================================================
// UTILITY FUNCTIONS
// ====================================================

/**
 * Generate grid preview (low-res for UI)
 */
export async function generateGridPreview(
  grid: GridTemplate,
  photos: string[]
): Promise<string> {
  const renderer = new GridRenderer(DPI_PRESETS.SCREEN);
  return await renderer.renderGrid(grid, photos, {
    dpi: DPI_PRESETS.SCREEN,
    quality: 0.8,
    format: 'jpeg',
  });
}

/**
 * Generate print-ready grid (300 DPI)
 */
export async function generatePrintGrid(
  grid: GridTemplate,
  photos: string[]
): Promise<string> {
  const renderer = new GridRenderer(DPI_PRESETS.PRINT_STANDARD);
  return await renderer.renderGrid(grid, photos, {
    dpi: DPI_PRESETS.PRINT_STANDARD,
    quality: 0.95,
    format: 'jpeg',
  });
}

/**
 * Generate QR code image (same as print)
 */
export async function generateQRGrid(
  grid: GridTemplate,
  photos: string[]
): Promise<string> {
  return await generatePrintGrid(grid, photos);
}
