/**
 * AWS S3 SERVICE
 * Handles image uploads to S3 for persistent storage and global access
 * Images are accessible from any device/network via S3 URLs
 */

import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { nanoid } from 'nanoid';

// S3 Configuration from environment variables
const s3Client = new S3Client({
  region: import.meta.env.VITE_AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID || '',
    secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY || '',
  },
});

const BUCKET_NAME = import.meta.env.VITE_AWS_S3_BUCKET || 'pixxel8-photobooth-uploader';
const AWS_REGION = import.meta.env.VITE_AWS_REGION || 'us-east-1';

export interface S3SessionMetadata {
  sessionId: string;
  layoutType: string;
  photoCount: number;
  layoutName: string;
  photoUrls: string[];
  createdAt: number;
  expiresAt: number;
  viewerUrl?: string; // Optional - URL to the static HTML viewer on S3
}

class S3Service {
  /**
   * Convert base64 data URL to Uint8Array (browser-compatible)
   */
  private dataUrlToUint8Array(dataUrl: string): Uint8Array {
    const base64Data = dataUrl.replace(/^data:image\/\w+;base64,/, '');
    const binaryString = atob(base64Data);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
  }

  /**
   * Upload single image to S3
   * @returns Public S3 URL of uploaded image
   */
  async uploadImage(
    sessionId: string,
    imageDataUrl: string,
    index: number,
    filename?: string
  ): Promise<string> {
    try {
      const imageName = filename || `photo-${index}`;
      console.log(`📤 Uploading ${imageName} to S3...`);
      
      const imageData = this.dataUrlToUint8Array(imageDataUrl);
      const key = `sessions/${sessionId}/${imageName}.jpg`;

      const command = new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: key,
        Body: imageData,
        ContentType: 'image/jpeg',
        // Make publicly readable
        ACL: 'public-read',
        // Add metadata for tracking
        Metadata: {
          sessionId: sessionId,
          uploadedAt: Date.now().toString(),
          photoIndex: index.toString(),
        },
      });

      await s3Client.send(command);

      // Return public URL
      const publicUrl = `https://${BUCKET_NAME}.s3.${import.meta.env.VITE_AWS_REGION || 'us-east-1'}.amazonaws.com/${key}`;
      console.log(`✅ ${imageName} uploaded:`, publicUrl);
      
