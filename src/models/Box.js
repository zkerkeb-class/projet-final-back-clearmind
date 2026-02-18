const mongoose = require('mongoose');

const boxSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Une box doit avoir un nom'],
    unique: true,
    trim: true
  },
  ipAddress: {
    type: String,
    required: [true, 'Une adresse IP est requise'],
    match: [/^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/, 'Adresse IP invalide']
  },
  platform: {
    type: String,
    enum: ['HackTheBox', 'TryHackMe', 'Root-Me', 'VulnHub', 'Other'],
    default: 'HackTheBox'
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard', 'Insane'],
    default: 'Easy'
  },
  status: {
    type: String,
    enum: ['Todo', 'In-Progress', 'User-Flag', 'Root-Flag'],
    default: 'Todo'
  },
  notes: {
    type: String,
    default: ''
  },
  author: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Une box doit appartenir à un utilisateur']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Box', boxSchema);