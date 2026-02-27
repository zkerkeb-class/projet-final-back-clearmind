const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`🛡️  MongoDB Connecté : ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ Erreur de connexion : ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;