const mongoose = require('mongoose');

const toolSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true }, // ex: "Nmap"
  category: {
    type: String,
    required: [true, "La catégorie est obligatoire"],
    enum: [
      'Reconnaissance',
      'Weaponization',
      'Delivery',
      'Exploitation',
      'Installation',
      'Command & Control',
      'Actions on Objectives'
    ]
  },
  description: String,
  cheatsheet: [{
    command: String,
    explanation: String
  }],
  link: String // Lien vers doc officielle
});

module.exports = mongoose.model('Tool', toolSchema);