/**
 * NGROK SERVICE - Client Side
 * Fetches the public ngrok URL from backend
 */

class NgrokService {
  private publicUrl: string = '';
  private isReady: boolean = false;

  async initialize(): Promise<string> {
    try {
      const response = await fetch('/api/tunnel-url');
      const data = await response.json();
      this.publicUrl = data.url;
      this.isReady = true;
      console.log('🌍 Global URL ready:', this.publicUrl);
      return this.publicUrl;
    } catch (error) {
      console.warn('⚠️ Could not fetch tunnel URL, using local URL');
      this.publicUrl = window.location.origin;
      this.isReady = true;
      return this.publicUrl;
    }
  }

  getPublicUrl(): string {
    return this.publicUrl || window.location.origin;
  }

  isPublicUrlReady(): boolean {
    return this.isReady;
  }
}

export const ngrokService = new NgrokService();
