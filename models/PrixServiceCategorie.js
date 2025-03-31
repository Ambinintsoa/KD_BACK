const mongoose = require("mongoose");

const PrixServiceCategorieSchema = new mongoose.Schema({
    service: { type: mongoose.Schema.Types.ObjectId, ref: "Service", required: true },
    categorie_voiture: { type: mongoose.Schema.Types.ObjectId, ref: "CategorieVoiture", required: true },
    prix: { type: Number, required: false },
    statut: { type: String, required: true ,default:0}
}, {
    timestamps: true // Option de timestamp pour createdAt et updatedAt
});
module.exports = mongoose.model('PrixServiceCategorie', PrixServiceCategorieSchema);
