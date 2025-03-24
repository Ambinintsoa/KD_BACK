const mongoose = require("mongoose");

const MarqueSchema = new mongoose.Schema({
    nom_marque: { type: String, required: true },
    statut: { type:Number,required:true,default:0}
}, {
    timestamps: true // Option de timestamp pour createdAt et updatedAt
});
module.exports = mongoose.model('Marque', MarqueSchema);