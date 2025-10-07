// server.js
require('dotenv').config();
const express = require('express');
const path = require('path');
const createPaymentIntent = require('./api/create-payment-intent');
const webhookHandler = require('./api/webhook');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files
app.use(express.static(path.join(__dirname)));

// Webhook route (must be before express.json())
app.post('/api/webhook', 
  express.raw({ type: 'application/json' }), 
  webhookHandler
);

// JSON body parser for other routes
app.use(express.json());

// API routes
app.post('/api/create-payment-intent', createPaymentIntent);

// Serve payment page
app.get('/payment', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});