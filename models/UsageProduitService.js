const mongoose = require("mongoose");

const UsageProduitServiceSchema = new mongoose.Schema({
    service: { type: mongoose.Schema.Types.ObjectId, ref: "Service", required: true },
    produit: { type: mongoose.Schema.Types.ObjectId, ref: "Produit", required: true },
    quantite: { type: double, required: true }
}, {
    timestamps: true // Option de timestamp pour createdAt et updatedAt
});
module.exports = mongoose.model('UsageProduitService', UsageProduitServiceSchema);