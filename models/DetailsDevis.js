const mongoose = require("mongoose");

const DetailsDevisSchema = new mongoose.Schema({
    prix: { type: Number, required: true },
    devis: { type: mongoose.Schema.Types.ObjectId, ref: "Devis", required: true },
    service: { type: mongoose.Schema.Types.ObjectId, ref: "Service", required: true  },
    usage_produit_service: { type: mongoose.Schema.Types.ObjectId, ref: "Usage_Produit_Service", required: false }
}, {
  timestamps: true // Option de timestamp pour createdAt et updatedAt
});
module.exports = mongoose.model('DetailsDevis',DetailsDevisSchema);
