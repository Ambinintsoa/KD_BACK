const mongoose = require("mongoose");

const DetailsFactureSchema = new mongoose.Schema({
    prix: { type:Number, required: true },
    facture: { type: mongoose.Schema.Types.ObjectId, ref: "Facture", required: true },
    service: { type: mongoose.Schema.Types.ObjectId, ref: "Service", required: false  },
    produit: { type: mongoose.Schema.Types.ObjectId, ref: "Produit", required: false },
    quantite: { type: Number, required: true, default: 1 }
}, {
  timestamps: true // Option de timestamp pour createdAt et updatedAt
});
module.exports = mongoose.model('DetailsFacture',DetailsFactureSchema);
