# Razorpay Integration Guide

## Overview
The photobooth now uses **Razorpay** payment gateway for secure payment processing. Users can pay using UPI, Cards, Net Banking, and Wallets.

## Setup Instructions

### 1. Get Razorpay API Keys

1. Sign up at [Razorpay Dashboard](https://dashboard.razorpay.com/signup)
2. After login, go to **Settings** → **API Keys**
3. Generate API keys:
   - **Test Mode**: For development (starts with `rzp_test_`)
   - **Live Mode**: For production (starts with `rzp_live_`)

### 2. Configure Environment Variables

Create a `.env` file in the project root (copy from `.env.example`):

```bash
# Razorpay Test Mode (for development)
VITE_RAZORPAY_KEY_ID=rzp_test_YOUR_KEY_ID_HERE
VITE_RAZORPAY_KEY_SECRET=YOUR_KEY_SECRET_HERE
```

⚠️ **Important**: 
- Only use `VITE_RAZORPAY_KEY_ID` (public key) in frontend
- Never expose `VITE_RAZORPAY_KEY_SECRET` in client-side code
- Keep `.env` file in `.gitignore`

### 3. Test Payment Flow

**Test Mode Credentials** (Razorpay provides these):
- **Card Number**: 4111 1111 1111 1111
- **CVV**: Any 3 digits
- **Expiry**: Any future date
- **UPI**: success@razorpay

### 4. Go Live (Production)

When ready for production:

1. **Complete KYC** on Razorpay Dashboard
2. Get **Live API Keys** (Settings → API Keys → Generate Live Keys)
3. Update `.env`:
   ```bash
   VITE_RAZORPAY_KEY_ID=rzp_live_YOUR_LIVE_KEY
   ```
4. Test thoroughly before launching!

## Payment Flow

1. User selects layout and reaches payment screen
2. Clicks "Pay ₹XXX" button
3. Razorpay checkout modal opens with payment options:
   - 💳 Cards (Credit/Debit)
   - 📱 UPI (Google Pay, PhonePe, Paytm)
   - 🏦 Net Banking
   - 👛 Wallets (Paytm, PhonePe, Amazon Pay)
4. User completes payment
5. On success → Navigate to camera/capture screen
6. On failure → Show error and retry option

## Features Implemented

✅ Razorpay checkout integration  
✅ Multiple payment methods  
✅ Custom branding (Pixxel8 logo & colors)  
✅ Payment success/failure handling  
✅ Session tracking with payment ID  
✅ Error messaging  
✅ Test mode support  

## Code Structure

- **Types**: [src/types/razorpay.types.ts](../src/types/razorpay.types.ts)
- **Payment Screen**: [src/pages/machine/PaymentScreen.tsx](../src/pages/machine/PaymentScreen.tsx)
- **Razorpay Script**: Loaded in [index.html](../index.html)

## Customization

### Change Theme Color
In `PaymentScreen.tsx`:
```typescript
theme: {
  color: '#FF6B35', // Your brand color
}
```

### Add Prefilled Customer Info
```typescript
prefill: {
  name: 'Customer Name',
  email: 'customer@email.com',
  contact: '9876543210'
}
```

### Add Custom Notes
```typescript
notes: {
  session_id: session?.sessionId,
  booth_location: 'Event Hall A',
  event_name: 'Wedding Reception'
}
```

## Troubleshooting

### "Razorpay SDK not loaded"
- Check if Razorpay script is in `index.html`
- Clear browser cache and reload

### "Invalid Key ID"
- Verify `VITE_RAZORPAY_KEY_ID` in `.env`
- Ensure it starts with `rzp_test_` or `rzp_live_`
- Restart dev server after changing `.env`

### Payment not working in production
- Switch from test to live keys
- Complete KYC verification
- Enable payment methods in Razorpay dashboard

## Security Best Practices

1. ✅ Never commit `.env` file to git
2. ✅ Use test keys during development
3. ✅ Verify payments on backend (optional but recommended)
4. ✅ Enable 2FA on Razorpay account
5. ✅ Monitor transactions regularly

## Payment Verification (Optional Backend)

For added security, verify payments on your backend:

```javascript
const Razorpay = require('razorpay');
const crypto = require('crypto');

// Verify signature
const generateSignature = (orderId, paymentId) => {
  const secret = process.env.RAZORPAY_KEY_SECRET;
  const message = orderId + '|' + paymentId;
  return crypto
    .createHmac('sha256', secret)
    .update(message)
    .digest('hex');
};
```

## Support

- **Razorpay Docs**: https://razorpay.com/docs/
- **Support**: https://razorpay.com/support/
- **Dashboard**: https://dashboard.razorpay.com/

## License

This integration follows Razorpay's terms of service and SDK license.