      return publicUrl;
    } catch (error) {
      console.error(`❌ Failed to upload image ${index}:`, error);
      throw error;
    }
  }

  /**
   * Upload all images for a session
   */
  async uploadSessionImages(
    sessionId: string,
    imageDataUrls: string[]
  ): Promise<string[]> {
    console.log(`📤 Uploading ${imageDataUrls.length} images to S3...`);
    console.log(`   Session ID: ${sessionId}`);
    console.log(`   Bucket: ${BUCKET_NAME}`);
    
    try {
      // Upload all images in parallel
      const uploadPromises = imageDataUrls.map((dataUrl, index) =>
        this.uploadImage(sessionId, dataUrl, index + 1)
      );

      const photoUrls = await Promise.all(uploadPromises);
      
      console.log(`✅ All ${photoUrls.length} images uploaded successfully!`);
      return photoUrls;
    } catch (error) {
      console.error('❌ Failed to upload session images:', error);
      throw error;
    }
  }

  /**
   * Upload session metadata to S3
   */
  async uploadSessionMetadata(metadata: S3SessionMetadata): Promise<void> {
    try {
      console.log('📝 Uploading session metadata to S3...');
      
      const key = `sessions/${metadata.sessionId}/metadata.json`;

      const command = new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: key,
        Body: JSON.stringify(metadata, null, 2),
        ContentType: 'application/json',
        ACL: 'public-read',
      });

      await s3Client.send(command);
      console.log('✅ Session metadata uploaded');
    } catch (error) {
      console.error('❌ Failed to upload session metadata:', error);
      throw error;
    }
  }

  /**
   * Get session metadata from S3
   */
  async getSessionMetadata(sessionId: string): Promise<S3SessionMetadata | null> {
    try {
      console.log('📥 Fetching session metadata from S3...');
      console.log('   Session ID:', sessionId);
      
      const key = `sessions/${sessionId}/metadata.json`;

      const command = new GetObjectCommand({
        Bucket: BUCKET_NAME,
        Key: key,
      });

      const response = await s3Client.send(command);
      const body = await response.Body?.transformToString();
      
      if (!body) {
        console.warn('⚠️ Empty metadata response');
        return null;
      }

      const metadata = JSON.parse(body);
      console.log('✅ Session metadata retrieved');
      console.log('   Photos:', metadata.photoUrls?.length || 0);
      console.log('   Layout:', metadata.layoutType);
      
      return metadata;
    } catch (error) {
      if (error instanceof Error && 'name' in error && error.name === 'NoSuchKey') {
        console.warn('⚠️ Session not found in S3:', sessionId);
      } else {
        console.error('❌ Failed to fetch session metadata:', error);
      }
      return null;
    }
  }

  /**
   * Generate a static HTML viewer page for a session
   */
  private generateViewerHTML(metadata: S3SessionMetadata): string {
    const { sessionId, photoUrls, layoutType, photoCount } = metadata;
    
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Pixxel8 - Your Photos</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      min-height: 100vh;
      padding: 20px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }
    .container {
      max-width: 900px;
      width: 100%;
      background: rgba(255, 255, 255, 0.95);
      border-radius: 20px;
      padding: 40px;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    }
    h1 {
      text-align: center;
      color: #333;
      margin-bottom: 10px;
      font-size: 2.5em;
    }
    .subtitle {
      text-align: center;
      color: #666;
      margin-bottom: 30px;
      font-size: 1.1em;
    }
    
    /* Collage Container - Same as booth display */
    .collage-wrapper {
      width: 100%;
      max-width: 600px;
      margin: 0 auto 30px;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
    }
    .collage {
      position: relative;
      width: 100%;
      background: #ffffff;
    }
    /* 2x2 Grid Layout */
    .collage.layout-2x2 {
      padding-bottom: 100%; /* 1:1 aspect ratio */
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      grid-template-rows: repeat(2, 1fr);
      gap: 8px;
      padding: 12px;
    }
    .collage.layout-2x2 img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: 8px;
    }
    /* 3x3 Grid Layout */
    .collage.layout-3x3 {
      padding-bottom: 100%;
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      grid-template-rows: repeat(3, 1fr);
      gap: 6px;
      padding: 10px;
    }
    .collage.layout-3x3 img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: 6px;
    }
    /* 4x4 Grid Layout */
    .collage.layout-4x4 {
      padding-bottom: 100%;
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      grid-template-rows: repeat(4, 1fr);
      gap: 4px;
      padding: 8px;
    }
    .collage.layout-4x4 img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: 4px;
    }
    /* Grid Layout (default) */
    .collage.layout-grid {
      padding-bottom: 133%; /* 3:4 aspect ratio */
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 8px;
      padding: 12px;
    }
    .collage.layout-grid img {
      width: 100%;
      height: auto;
      object-fit: cover;
      border-radius: 8px;
    }
    
    @media (max-width: 768px) {
      h1 { font-size: 1.8em; }
      .container { padding: 20px; }
      .collage-wrapper { max-width: 100%; }
    }
    
    .download-section {
      margin-top: 30px;
      padding-top: 20px;
      border-top: 2px solid #e5e7eb;
    }
    .download-btn {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      padding: 15px 40px;
      border-radius: 50px;
      font-size: 1.1em;
      cursor: pointer;
      display: block;
      margin: 10px auto;
      box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
      transition: all 0.3s ease;
      text-decoration: none;
      text-align: center;
      max-width: 300px;
    }
    .download-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(102, 126, 234, 0.6);
    }
    .footer {
      text-align: center;
      color: #999;
      margin-top: 20px;
      font-size: 0.9em;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>📸 Your Photo Collage!</h1>
    <p class="subtitle">Session: ${sessionId.substring(0, 8)} • ${photoCount} photo${photoCount > 1 ? 's' : ''}</p>
    
    <!-- Collage Display - Same as booth preview -->
    <div class="collage-wrapper">
      <div class="collage layout-${layoutType}">
        ${photoUrls.map((url, i) => `<img src="${url}" alt="Photo ${i + 1}" loading="lazy">`).join('')}
      </div>
    </div>
    
    <!-- Download Section -->
    <div class="download-section">
      <h2 style="text-align: center; color: #333; margin-bottom: 20px; font-size: 1.5em;">💾 Download Your Photos</h2>
      ${photoUrls.map((url, i) => `
        <a href="${url}" download="pixxel8-photo-${i + 1}.jpg" class="download-btn">
          ⬇️ Download Photo ${i + 1}
        </a>
      `).join('')}
    </div>
    
    <div class="footer">
      <p>✨ Powered by Pixxel8 Photobooth</p>
      <p>🔒 Photos stored securely on AWS S3</p>
      <p>⏰ Available for 24 hours</p>
    </div>
  </div>
</body>
</html>`;
  }

  /**
   * Upload the static HTML viewer page to S3
   */
  private async uploadViewerHTML(sessionId: string, html: string): Promise<string> {
    const key = `sessions/${sessionId}/view.html`;
    
    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
      Body: html,
      ContentType: 'text/html',
      ACL: 'public-read',
    });
    
    await s3Client.send(command);
    
    const url = `https://${BUCKET_NAME}.s3.${AWS_REGION}.amazonaws.com/${key}`;
    console.log(`✅ Viewer HTML uploaded: ${url}`);
    return url;
  }

  /**
   * Create complete session in S3 (upload images + metadata)
   */
  async createSession(
    layoutType: string,
    photoCount: number,
    layoutName: string,
    imageDataUrls: string[]
  ): Promise<string> {
    const sessionId = nanoid(10);
    
    console.log('🎬 Creating S3 session...');
    console.log('   Session ID:', sessionId);
    console.log('   Layout:', layoutType);
    console.log('   Photos:', photoCount);
    
    try {
      // Upload all images first
      const photoUrls = await this.uploadSessionImages(sessionId, imageDataUrls);

      // Create metadata
      const metadata: S3SessionMetadata = {
        sessionId,
        layoutType,
        photoCount,
        layoutName,
        photoUrls,
        createdAt: Date.now(),
        expiresAt: Date.now() + (24 * 60 * 60 * 1000), // 24 hours
      };

      // Upload metadata
      await this.uploadSessionMetadata(metadata);

      // Generate and upload static HTML viewer
      const html = this.generateViewerHTML(metadata);
      const viewerUrl = await this.uploadViewerHTML(sessionId, html);

      console.log('🎉 S3 session created successfully!');
      console.log('   Static Viewer URL:', viewerUrl);
      console.log('   This URL works from ANYWHERE in the world! 🌍');
      
      return sessionId;
    } catch (error) {
      console.error('❌ Failed to create S3 session:', error);
      throw error;
    }
  }

  /**
   * Create session with SINGLE COMPOSITE IMAGE (combined grid)
   * This uploads ONE image instead of multiple individual photos
   */
  async createCompositeSession(
    layoutType: string,
    layoutName: string,
    compositeImageDataUrl: string
  ): Promise<string> {
    const sessionId = nanoid(10);
    
    console.log('🎬 Creating S3 composite session...');
    console.log('   Session ID:', sessionId);
    console.log('   Layout:', layoutType);
    console.log('   Type: Single composite image');
    
    try {
      // Upload the single composite image
      const compositeUrl = await this.uploadImage(sessionId, compositeImageDataUrl, 0, 'composite');

      console.log('✅ Composite image uploaded:', compositeUrl);

      // Generate simple HTML viewer for single composite
      const html = this.generateCompositeViewerHTML(sessionId, compositeUrl, layoutType, layoutName);
      const viewerUrl = await this.uploadViewerHTML(sessionId, html);

      console.log('🎉 Composite session created successfully!');
      console.log('   Static Viewer URL:', viewerUrl);
      console.log('   Composite Image URL:', compositeUrl);
      console.log('   🌍 Works from ANYWHERE in the world!');
      
      return sessionId;
    } catch (error) {
      console.error('❌ Failed to create composite session:', error);
      throw error;
    }
  }

  /**
   * Generate HTML viewer for single composite image
   */
  private generateCompositeViewerHTML(
    sessionId: string,
    compositeUrl: string,
    layoutType: string,
    layoutName: string
  ): string {
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Pixxel8 - Your Photo ${layoutName}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      min-height: 100vh;
      padding: 20px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }
    .container {
      max-width: 900px;
      width: 100%;
      background: rgba(255, 255, 255, 0.95);
      border-radius: 20px;
      padding: 40px;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
      text-align: center;
    }
    h1 {
      color: #333;
      margin-bottom: 10px;
      font-size: 2.5em;
    }
    .subtitle {
      color: #666;
      margin-bottom: 30px;
      font-size: 1.1em;
    }
    .image-wrapper {
      width: 100%;
      max-width: 600px;
      margin: 0 auto 30px;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
    }
    .composite-image {
      width: 100%;
      height: auto;
      display: block;
    }
    .download-btn {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      padding: 18px 50px;
      border-radius: 50px;
      font-size: 1.2em;
      font-weight: bold;
      cursor: pointer;
      display: inline-block;
      margin: 20px auto;
      box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
      transition: all 0.3s ease;
      text-decoration: none;
    }
    .download-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(102, 126, 234, 0.6);
    }
    .footer {
      text-align: center;
      color: #999;
      margin-top: 30px;
      font-size: 0.9em;
    }
    @media (max-width: 768px) {
      h1 { font-size: 1.8em; }
      .container { padding: 20px; }
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>📸 Your Photo ${layoutName}!</h1>
    <p class="subtitle">Session: ${sessionId.substring(0, 8)} • Layout: ${layoutType}</p>
    
    <div class="image-wrapper">
      <img src="${compositeUrl}" alt="Photo Collage" class="composite-image" loading="eager">
    </div>
    
    <a href="${compositeUrl}" download="pixxel8-collage-${sessionId}.jpg" class="download-btn">
      ⬇️ Download Your ${layoutName}
    </a>
    
    <div class="footer">
      <p>✨ Powered by Pixxel8 Photobooth</p>
      <p>🔒 Stored securely on AWS S3 Cloud</p>
      <p>⏰ Available for 24 hours</p>
    </div>
  </div>
</body>
</html>`;
  }

  /**
   * Generate shareable view URL
   */
  getViewUrl(sessionId: string): string {
    const baseUrl = window.__PUBLIC_URL__ || window.location.origin;
    return `${baseUrl}/view/${sessionId}`;
  }

  /**
   * Check if S3 is configured properly
   */
  isConfigured(): boolean {
    const hasRegion = !!import.meta.env.VITE_AWS_REGION;
    const hasAccessKey = !!import.meta.env.VITE_AWS_ACCESS_KEY_ID;
    const hasSecretKey = !!import.meta.env.VITE_AWS_SECRET_ACCESS_KEY;
    const hasBucket = !!import.meta.env.VITE_AWS_S3_BUCKET;

    const isConfigured = hasRegion && hasAccessKey && hasSecretKey && hasBucket;

    if (!isConfigured) {
      console.warn('⚠️ S3 is not fully configured. Missing:');
      if (!hasRegion) console.warn('   - VITE_AWS_REGION');
      if (!hasAccessKey) console.warn('   - VITE_AWS_ACCESS_KEY_ID');
      if (!hasSecretKey) console.warn('   - VITE_AWS_SECRET_ACCESS_KEY');
      if (!hasBucket) console.warn('   - VITE_AWS_S3_BUCKET');
    } else {
      console.log('✅ S3 is configured:');
      console.log('   Region:', import.meta.env.VITE_AWS_REGION);
      console.log('   Bucket:', import.meta.env.VITE_AWS_S3_BUCKET);
    }

    return isConfigured;
  }
}

export const s3Service = new S3Service();
