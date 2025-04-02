const Produit = require("../models/Produit");
const ExcelJS = require('exceljs');
// enregistre un produit
exports.save = async (produitData) => {
  try {
    const produit = new Produit(produitData);
    if (!produit.nom_produit || !produit.unite)
      throw new Error("Le nom du produit et l'unité sont obligatoires !");

    if (
      (await Produit.countDocuments({
        nom_produit: produit.nom_produit.trim(),
      })) < 1
    ) {
      produit.nom_produit = produit.nom_produit.trim();
      produit.unite = produit.unite.trim();
      await produit.save();
    } else {
      throw new Error("Il y a déjà un produit portant ce nom");
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
};
// liste de produits avec pagination
exports.read = async (page, limit, search, sortBy, sortOrder) => {
  try {
    const query = search
      ? { nom_produit: { $regex: search, $options: "i" } } // Recherche insensible à la casse
      : {};

    const sortOption = {};
    sortOption[sortBy] = sortOrder === "desc" ? -1 : 1; // Tri ascendant ou descendant
    if (page < 1) {
      page = 1;
    }
    const produits = await Produit.find(query)
      .collation({ locale: "fr", strength: 2 })
      .sort(sortOption)
      .where("statut", 0)
      .skip((page - 1) * limit)
      .limit(limit);
    const total = await Produit.countDocuments(query);

    return { produits, total };
  } catch (error) {
    console.log(error.message);
    throw new Error("Erreur lors de la récupération des catégories");
  }
};
// liste de produits avec pagination et filtre => condition "et"
exports.readBy = async (offset, limit, data) => {
  try {
    return await Produit.find(data).skip(offset).limit(limit);
  } catch (error) {
    console.error(error);
    throw error;
  }
};
//retourne un produit a partir de son id
exports.readById = async (id) => {
  try {
    return await Produit.findOne({ _id: id });
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// modifie les données Obliger d'avoir _id
exports.update = async (data) => {
  try {
    const produit = new Produit(data);
    const initial_produit = await Produit.findOne({ _id: produit._id });
    if (!initial_produit) throw new Error("Aucun produit correspondant !");
    if (produit.statut) {
      initial_produit.statut = produit.statut || initial_produit.statut; // Mise à jour de l'attribut
    } else {
      initial_produit.nom_produit =
        (produit.nom_produit && produit.nom_produit.trim()) ||
        initial_produit.nom_produit; // Mise à jour de l'attribut
      initial_produit.unite =
        (produit.unite && produit.unite.trim()) || initial_produit.unite; // Mise à jour de l'attribut
    }

    await initial_produit.save(); // Sauvegarde les modifications
  } catch (error) {
    console.error(error);
    throw error;
  }
};
exports.countDocuments = async (filter) => {
  try {
    const count = await Produit.countDocuments(filter);
    return count;
  } catch (error) {
    console.error("Erreur lors du comptage des documents :", error);
    throw new Error("Erreur lors du comptage des documents");
  }
};
exports.import = async (filePath) => {
  try {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(filePath);
    const worksheet = workbook.getWorksheet(1);

    const expectedColumns = ["nom", "unité"];
    const headers = worksheet.getRow(1).values.slice(1);

    if (!expectedColumns.every((col) => headers.includes(col))) {
      throw new Error("Colonnes invalides. Attendu : nom, unité");
    }

    const produits = [];
    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber > 1) {
        const produit = {
          nom_produit: row.getCell(1).value,
          unite:row.getCell(2).value,
        };
        produits.push(produit);
      }
    });

    const errors = [];
    for (let rowNumber = 0; rowNumber < produits.length; rowNumber++) {
      if (!produits[rowNumber].nom_produit) {
        errors.push(`Ligne ${rowNumber + 2} : Le nom est requis`);
      }
      if (!produits[rowNumber].unite) {
        errors.push(`Ligne ${rowNumber + 2} : L'unité est requis`);
      }
      if( (await Produit.countDocuments({
        nom_produit: produits[rowNumber].nom_produit.trim(),
      })) >= 1){
        errors.push(`Ligne ${rowNumber + 2} : Le nom est déjà attribué`);
      }
    };

    if (errors.length > 0) {
      return { success: false, errors };
    }

    await Produit.insertMany(produits);
    return { success: true, message: "Produits insérés avec succès" };
  } catch (error) {
    if (error.code === 11000) {
      return {
        success: false,
        errors: ["Une catégorie avec ce nom existe déjà"],
      };
    }
    return { success: false, errors: [error.message] };
  }
};
//list of produits to export
exports.export=async()=>{
    return await Produit.find({'statut': 0});
}
