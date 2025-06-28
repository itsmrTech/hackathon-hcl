const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Global state to simulate legacy system busy flag
global.isBusy = false;

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Legacy third-party mock API is running'
  });
});

// Get price of a security (simulate slow processing)
app.get('/price/:securityId', (req, res) => {
  if (global.isBusy) {
    console.log('Service is busy');
    return res.status(503).json({ error: 'Service is busy' });
  }

  global.isBusy = true;
  console.log(`Processing price request for security ID: ${req.params.securityId}`);

  setTimeout(() => {
    const price = Math.round(Math.random() * 100);
    global.isBusy = false;
    console.log(`Price response for security ID ${req.params.securityId}: ${price}`);
    res.json({ securityId: req.params.securityId, price });
  }, 5000); // Simulate 5 sec processing delay
});

// Place order endpoint (buy/sell)
app.post('/order', (req, res) => {
  if (global.isBusy) {
    console.log('Service is busy');
    return res.status(503).json({ error: 'Service is busy' });
  }

  const { fundName, transactionType, quantity } = req.body;
  if (!fundName || !transactionType || !quantity || quantity <= 0) {
    return res.status(400).json({ error: 'Invalid order data' });
  }

  global.isBusy = true;
  console.log(`Processing ${transactionType} order for fund ${fundName}, quantity ${quantity}`);

  setTimeout(() => {
    global.isBusy = false;
    const orderRefNo = `ORD-${Math.floor(Math.random() * 1000000)}`;
    console.log(`Order processed: ${orderRefNo}`);
    res.json({
      orderRefNo,
      status: 'Completed',
      fundName,
      transactionType,
      quantity
    });
  }, 5000); // Simulate 5 sec processing delay
});

// Start server
app.listen(PORT, () => {
  console.log(`Legacy third-party mock API server is running on port ${PORT}`);
});
