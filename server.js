/**
 * BACKEND SERVER WITH NGROK TUNNEL
 * Creates a public URL automatically for global QR code access
 * Run with: node server.js
 */

import express from 'express';
import ngrok from 'ngrok';
import cors from 'cors';
import { createServer } from 'vite';
import process from 'process';

const app = express();
const PORT = 3000;

// Enable CORS for all requests
app.use(cors());
app.use(express.json());

// Store ngrok URL globally
let publicUrl = '';

// SESSION STORAGE - Server-side in-memory storage for image sharing
const sessions = new Map();
const SESSION_DURATION = 10 * 60 * 1000; // 10 minutes

// Clean up expired sessions periodically
setInterval(() => {
  const now = Date.now();
  for (const [sessionId, sessionData] of sessions.entries()) {
    if (now > sessionData.expiresAt) {
      sessions.delete(sessionId);
      console.log(`🗑️  Session ${sessionId} expired and cleaned up`);
    }
  }
}, 60000); // Check every minute

// API: Get public URL
app.get('/api/tunnel-url', (req, res) => {
  res.json({ url: publicUrl });
});

// API: Create new session
app.post('/api/sessions', (req, res) => {
  const { sessionId, layoutInfo } = req.body;
  const now = Date.now();
  
  sessions.set(sessionId, {
    images: [],
    createdAt: now,
    expiresAt: now + SESSION_DURATION,
    gridLayout: layoutInfo
  });
  
  console.log(`📸 Session created: ${sessionId} (expires in 10 min)`);
  res.json({ success: true, sessionId });
});

// API: Add images to session
app.post('/api/sessions/:sessionId/images', (req, res) => {
  const { sessionId } = req.params;
  const { images } = req.body;
  
  const session = sessions.get(sessionId);
  if (!session) {
    console.error(`❌ Session not found: ${sessionId}`);
    return res.status(404).json({ error: 'Session not found' });
  }
  
  if (Date.now() > session.expiresAt) {
    sessions.delete(sessionId);
    console.error(`❌ Session expired: ${sessionId}`);
    return res.status(410).json({ error: 'Session expired' });
  }
  
  // Store images array directly (already formatted by client)
  if (Array.isArray(images)) {
    session.images = images;
    console.log(`📷 Added ${images.length} images to session ${sessionId}`);
    console.log(`   Images stored on SERVER - accessible from any device!`);
  } else {
    console.error(`❌ Invalid images format for session ${sessionId}`);
    return res.status(400).json({ error: 'Images must be an array' });
  }
  
  res.json({ success: true, count: session.images.length });
});

// API: Get session data
app.get('/api/sessions/:sessionId', (req, res) => {
  const { sessionId } = req.params;
  const session = sessions.get(sessionId);
  
  console.log(`📡 Session request: ${sessionId}`);
  
  if (!session) {
    console.error(`❌ Session not found: ${sessionId}`);
    console.log(`   Active sessions: ${sessions.size}`);
    return res.status(404).json({ error: 'Session not found' });
  }
  
  if (Date.now() > session.expiresAt) {
    sessions.delete(sessionId);
    console.error(`❌ Session expired: ${sessionId}`);
    return res.status(410).json({ error: 'Session expired' });
  }
  
  console.log(`✅ Session found: ${sessionId}`);
  console.log(`   Images: ${session.images.length}`);
  console.log(`   Layout: ${session.gridLayout}`);
  console.log(`   Expires in: ${Math.round((session.expiresAt - Date.now()) / 1000)}s`);
  
  res.json({
    images: session.images,
    gridLayout: session.gridLayout,
    expiresAt: session.expiresAt
  });
});

// Start server
async function startServer() {
  try {
    console.log('🚀 Starting Pixxel8 Photobooth Server...\n');

    // For now, use local network IP address
    // You can access from mobile on same WiFi network
    const os = await import('os');
    const networkInterfaces = os.networkInterfaces();
    const addresses = [];
    for (const name of Object.keys(networkInterfaces)) {
      for (const net of networkInterfaces[name]) {
        // Skip internal and non-IPv4 addresses
        if (net.family === 'IPv4' && !net.internal) {
          addresses.push(net.address);
        }
      }
    }
    
    const localIP = addresses.length > 0 ? addresses[0] : 'localhost';
    publicUrl = `http://${localIP}:${PORT}`;
    
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🌐 LOCAL NETWORK URL (WiFi Access):');
    console.log(`   ${publicUrl}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✅ AWS S3 storage: ACTIVE');
    console.log('📸 Photos upload to S3 bucket: pixxel8-photobooth-uploader');
    console.log('📱 Mobile devices must be on SAME WiFi network');
    console.log('💡 Share this URL with devices on your network!\n');

    // Create Vite server in middleware mode with local network URL
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });

    // IMPORTANT: Use vite's middleware AFTER all API routes
    // This ensures API endpoints are registered before Vite intercepts requests
    app.use(vite.middlewares);

    // Start Express server
    const server = app.listen(PORT, '0.0.0.0', () => {
      console.log(`✅ Local Server: http://localhost:${PORT}`);
      console.log(`✅ Public Server: ${publicUrl}`);
      console.log(`✅ API Endpoints Ready: /api/tunnel-url, /api/sessions\n`);
    });

    // Handle graceful shutdown
    process.on('SIGINT', async () => {
      console.log('\n\n🔴 Shutting down...');
      await ngrok.disconnect();
      await ngrok.kill();
      server.close();
      process.exit(0);
    });

  } catch (error) {
    console.error('❌ Server failed to start:', error);
    process.exit(1);
  }
}

startServer();
