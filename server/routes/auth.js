const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const sign = (u) => jwt.sign({ id: u._id, name: u.name }, process.env.JWT_SECRET, { expiresIn: '7d' });
const out = (u) => ({ token: sign(u), user: { id: u._id, name: u.name } });

router.post('/signup', async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password || password.length < 6)
    return res.status(400).json({ error: 'Name, email and a 6+ character password are required' });
  if (await User.findOne({ email: email.toLowerCase() }))
    return res.status(409).json({ error: 'Email already registered' });
  const user = await User.create({ name, email, password: await bcrypt.hash(password, 10) });
  res.json(out(user));
});

router.post('/login', async (req, res) => {
  const user = await User.findOne({ email: (req.body.email || '').toLowerCase() });
  if (!user || !(await bcrypt.compare(req.body.password || '', user.password)))
    return res.status(401).json({ error: 'Invalid email or password' });
  res.json(out(user));
});

module.exports = router;