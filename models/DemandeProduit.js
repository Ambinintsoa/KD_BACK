const mongoose = require("mongoose");

const DemandeProduitSchema = new mongoose.Schema({
    produit: { type: mongoose.Schema.Types.ObjectId, ref: "Produit", required: true },
    quantite: { type: Number, required: false },
    date: { type: Date, required: true},
    status: { type: String, enum: ['en cours', 'approuvé', 'rejeté'], default: 'en cours'},
    utilisateur:{ type: mongoose.Schema.Types.ObjectId, ref: "Utilisateur", required: true },
}, {
    timestamps: true // Option de timestamp pour createdAt et updatedAt
});
module.exports = mongoose.model('DemandeProduit', DemandeProduitSchema);
