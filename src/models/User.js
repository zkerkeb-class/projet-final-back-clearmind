const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: { 
    type: String, 
    required: [true, "Le nom d'utilisateur est obligatoire"] 
  },
  email: { 
    type: String, 
    required: [true, "L'email est obligatoire"], 
    unique: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, "Veuillez fournir une adresse email valide"]
  },
  password: { 
    type: String, 
    required: [true, "Le mot de passe est obligatoire"],
    select: false // Sécurité : n'envoie JAMAIS le password dans les requêtes GET par défaut
  },
  role: { 
    type: String, 
    enum: ['guest', 'pentester', 'admin'], // Seules ces 3 valeurs sont acceptées
    default: 'guest' 
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Hachage du mot de passe avant sauvegarde
userSchema.pre('save', async function() {
  // On ne hache que si le mot de passe a été modifié (ou créé)
  if (!this.isModified('password')) return;
  
  this.password = await bcrypt.hash(this.password, 12);
});

// Méthode pour vérifier le mot de passe lors du login
userSchema.methods.correctPassword = async function(candidatePassword, userPassword) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

module.exports = mongoose.model('User', userSchema);