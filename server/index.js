require('dotenv').config();
require('express-async-errors');
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
app.use(cors({ origin: process.env.CLIENT_URL }));
app.use(express.json());

app.get('/', (_, res) => res.send('PlaceBoard API'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/experiences', require('./routes/experiences'));

app.use((err, req, res, next) => {
  if (err.name === 'CastError') return res.status(404).json({ error: 'Not found' });
  if (err.name === 'ValidationError') return res.status(400).json({ error: err.message });
  console.error(err);
  res.status(500).json({ error: 'Server error' });
});
const PORT = process.env.PORT || 5001;
mongoose.connect(process.env.MONGO_URI)
  .then(() => app.listen(PORT, () => console.log('API running on', PORT)))
  .catch((err) => console.error('MONGO FAILED:', err.message));