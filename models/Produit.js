const mongoose = require("mongoose");

const ProduitSchema = new mongoose.Schema({
    nom_produit: { type: String, required: true },
    unite: { type: String, required: true }
}, {
    timestamps: true // Option de timestamp pour createdAt et updatedAt
});
module.exports = mongoose.model('Produit', ProduitSchema);