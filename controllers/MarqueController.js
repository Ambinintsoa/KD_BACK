const MarqueService= require("../services/MarqueService");
const Marque = require("../models/Marque");
const { filter } = require("lodash");
exports.save = async(req,res)=>{
    try {
        const marqueData = req.body;
        if (!marqueData.nom_marque) {
            return res.status(400).json({
                field: "nom_marque",
                message: "Le nom de la marque est obligatoire !"
            });
        }
          const existingMarqueCount = await MarqueService.countDocuments({
                    nom_marque: marqueData.nom_marque.trim()
                });
        
                if (existingMarqueCount > 0) {
                    return res.status(400).json({
                        field: "nom_marque",
                        message: "Il y a déjà une marque portant ce nom"
                    });
                }
        
        await MarqueService.save(req.body);
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
        let sortBy = req.query.sortBy || 'nom_marque'; 
        let sortOrder = req.query.orderBy; 
        const filters = { statut: 1 }; // Filtre pour les marques actives
        let { marques, total } = await MarqueService.read(page, limit, search, sortBy, sortOrder, filters);
        res.status(200).json({ 
            marques,
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
        let marques=await MarqueService.readBy(offset,limit,req.body);

        res.status(200).json({ marques:marques });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
}

exports.readById = async(req,res)=>{
    try {
        let marque=await MarqueService.readById(req.params.id);

        res.status(200).json({ marque:marque });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
}

exports.update = async(req,res)=>{
    try {
        const marqueData = req.body;
           const existingMarque = await Marque.findOne({
                    nom_marque: marqueData.nom_marque.trim(),
                    _id: { $ne: marqueData._id }
                  });
                  
                if (existingMarque) {
                    return res.status(400).json({
                        field: "nom_marque",
                        message: "Il y a déjà une marque portant ce nom"
                    });
                }
        
        await MarqueService.update(req.body);
        res.status(200).json({ message: "Marque modifiée avec succès" });

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
          await MarqueService.update({ _id: id, statut: 1 });

                deletionResults.push({
                    id,
                    message: 'Marque supprimée avec succès'
                });
        }

        // Renvoie le tableau de résultats de la suppression
        return res.status(200).json({ results: deletionResults });
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Une erreur est survenue lors de la suppression des marques", details: error.message });
    }
};