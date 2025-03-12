const mongoose = require("mongoose");

const CategorieServiceSchema = new mongoose.Schema({
    nom_categorie: { type: String, required: true },
});
module.exports = mongoose.model('CategorieService', CategorieServiceSchema);
