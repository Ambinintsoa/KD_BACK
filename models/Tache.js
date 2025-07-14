const mongoose = require("mongoose");

const TacheSchema = new mongoose.Schema({
  service: { type: mongoose.Schema.Types.ObjectId, ref: "Service", required: true },
  duree: { type: Number, required: false },
  ordre_priorite: { type: Number, required: false },
  statut: { type: String, required: false,default:"A faire" },
  rendez_vous: { type: mongoose.Schema.Types.ObjectId, ref: "RendezVous", required: true }
}, {
  timestamps: true // Option de timestamp pour createdAt et updatedAt
});
module.exports = mongoose.model('Tache', TacheSchema);
