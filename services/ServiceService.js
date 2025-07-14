const Service = require("../models/Service");
const RendezVous = require("../models/RendezVous");
const Tache = require("../models/Tache");

const CategorieService = require("../models/CategorieService");
const { Op } = require("sequelize");
const ExcelJS = require("exceljs");
const mongoose = require("mongoose");

// enregistre un service
exports.save = async (serviceData) => {
  try {
    const service = new Service(serviceData);
    if (!service.nom_service || !service.categorie_service)
      throw new Error(
        "Le nom du service et la catégorie du service sont obligatoires !"
      );

    if (
      (await Service.countDocuments({
        nom_service: service.nom_service.trim(),
      })) < 1
    ) {
      service.nom_service = service.nom_service.trim();
      await service.save();
    } else {
      throw new Error("Il y a déjà un service portant ce nom");
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
};
// liste de services avec pagination
exports.read = async (page, limit, search, sortBy, sortOrder) => {
  try {
    const query = search
      ? {
        $or: [
          { category_name: { $regex: search, $options: "i" } },
          { nom_service: { $regex: search, $options: "i" } }
        ],
        statut: 0
      }
      : { statut: 0 };


    const sortOption = {};
    sortOption[sortBy] = sortOrder === "desc" ? -1 : 1; // Tri ascendant ou descendant
    if (page < 1) {
      page = 1;
    }

    const services = await Service.find(query)
      .collation({ locale: "fr", strength: 2 }) // Collation pour tri insensible à la casse
      .sort(sortOption)
      .skip((page - 1) * limit)
      .limit(limit)
      .populate("categorie_service", "nom_categorie")
      .set("strictPopulate", false);

    const total = await Service.countDocuments(query);
    return { services, total };
  } catch (error) {
    throw new Error("Erreur lors de la récupération des services");
  }
};
// liste de services avec pagination et filtre => condition "et"
exports.readBy = async (offset, limit, data) => {
  try {
    return await Service.find(data).skip(offset).limit(limit).populate("categorie_service");
  } catch (error) {
    console.error(error);
    throw error;
  }
}
exports.getAllServicesByCategories = async () => {
  try {
    let all_categories = await CategorieService.find({ statut: 0 });
    let liste_categories_services = [];
    for (const element of all_categories) {
      const temp_services = await Service.find({ categorie_service: element._id });
      const temp_object = { categorie_service: element, service_object: temp_services };
      liste_categories_services.push(temp_object);
    }

    return liste_categories_services;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

//retourne un service a partir de son id
exports.readById = async (id) => {
  try {
    return await Service.findOne({ _id: id }).populate("categorie_service");
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// modifie les données Obliger d'avoir _id
exports.update = async (data) => {
  try {
    const service = new Service(data);
    const initial_service = await Service.findOne({ _id: service._id });

    if (!initial_service) throw new Error("Aucun service correspondant !");

    if (service.prix && service.prix < 0)
      throw new Error("Le prix doit avoir une valeur positive !");
    if (service.statut) {
      initial_service.statut = service.statut || initial_service.statut;
    } else {
      initial_service.nom_service =
        (service.nom_service && service.nom_service.trim()) || ""; // Mise à jour de l'attribut
      initial_service.duree =
        service.duree || service.duree === 0 ? service.duree : 0; // Mise à jour de l'attribut
      initial_service.prix =
        service.prix || service.prix === 0 ? service.prix : 0; // Mise à jour de l'attribut
      initial_service.categorie_service =
        service.categorie_service._id || initial_service.categorie_service; // Mise à jour de l'attribut
      initial_service.promotions =
        service.promotions || initial_service.promotions; // Mise à jour de l'attribut
    }
    await initial_service.save(); // Sauvegarde les modifications
  } catch (error) {
    console.error(error);
    throw error;
  }
};

exports.countDocuments = async (filter) => {
  try {
    const count = await Service.countDocuments(filter);
    return count;
  } catch (error) {
    console.error("Erreur lors du comptage des documents :", error);
    throw new Error("Erreur lors du comptage des documents");
  }
};
exports.promotions = async () => {
  try {
    const now = new Date(); // Date actuelle fixée pour le test

    const services = await Service.aggregate([
      // Filtrer les services ayant au moins une promotion active
      {
        $match: {
          "promotions.date_debut": { $lte: now },
          "promotions.date_fin": { $gte: now },
          statut: 0, // Optionnel : filtre sur statut actif
        },
      },
      // Filtrer le tableau promotions pour ne garder que les promotions actives
      {
        $project: {
          nom_service: 1,
          duree: 1,
          prix: 1,
          statut: 1,
          categorie_service: 1,
          createdAt: 1,
          updatedAt: 1,
          promotions: {
            $filter: {
              input: "$promotions",
              cond: {
                $and: [
                  { $lte: ["$$this.date_debut", now] },
                  { $gte: ["$$this.date_fin", now] },
                ],
              },
            },
          },
        },
      },
      // Peupler categorie_service
      {
        $lookup: {
          from: "categorieservices", // Nom de la collection (minuscule par défaut)
          localField: "categorie_service",
          foreignField: "_id",
          as: "categorie_service",
        },
      },
      {
        $unwind: {
          path: "$categorie_service",
          preserveNullAndEmptyArrays: true,
        },
      },
      // Sélectionner 3 services aléatoirement
      //{ $sample: { size: 3 } }
    ]);

    if (services.length === 0) {
      throw new Error("Aucun service avec promotion active trouvé");
    }

    return services;
  } catch (error) {
    console.error(error);
    throw new Error("Erreur lors de la récuperation des promotions");
  }
};

exports.import = async (filePath) => {
  try {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(filePath);
    const worksheet = workbook.getWorksheet(1);

    const expectedColumns = ["nom", "prix", "catégorie", "durée"];
    const headers = worksheet.getRow(1).values.slice(1);

    if (!expectedColumns.every((col) => headers.includes(col))) {
      throw new Error(
        "Colonnes invalides. Attendu : nom, prix, catégorie, durée"
      );
    }

    const services = [];

    // Utilisation d'une boucle classique pour gérer l'asynchronisme
    for (let rowNumber = 2; rowNumber <= worksheet.rowCount; rowNumber++) {
      const row = worksheet.getRow(rowNumber);

      const categorie = await CategorieService.findOne({
        nom_categorie: row.getCell(3).value,
      });

      const service = {
        nom_service: row.getCell(1).value,
        duree: parseInt(row.getCell(4).value, 10),
        prix: parseInt(row.getCell(2).value, 10),
        categorie_service: categorie?._id || null, // Récupérer uniquement l'ID
        promotions: [],
      };

      services.push(service);
    }

    // Validation des services
    const errors = [];
    for (let rowNumber = 0; rowNumber < services.length; rowNumber++) {
      if (!services[rowNumber].nom_service) {
        errors.push(`Ligne ${rowNumber + 2} : Le nom est requis`);
      }
      if (
        (await Service.countDocuments({
          nom_service: services[rowNumber].nom_service.trim(),
        })) >= 1
      ) {
        errors.push(`Ligne ${rowNumber + 2} : Le nom est déjà attribué`);
      }
      if (!services[rowNumber].categorie_service) {
        errors.push(`Ligne ${rowNumber + 2} : La catégorie est requise`);
      }
      if (
        typeof services[rowNumber].duree !== "number" ||
        isNaN(services[rowNumber].duree) ||
        services[rowNumber].duree < 0
      ) {
        errors.push(
          `Ligne ${index + 2
          } : La durée doit être un nombre positif valide (reçu : ${services[rowNumber].duree
          })`
        );
      }
      if (
        typeof services[rowNumber].prix !== "number" ||
        isNaN(services[rowNumber].prix) ||
        services[rowNumber].prix < 0
      ) {
        errors.push(
          `Ligne ${index + 2
          } : Le prix doit être un nombre positif valide (reçu : ${services[rowNumber].prix
          })`
        );
      }
    }

    if (errors.length > 0) {
      return { success: false, errors };
    }


    await Service.insertMany(services); // Ajout de `await` pour s'assurer de l'insertion

    return { success: true, message: "Services insérés avec succès" };
  } catch (error) {
    if (error.code === 11000) {
      return { success: false, errors: ["Un service avec ce nom existe déjà"] };
    }
    return { success: false, errors: [error.message] };
  }
};
//list of services to export
exports.export = async () => {
  return await Service.find({ statut: 0 }).populate("categorie_service");
};

// liste de services avec pagination
exports.serviceHistory = async (idUser, page, limit, search, sortBy, sortOrder) => {
  try {
    // Construct the dynamic query
    // const query = search
    //   ? {
    //     $and: [
    //       { statut: 0 }, //service a un statut :0
    //       {
    //         $or: [
    //           { "service_details.nom_service": { $regex: search, $options: "i" } }
    //         ]
    //       }
    //     ]
    //   }
    //   : { statut: 0 };

    let total = 0;
    let data = {};


    const sortOption = {};
    sortOption[sortBy] = sortOrder === "desc" ? -1 : 1; // Tri ascendant ou descendant
    if (page < 1) {
      page = 1;
    }

    let offset = (page - 1) * limit;
    await Tache.aggregate([
      {
        $lookup: {
          from: 'rendezvous',
          localField: 'rendez_vous',
          foreignField: '_id',
          as: 'rendez_vous'
        }
      },
      { $unwind: '$rendez_vous' },
      {
        $match: {
          'rendez_vous.client': idUser
        }
      },
      {
        $lookup: {
          from: 'services',
          localField: 'service',
          foreignField: '_id',
          as: 'service'
        }
      },
      { $unwind: '$service' },
      {
        $project: {
          date: '$rendez_vous.date_heure_debut', // Vérifiez le champ exact
          nom_service: '$service.nom_service',
          status: '$statut'
        }
      },
      { $sort: sortOption || { date: 1 } }, // Tri par défaut
      { $limit: parseInt(limit) || 10 },
      { $skip: parseInt(offset) || 0 }
    ])
      .then(result => {
        console.log("Résultat agrégation :", result);
        data = result;
      })
      .catch(err => {
        console.error("Erreur lors de l'agrégation :", err);
      });

    console.log("second");

    // Compter le nombre de documents
    const countPipeline = await Tache.aggregate([
      {
        $lookup: {
          from: 'rendezvous',
          localField: 'rendez_vous',
          foreignField: '_id',
          as: 'rendez_vous'
        }
      },
      {
        $unwind: '$rendez_vous'
      },
      {
        $match: { 'rendez_vous.client': idUser }
      },
      {
        $lookup: {
          from: 'services',
          localField: 'service',
          foreignField: '_id',
          as: 'service'
        }
      },
      {
        $unwind: '$service'
      },
      {
        $count: 'total'
      }
    ]);

    // Récupère le nombre total (si le pipeline retourne des résultats)
    const count = countPipeline.length > 0 ? countPipeline[0].total : 0;
    console.log(count, "nombre total");
    // const total = await RendezVous.countDocuments({ client: userId });

    return { data, count };


  } catch (error) {
    if (error instanceof mongoose.Error) {
      console.error("Mongoose-related error:", error);
    }
    throw new Error("Erreur lors de la récupération des services");
  }
};