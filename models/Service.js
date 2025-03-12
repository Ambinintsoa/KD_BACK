const mongoose = require("mongoose");

const ServiceSchema = new mongoose.Schema({
  nom_service: { type: String, required: true },
  duree: { type: Number, required: false },
  prix: { type: Number, required: false },
  categorie_service: { type: mongoose.Schema.Types.ObjectId, ref: "CategorieService", required: true }
}, {
  timestamps: true // Option de timestamp pour createdAt et updatedAt
});
module.exports = mongoose.model('Service', ServiceSchema);
