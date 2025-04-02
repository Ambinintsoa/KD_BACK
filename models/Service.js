const mongoose = require("mongoose");

const ServiceSchema = new mongoose.Schema({
  nom_service: { type: String, required: true },
  duree: { type: Number, required: false },
  prix: { type: Number, required: false },
  statut: { type: Number, required: true, default: 0 },
  categorie_service: { type: mongoose.Schema.Types.ObjectId, ref: "CategorieService", required: true },
  // Ajout du tableau de promotions
  promotions: [{
    pourcentage_reduction: { type: Number, required: true, min: 0, max: 100 }, // Ex. 20 pour 20%
    date_debut: { type: Date, required: true }, // Date de début de la promotion
    date_fin: { type: Date, required: true },   // Date de fin de la promotion
    description: { type: String, required: false }, // Description optionnelle
    actif: { 
      type: Boolean, 
      default: function() { 
        const now = new Date();
        return now >= this.date_debut && now <= this.date_fin;
      } 
    } // Statut calculé automatiquement
  }]
}, {
  timestamps: true // Option pour createdAt et updatedAt
});

module.exports = mongoose.model('Service', ServiceSchema);