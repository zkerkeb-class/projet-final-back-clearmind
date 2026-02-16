const mongoose = require('mongoose');

const toolSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true }, // ex: "Nmap"
  category: String, // ex: "Reconnaissance"
  description: String,
  cheatsheet: [{
    command: String,
    explanation: String
  }],
  link: String // Lien vers doc officielle
});

module.exports = mongoose.model('Tool', toolSchema);