const mongoose = require("mongoose");

const StockProduitSchema = new mongoose.Schema({
    produit: { type: mongoose.Schema.Types.ObjectId, ref: "Produit", required: true },
    quantite_entree: { type: Number, required: false },
    quantite_demande: { type: Number, required: false },
    quantite_sortie: { type:Number,  required: false },
    prix_unitaire: { type: Number, required: false },
    date: { type: Date, required: true},
    facture_url: { type: String, required: false},
     utilisateur:{ type: mongoose.Schema.Types.ObjectId, ref: "Utilisateur", required: false },
}, {
    timestamps: true // Option de timestamp pour createdAt et updatedAt
});
module.exports = mongoose.model('StockProduit', StockProduitSchema);
