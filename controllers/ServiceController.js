const Service = require("../models/Service");
const ServiceService= require("../services/ServiceService");

exports.save = async (req, res) => {
    try {
        const serviceData = req.body;
        const errors = [];

        // Vérification si une catégorie existe déjà avec le même nom
        const existingCategorieCount = await ServiceService.countDocuments({
            nom_service: serviceData.nom_service.trim()
        });

        if (existingCategorieCount > 0) {
            errors.push({
                field: "nom_service",
                message: "Il y a déjà un service portant ce nom"
            });
        }

        if (serviceData.duree <= 0) {
            errors.push({
                field: "duree",
                message: "La durée est invalide"
            });
        }

        if (serviceData.prix <= 0) {
            errors.push({
                field: "prix",
                message: "Le prix est invalide"
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
}

exports.read = async (req, res) => {
    try {
        
        let page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 10;
        let search = req.query.search || ''; 
        let sortBy = req.query.sortBy || 'nom_service'; 
        let sortOrder = req.query.orderBy; 
        let { services, total } = await ServiceService.read(page, limit, search, sortBy, sortOrder);
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

exports.readBy = async(req,res)=>{
    try {
        let page=req.params.page || 1;
        let limit=10;
        const offset = (page - 1) * limit;
        let services=await ServiceService.readBy(offset,limit,req.body);

        res.status(200).json({ services:services });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
}

exports.readById = async(req,res)=>{
    try {
        let service=await ServiceService.readById(req.params.id);

        res.status(200).json({ service:service });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
}

exports.update = async(req,res)=>{
    try {
        const serviceData = req.body;
            const existingService = await Service.findOne({
                    nom_service: serviceData.nom_service.trim(),
                    _id: { $ne: serviceData._id }
                  });
                  
                if (existingService) {
                    return res.status(400).json({
                        field: "nom_service",
                        message: "Il y a déjà un service portant ce nom"
                    });
                }
        await ServiceService.update(req.body);
        res.status(200).json({ message: "Service modifié avec succès" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
}
exports.delete = async (req, res) => {
    try {
        const ids = req.body;  // Récupère les IDs depuis le corps de la requête
        
        // Vérifie que les IDs sont bien fournis et valides
        if (!ids || !Array.isArray(ids) || ids.length === 0) {
            return res.status(400).json({ error: "Aucun id fourni ou le format est incorrect." });
        }

        let deletionResults = [];  // Tableau pour stocker les résultats de suppression
        
        // Parcours chaque ID pour vérifier s'il est utilisé et effectuer la suppression
        for (const id of ids) {
            // Vérifie si la catégorie est utilisée dans une autre collection
            

            // Effectue la suppression de la catégorie
             await ServiceService.update({ _id: id , statut:1});

                deletionResults.push({
                    id,
                    message: 'Service supprimé avec succès'
                });
        }

        // Renvoie le tableau de résultats de la suppression
        return res.status(200).json({ results: deletionResults });
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Une erreur est survenue lors de la suppression des services", details: error.message });
    }
};





