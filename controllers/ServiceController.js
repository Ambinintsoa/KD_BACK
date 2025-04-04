const Service = require("../models/Service");
const ServiceService = require("../services/ServiceService");
const ExcelJS = require("exceljs");
const fs = require("fs");
const jwt = require('jsonwebtoken');


exports.save = async (req, res) => {
  try {
    const serviceData = req.body;
    const errors = [];

    // Vérification si une catégorie existe déjà avec le même nom
    const existingCategorieCount = await ServiceService.countDocuments({
      nom_service: serviceData.nom_service.trim(),
    });

    if (existingCategorieCount > 0) {
      errors.push({
        field: "nom_service",
        message: "Il y a déjà un service portant ce nom",
      });
    }

    if (serviceData.duree <= 0) {
      errors.push({
        field: "duree",
        message: "La durée est invalide",
      });
    }

    if (serviceData.prix <= 0) {
      errors.push({
        field: "prix",
        message: "Le prix est invalide",
      });
    }

    // Si des erreurs existent, renvoie-les toutes dans une seule réponse
    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }

    // Si aucune erreur, procéder à l'enregistrement
    await ServiceService.save(serviceData);
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
    let sortBy = req.query.sortBy || "nom_service";
    let sortOrder = req.query.orderBy;
    let { services, total } = await ServiceService.read(
      page,
      limit,
      search,
      sortBy,
      sortOrder
    );
    res.status(200).json({
      services,
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
    let services = await ServiceService.readBy(offset, limit, req.body);

    res.status(200).json({ services: services });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

exports.readById = async (req, res) => {
  try {
    let service = await ServiceService.readById(req.params.id);

    res.status(200).json({ service: service });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const serviceData = req.body;
    const existingService = await Service.findOne({
      nom_service: serviceData.nom_service.trim(),
      _id: { $ne: serviceData._id },
    });
    await ServiceService.update(req.body);
    res.status(200).json({ message: "Service modifié avec succès" });
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
      await ServiceService.update({ _id: id, statut: 1 });

      deletionResults.push({
        id,
        message: "Service supprimé avec succès",
      });
    }

    // Renvoie le tableau de résultats de la suppression
    return res.status(200).json({ results: deletionResults });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({
        error: "Une erreur est survenue lors de la suppression des services",
        details: error.message,
      });
  }
};

exports.allPromotions = async (req, res) => {
  try {
    let promotions = await ServiceService.promotions();
    res.status(200).json({ promotions: promotions });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({
        error: "Une erreur est survenue lors de la récupération des promotions",
        details: error.message,
      });
  }
};

exports.import = async (req, res) => {
  try {
    const result = await ServiceService.import(req.file.path);
    // Supprime le fichier après le traitement
    await fs.promises.unlink(req.file.path);
    if (!result.success) {
      return res.status(400).json({ errors: result.errors });
    }

    res.status(200).json({ message: result.message });
  } catch (error) {
    res.status(500).json({ error: "Erreur interne du serveur" });
  }
};
exports.export = async (req, res) => {
  try {
    // Récupérer tous les éléments depuis la base de données
    const services = await ServiceService.export();
    // Créer un nouveau classeur Excel
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Catégories");

    // Définir les colonnes
    worksheet.columns = [
      { header: "nom", key: "nom", width: 20 },
      { header: "prix", key: "prix", width: 20 },
      { header: "catégorie", key: "catégorie", width: 20 },
      { header: "durée", key: "durée", width: 20 },
    ];

    // Ajouter les données
    services.forEach((service) => {
      worksheet.addRow({
        nom: service.nom_service,
        prix: service.prix,
        catégorie: service.categorie_service.nom_categorie,
        durée: service.duree,
      });
    });

    // Configurer les en-têtes pour le téléchargement
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader("Content-Disposition", "attachment; filename=services.xlsx");

    // Écrire le fichier dans la réponse
    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    res
      .status(500)
      .json({ error: "Erreur lors de l'exportation : " + error.message });
  }
};

exports.getAllServicesByCategories = async (req, res) => {
  try {
    let resultat = await ServiceService.getAllServicesByCategories();
    res.status(201).json({ resultat: resultat });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
}

// function that get the history of services by user generally the client

exports.ServiceHistoryClient = async (req, res) => {
  try {
    let page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    let search = req.query.search || "";
    let sortBy = req.query.sortBy || "nom_service";
    let sortOrder = req.query.orderBy;

    const token = req.header('Authorization');

    if (!token || !token.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Permission non accordé' });
    }

    const token_without_bearer = token.split(' ')[1];
    const decoded = jwt.verify(token_without_bearer, process.env.SECRET_KEY_ACCESS);
    const client = decoded.userId;
    console.log("Before calling",client);


    const { data, total } = await ServiceService.serviceHistory(client, page,
      limit,
      search,
      sortBy,
      sortOrder);

   res.status(200).json({
      data,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalItems: total,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
}