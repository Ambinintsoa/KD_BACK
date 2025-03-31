const mongoose = require("mongoose");

const CategorieVoitureSchema = new mongoose.Schema({
    nom: { type: String, required: true },
    statut: { type:Number,required:true,default:0}
}, {
    timestamps: true // Option de timestamp pour createdAt et updatedAt
});
module.exports = mongoose.model('CategorieVoiture', CategorieVoitureSchema);