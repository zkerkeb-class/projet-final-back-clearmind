const mongoose = require('mongoose');

const targetSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Une cible doit avoir un nom (ex: Nom du client ou projet)'],
    trim: true
  },
  domain: {
    type: String, // ex: client-cible.com
    lowercase: true
  },
  scope: [String], // Pour définir ce qui est autorisé (ex: [*.client.com, 192.168.1.0/24])
  techStack: [String], // Technologies détectées (ex: [React, Cloudflare, Nginx])
  status: {
    type: String,
    enum: ['Active', 'Completed', 'On-Hold'],
    default: 'Active'
  },
  author: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now()
  }
});

module.exports = mongoose.model('Target', targetSchema);