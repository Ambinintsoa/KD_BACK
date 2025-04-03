// models/AvisClient.js
const mongoose = require('mongoose');

const AvisClientSchema = new mongoose.Schema({
  score: { type: Number, required: true },
  date: { type: Date, required: true, default: new Date() },
  client: { type: mongoose.Schema.Types.ObjectId, ref: 'Utilisateur', required: true },
  avis: { type: String, required: true },
  mecanicien: { type: mongoose.Schema.Types.ObjectId, ref: 'Utilisateur', required: false },
  statut: { type: Number, required: true, default: 0 }, // 0: non publié, 1: publié
  est_valide: { type: Boolean, default: false } // Nouveau champ pour validation
}, {
  timestamps: true
});

module.exports = mongoose.model('AvisClient', AvisClientSchema);
