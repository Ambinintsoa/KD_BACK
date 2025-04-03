const ProduitService = require("../services/ProduitService");
const Produit = require("../models/Produit");
const ExcelJS = require("exceljs");
const fs = require("fs");
exports.save = async (req, res) => {
  try {
    const produitData = req.body;
    if (!produitData.nom_produit) {
      return res.status(400).json({
        field: "nom_produit",
        message: "Le nom du produit est obligatoire !",
      });
    }
    const existingCategorieCount = await ProduitService.countDocuments({
      nom_produit: produitData.nom_produit.trim(),
    });

    if (existingCategorieCount > 0) {
      return res.status(400).json({
        field: "nom_produit",
        message: "Il y a déjà un produit portant ce nom",
      });
    }

    await ProduitService.save(req.body);
    res.status(201).json({ message: "Insertion réussie" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

exports.read = async (req, res) => {
  try {
    let page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    let search = req.query.search || "";
    let sortBy = req.query.sortBy || "nom_produit";
    let sortOrder = req.query.orderBy;
    let { produits, total } = await ProduitService.read(
      page,
      limit,
      search,
      sortBy,
      sortOrder
    );
    res.status(200).json({
      produits,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalItems: total,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

exports.readBy = async (req, res) => {
  try {
    let page = req.params.page || 1;
    let limit = 10;
    const offset = (page - 1) * limit;
    let produits = await ProduitService.readBy(offset, limit, req.body);

    res.status(200).json({ produits: produits });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

exports.readById = async (req, res) => {
  try {
    let produit = await ProduitService.readById(req.params.id);

    res.status(200).json({ produit: produit });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const produitData = req.body;
    const existingProduit = await Produit.findOne({
      nom_produit: produitData.nom_produit.trim(),
      _id: { $ne: produitData._id },
    });

    if (existingProduit) {
      return res.status(400).json({
        field: "nom_produit",
        message: "Il y a déjà un produit portant ce nom",
      });
    }

    await ProduitService.update(req.body);
    res.status(200).json({ message: "Produit modifié avec succès" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};
exports.delete = async (req, res) => {
  try {
    const ids = req.body; // Récupère les IDs depuis le corps de la requête

    // Vérifie que les IDs sont bien fournis et valides
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res
        .status(400)
        .json({ error: "Aucun id fourni ou le format est incorrect." });
    }

    let deletionResults = []; // Tableau pour stocker les résultats de suppression

    // Parcours chaque ID pour vérifier s'il est utilisé et effectuer la suppression
    for (const id of ids) {
      // Vérifie si la catégorie est utilisée dans une autre collection

      // Effectue la suppression de la catégorie
      await ProduitService.update({ _id: id, statut: 1 });

      deletionResults.push({
        id,
        message: "Produit supprimé avec succès",
      });
    }

    // Renvoie le tableau de résultats de la suppression
    return res.status(200).json({ results: deletionResults });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Une erreur est survenue lors de la suppression des produits",
      details: error.message,
    });
  }
};
exports.import = async (req, res) => {
  try {
    const result = await ProduitService.import(req.file.path);
    // Supprime le fichier après le traitement
    await fs.promises.unlink(req.file.path);
    if (!result.success) {
      return res.status(400).json({ errors: result.errors });
    }

    res.status(200).json({ message: result.message });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Erreur interne du serveur" });
  }
};
exports.export = async (req, res) => {
  try {
    // Récupérer tous les éléments depuis la base de données
    const produits = await ProduitService.export();
    // Créer un nouveau classeur Excel
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Catégories");

    // Définir les colonnes
    worksheet.columns = [
      { header: "nom", key: "nom", width: 20 },
      { header: "unité", key: "unité", width: 20 },
    ];

    // Ajouter les données
    produits.forEach((produit) => {
      worksheet.addRow({
        nom: produit.nom_produit,
        unité: produit.unite,
      });
    });

    // Configurer les en-têtes pour le téléchargement
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader("Content-Disposition", "attachment; filename=produits.xlsx");

    // Écrire le fichier dans la réponse
    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    res
      .status(500)
      .json({ error: "Erreur lors de l'exportation : " + error.message });
  }
  
};
exports.getProduits=async (req, res)=> {
  try {
      const produits = await ProduitService.getAllProduits();
      res.json(produits);
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
}

exports.getProduitsByService= async(req, res)=> {
  try {
      const produits = await ProduitService.getProduitsByService(req.params.serviceId);
      res.json(produits);
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
}

exports.addProduitToService= async(req, res) =>{
  try {
      const { produitId, quantite } = req.body;
      const result = await ProduitService.addProduitToService(
          req.params.serviceId,
          produitId,
          quantite
      );
      res.json(result);
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
}

exports.removeProduitFromService = async(req, res) =>{
  try {
      const result = await ProduitService.removeProduitFromService(
          req.params.serviceId,
          req.body.produitId
      );
      res.json(result);
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
}