const router = require('express').Router();
const Experience = require('../models/Experience');
const auth = require('../middleware/auth');

router.get('/', async (req, res) => {
  const { search, difficulty, outcome, page = 1 } = req.query;
  const q = {};
  if (difficulty) q.difficulty = difficulty;
  if (outcome) q.outcome = outcome;
  if (search) {
    const r = new RegExp(search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
    q.$or = [{ company: r }, { role: r }];
  }
  const limit = 10;
  const [items, total] = await Promise.all([
    Experience.find(q).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).select('-rounds'),
    Experience.countDocuments(q),
  ]);
  res.json({ items, total, pages: Math.ceil(total / limit) || 1 });
});

router.get('/:id', async (req, res) => {
  const e = await Experience.findById(req.params.id);
  if (!e) return res.status(404).json({ error: 'Not found' });
  res.json(e);
});

router.post('/', auth, async (req, res) => {
  const { company, role, difficulty, outcome, tips, rounds = [] } = req.body;
  const e = await Experience.create({
    author: req.user.id, authorName: req.user.name,
    company, role, difficulty, outcome, tips,
    rounds: rounds.filter((r) => r.title && r.title.trim()),
  });
  res.status(201).json(e);
});

router.post('/:id/upvote', auth, async (req, res) => {
  const e = await Experience.findById(req.params.id);
  if (!e) return res.status(404).json({ error: 'Not found' });
  const i = e.upvotes.findIndex((u) => u.equals(req.user.id));
  i >= 0 ? e.upvotes.splice(i, 1) : e.upvotes.push(req.user.id);
  await e.save();
  res.json({ upvotes: e.upvotes });
});

router.delete('/:id', auth, async (req, res) => {
  const e = await Experience.findById(req.params.id);
  if (!e) return res.status(404).json({ error: 'Not found' });
  if (!e.author.equals(req.user.id)) return res.status(403).json({ error: 'Not your post' });
  await e.deleteOne();
  res.json({ ok: true });
});

module.exports = router;