/**
 * IMAGE SHARE SERVICE - DEPRECATED
 * This service is being replaced by S3Service
 * Kept for backward compatibility during transition
 */

import { nanoid } from 'nanoid';

export interface CapturedImage {
  id: string;
  dataUrl: string;
  timestamp: number;
  expiresAt: number;
}

export interface SessionData {
  images: CapturedImage[];
  createdAt: number;
  expiresAt: number;
  gridLayout?: string;
}

class ImageShareService {
  private readonly SESSION_DURATION = 10 * 60 * 1000; // 10 minutes

  /**
   * Create a new sharing session on the server
   */
  async createSession(gridLayout?: string): Promise<string> {
    const sessionId = nanoid(10);
    
    console.log('📝 Creating session on server...');
    console.log('   Session ID:', sessionId);
    console.log('   Layout:', gridLayout);
    
    try {
      const response = await fetch('/api/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId, layoutInfo: gridLayout })
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Failed to create session:', response.status, errorText);
        throw new Error(`Failed to create session: ${response.status}`);
      }
      
      const result = await response.json();
      console.log('✅ Server session created successfully:', result);
      return sessionId;
    } catch (error) {
      console.error('❌ Error creating session:', error);
      throw error;
    }
  }

  /**
   * Add images to server session
   */
  async addImages(sessionId: string, imageDataUrls: string[]): Promise<boolean> {
    console.log('📤 Adding images to server session...');
    console.log('   Session ID:', sessionId);
    console.log('   Image count:', imageDataUrls.length);
    
    try {
      const now = Date.now();
      const images = imageDataUrls.map((dataUrl, index) => ({
        id: `${sessionId}-${index}`,
        dataUrl,
        timestamp: now,
        expiresAt: now + this.SESSION_DURATION
      }));

      const response = await fetch(`/api/sessions/${sessionId}/images`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ images })
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Failed to add images:', response.status, errorText);
        throw new Error(`Failed to add images: ${response.status}`);
      }
      
      const result = await response.json();
      console.log('✅ Images added successfully to server:', result);
      return true;
    } catch (error) {
      console.error('❌ Error adding images:', error);
      return false;
    }
  }

  /**
   * Get session from server
   */
  async getSession(sessionId: string): Promise<SessionData | null> {
    console.log('📥 Fetching session from server...');
    console.log('   Session ID:', sessionId);
    
    try {
      const response = await fetch(`/api/sessions/${sessionId}`);
      
      if (response.status === 404 || response.status === 410) {
        console.error('❌ Session not found or expired');
        return null;
      }
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Failed to fetch session:', response.status, errorText);
        throw new Error(`Failed to fetch session: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('✅ Session data received from server:');
      console.log('   Images:', data.images?.length || 0);
      console.log('   Layout:', data.gridLayout);
      
      return {
        images: data.images || [],
        gridLayout: data.gridLayout,
        createdAt: data.createdAt || 0,
        expiresAt: data.expiresAt || 0
      };
    } catch (error) {
      console.error('Failed to get session:', error);
      return null;
    }
  }

  /**
   * Get all images for a session
   */
  async getImages(sessionId: string): Promise<CapturedImage[]> {
    const session = await this.getSession(sessionId);
    return session?.images || [];
  }

  /**
   * Get time remaining for session
   */
  async getTimeRemaining(sessionId: string): Promise<number> {
    const session = await this.getSession(sessionId);
    if (!session) return 0;

    const remaining = session.expiresAt - Date.now();
    return remaining > 0 ? remaining : 0;
  }

  /**
   * Get shareable URL for the session - uses ngrok public URL if available
   * ⚠️ CRITICAL: This URL must ALWAYS point to /view/:sessionId route to display captured images
   */
  getShareableUrl(sessionId: string): string {
    // Try to get public URL from ngrok service
    const publicUrl = window.__PUBLIC_URL__ || window.location.origin;
    const fullUrl = `${publicUrl}/view/${sessionId}`;
    
    console.log('🔗 Generating shareable URL:');
    console.log('  Base URL:', publicUrl);
    console.log('  Session ID:', sessionId);
    console.log('  Full URL:', fullUrl);
    console.log('  ✅ This should show captured images, NOT redirect to any website');
    console.log('  ✅ Session stored on SERVER - accessible from any device!');
    
    return fullUrl;
  }

  /**
   * Check if session exists and is valid
   */
  async isValidSession(sessionId: string): Promise<boolean> {
    const session = await this.getSession(sessionId);
    return session !== null;
  }
}

export const imageShareService = new ImageShareService();
