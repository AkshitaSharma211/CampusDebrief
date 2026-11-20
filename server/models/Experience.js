const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema.Types;

module.exports = mongoose.model('Experience', new mongoose.Schema({
  author: { type: ObjectId, ref: 'User', required: true },
  authorName: String,
  company: { type: String, required: true, trim: true },
  role: { type: String, required: true, trim: true },
  difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], required: true },
  outcome: { type: String, enum: ['Selected', 'Rejected', 'Waiting'], required: true },
  rounds: [{ title: String, details: String }],
  tips: String,
  upvotes: [{ type: ObjectId, ref: 'User' }],
}, { timestamps: true }));