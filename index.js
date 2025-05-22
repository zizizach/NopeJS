const express = require('express');
const rateLimit = require('express-rate-limit');
const app = express();
const PORT = process.env.PORT || 3000;

// Rate limiting
const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 60, // limit each IP to 60 requests per minute
});
app.use(limiter);

// Load response types
const types = {
  no: require('./responses/no'),
  excuse: require('./responses/excuse'),
  reject: require('./responses/reject'),
};

// Route: /api/:type
app.get('/:type', (req, res) => {
  const { type } = req.params;
  const style = req.query.style || 'default';
  const data = types[type];

  if (!data) return res.status(404).json({ error: 'Unknown type' });

  const filtered = data[style] || data['default'];
  const response = filtered[Math.floor(Math.random() * filtered.length)];

  res.json({ type, style, message: response });
});

// Healthcheck
app.get('/', (req, res) => res.send('🎉 NopeJS is live'));

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
