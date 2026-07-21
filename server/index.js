const express = require('express');
const path = require('path');
const cors = require('cors');
const izdelieRoutes = require('./routes/izdelie-routes');

const app = express();
const PORT = process.env.PORT || 3000;

// CORS configuration for Angular dev server
const corsOptions = {
  origin: ['http://localhost:4200', 'https://localhost:4200'],
  credentials: true,
  optionsSuccessStatus: 200
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files (Angular build output)
app.use(express.static(path.join(__dirname, '../dist/calib-ui/browser')));

// API Routes
app.use('/api/config/izdelie', izdelieRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`API available at http://localhost:${PORT}/api`);
});

module.exports = app;
