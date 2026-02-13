const mongoose = require('mongoose');

const boxSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'La machine doit avoir un nom'],
    trim: true
  },
  platform: {
    type: String,
    required: [true, 'La plateforme est obligatoire'],
    enum: ['HackTheBox', 'TryHackMe', 'Root-Me', 'VulnHub', 'Other']
  },
  ipAddress: {
    type: String,
    trim: true
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
    description: 'Tes notes de reconnaissance, ports ouverts, etc.'
  },
  target: {
    type: mongoose.Schema.ObjectId,
    ref: 'Target',
    description: "La cible parente à laquelle cette machine appartient"
  },
  author: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Une box doit appartenir à un utilisateur']
  },
  createdAt: {
    type: Date,
    default: Date.now()
  }
});

module.exports = mongoose.model('Box', boxSchema);