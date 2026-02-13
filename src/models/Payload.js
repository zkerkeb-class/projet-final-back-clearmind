const mongoose = require('mongoose');

const payloadSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Un payload doit avoir un titre'],
    trim: true
  },
  category: {
    type: String,
    required: [true, 'Une catégorie est obligatoire'],
    enum: {
      values: [
        'XSS', 'SQLi', 'NoSQLi', 'LFI', 'RFI', 'RCE', 'SSTI',
        'IDOR', 'SSRF', 'CSRF', 'XXE', 'Command-Inj',
        'Auth-Bypass', 'Priv-Esc', 'Directory-Trav',
        'BOLA', 'Mass-Assignment', 'JWT-Attack', 'GraphQL-Inj', 'Rate-Limit-Bypass',
        'Other'
      ],
      message: '{VALUE} n\'est pas une catégorie de vulnérabilité valide'
    }
  },
  code: {
    type: String,
    required: [true, 'Le code de la charge utile est requis']
  },
  description: {
    type: String,
    trim: true
  },
  severity: {
    type: String,
    enum: ['Low', 'Medium', 'High', 'Critical'],
    default: 'Medium'
  },
  author: {
    type: mongoose.Schema.ObjectId,
    ref: 'User', // Référence au modèle User
    required: [true, 'Un payload doit appartenir à un utilisateur']
  },
  createdAt: {
    type: Date,
    default: Date.now()
  }
});

module.exports = mongoose.model('Payload', payloadSchema);