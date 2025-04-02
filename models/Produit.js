const mongoose = require("mongoose");

const ProduitSchema = new mongoose.Schema({
    nom_produit: { type: String, required: true },
    unite: { type: String, required: true },
    statut: { type:Number,required:true,default:0},
    est_disponible: { type:Number,required:true,default:1},
    stock: { type:Number,required:true,default:0}, 
    demande: { type:Number,required:true,default:0},
}, {
    timestamps: true // Option de timestamp pour createdAt et updatedAt
});
module.exports = mongoose.model('Produit', ProduitSchema);