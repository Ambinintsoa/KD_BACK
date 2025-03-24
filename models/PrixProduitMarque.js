const mongoose = require("mongoose");

const PrixProduitMarqueSchema = new mongoose.Schema({
    produit: { type: mongoose.Schema.Types.ObjectId, ref: "Produit", required: true },
    marque: { type: mongoose.Schema.Types.ObjectId, ref: "Marque", required: true },
    prix: { type: Number, required: false },
    statut: { type: String, required: true ,default:0}
}, {
    timestamps: true // Option de timestamp pour createdAt et updatedAt
});
module.exports = mongoose.model('PrixProduitMarque', PrixProduitMarqueSchema);
