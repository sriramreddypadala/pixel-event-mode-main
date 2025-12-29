// Razorpay Payment Service
// This service provides a function to open the Razorpay checkout

export function openRazorpayCheckout({
  amount,
  currency = 'INR',
  name = 'Pixxel8 Photo Booth',
  description = 'Photo Booth Payment',
  order_id,
  handler,
  prefill = {},
  notes = {},
  theme = { color: '#ff8c1a' },
}) {
  const options = {
    key: 'rzp_live_RvPnmnPouVE7Lv', // LIVE API KEY
    amount: amount * 100, // Razorpay expects paise
    currency,
    name,
    description,
    order_id,
    handler,
    prefill,
    notes,
    theme,
  };
  const rzp = new window.Razorpay(options);
  rzp.open();
}
