const mongoose = require('mongoose');

const wikiSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Le titre est obligatoire (ex: Port 445 - SMB)'],
    unique: true,
    trim: true
  },
  port: {
    type: Number, // Permet de trier numériquement
    index: true
  },
  category: {
    type: String,
    enum: ['Network', 'Web', 'Windows', 'Linux', 'Cloud', 'Mobile'],
    default: 'Network'
  },
  content: {
    type: String,
    required: [true, 'Le contenu Markdown est obligatoire']
  },
  author: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Wiki', wikiSchema);