const mongoose = require("mongoose");

const DevisSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  client: { type: mongoose.Schema.Types.ObjectId, ref: "Utilisateur", required: true  },
  montant_total: { type: double, required: false },
  voiture: { type: mongoose.Schema.Types.ObjectId, ref: "Voiture", required: true }
}, {
  timestamps: true // Option de timestamp pour createdAt et updatedAt
});
module.exports = mongoose.model('Devis', DevisSchema);
