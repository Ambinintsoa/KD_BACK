const CategorieService = require("../models/CategorieService");
const ServiceService = require("./ServiceService");
const { Op } = require("sequelize");
const ExcelJS = require('exceljs');
// enregistre une categorie
exports.save = async (categorieData) => {
  try {
    const categorie = new CategorieService(categorieData);
    if (!categorie.nom_categorie)
      throw new Error("Le nom du categorie est obligatoire !");

    if (
      (await CategorieService.countDocuments({
        nom_categorie: categorie.nom_categorie.trim(),
      })) < 1
    ) {
      categorie.nom_categorie = categorie.nom_categorie.trim();
      await categorie.save();
    } else {
      throw new Error("Il y a déjà une categorie portant ce nom");
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
};
// liste de categories
exports.getAll = async (query = {}, sortOption = { nom_categorie: 1 }) => {
  try {
    // Récupération des catégories avec collation, tri par nom_categorie croissant (ASC)
    const categories = await CategorieService.find(query)
      .collation({ locale: "fr", strength: 2 })
      .sort(sortOption); // Tri par nom_categorie ascendant

    // Comptage des documents (total)
    const total = await CategorieService.countDocuments(query);

    // Retourner les catégories et le total
    return { categories, total };
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des catégories : ",
      error.message
    );
    throw new Error("Erreur lors de la récupération des catégories");
  }
};
//list of categories to export
exports.export=async()=>{
    return await CategorieService.find({'statut': 0});
}


// liste de categories avec pagination
exports.read = async (page, limit, search, sortBy, sortOrder, filters = {}) => {
  try {
    const query = {
      ...(search ? { nom_categorie: { $regex: search, $options: "i" } } : {}),
      statut: 0 // <-- on filtre dans la recherche ET le count
  };

    const sortOption = {};
    sortOption[sortBy] = sortOrder === "desc" ? -1 : 1; // Tri ascendant ou descendant
    if (page < 1) {
      page = 1;
    }
    const categories = await CategorieService.find(query)
      .collation({ locale: "fr", strength: 2 })
      .sort(sortOption)
      .skip((page - 1) * limit)
      .limit(limit);
    const total = await CategorieService.countDocuments(query);

    return { categories, total };
  } catch (error) {
    throw new Error("Erreur lors de la récupération des catégories");
  }
};
// liste de categories avec pagination et filtre => condition "et"
exports.readBy = async (offset, limit, data) => {
  try {
    return await CategorieService.find(data).skip(offset).limit(limit);
  } catch (error) {
    console.error(error);
    throw error;
  }
};

//retourne une categorie a partir de son id
exports.readById = async (id) => {
  try {
    return await CategorieService.findOne({ _id: id });
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// modifie les données Obliger d'avoir _id
exports.update = async (data) => {
  try {
    const categorie = new CategorieService(data);
    const initial_categorie = await CategorieService.findOne({
      _id: categorie._id,
    });
    if (!initial_categorie) throw new Error("Aucun categorie correspondant !");
    if (categorie.nom_categorie) {
      initial_categorie.nom_categorie =
        (categorie.nom_categorie && categorie.nom_categorie.trim()) ||
        initial_categorie.nom_categorie; // Mise à jour de l'attribut
    }
    if (categorie.statut) {
      initial_categorie.statut = categorie.statut || initial_categorie.statut; // Mise à jour de l'attribut
    }
    await initial_categorie.save(); // Sauvegarde les modifications
  } catch (error) {
    console.error(error);
    throw error;
  }
};

exports.countDocuments = async (filter) => {
  try {
    const count = await CategorieService.countDocuments(filter);
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

    const expectedColumns = ["nom"];
    const headers = worksheet.getRow(1).values.slice(1);

    if (!expectedColumns.every((col) => headers.includes(col))) {
      throw new Error("Colonnes invalides. Attendu : nom");
    }

    const categories = [];
    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber > 1) {
        const categorie = {
          nom_categorie: row.getCell(1).value,
        };
        categories.push(categorie);
      }
    });

    const errors = [];
    for (let rowNumber = 0; rowNumber < categories.length; rowNumber++) {
      if (!categories[rowNumber].nom_categorie) {
        errors.push(`Ligne ${index + 2} : Le nom est requis`);
      }
 if( (await CategorieService.countDocuments({
        nom_categorie: categories[rowNumber].nom_categorie.trim(),
      })) >= 1){
        errors.push(`Ligne ${rowNumber + 2} : Le nom est déjà attribué`);
      }
    };

    if (errors.length > 0) {
      return { success: false, errors };
    }

    await CategorieService.insertMany(categories);
    return { success: true, message: "Catégories insérés avec succès" };
  } catch (error) {
    if (error.code === 11000) {
      return { success: false, errors: ["Une catégorie avec ce nom existe déjà"] };
    }
    return { success: false, errors: [error.message] };
  }
};
