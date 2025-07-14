const CategorieVoitureService= require("../services/CategorieVoitureService");
const CategorieVoiture = require("../models/CategorieVoiture")
exports.save = async(req,res)=>{
    try {
        const categorieData = req.body;
        if (!categorieData.nom_categorie) {
            return res.status(400).json({
                field: "nom_categorie",
                message: "Le nom de la categorie est obligatoire !"
            });
        }
          const existingCategorieVoitureCount = await CategorieVoitureService.countDocuments({
                    nom_categorie: categorieData.nom_categorie.trim()
                });
        
                if (existingCategorieVoitureCount > 0) {
                    return res.status(400).json({
                        field: "nom_categorie",
                        message: "Il y a déjà une categorie portant ce nom"
                    });
                }
        
        await CategorieVoitureService.save(req.body);
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
        let sortBy = req.query.sortBy || 'nom'; 
        let sortOrder = req.query.orderBy; 
        let { categories, total } = await CategorieVoitureService.read(page, limit, search, sortBy, sortOrder);
        
        res.status(200).json({ 
            categories,
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
        let categories=await CategorieVoitureService.readBy(offset,limit,req.body);

        res.status(200).json({ categories:categories });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
}

exports.readById = async(req,res)=>{
    try {
        let categorie=await CategorieVoitureService.readById(req.params.id);

        res.status(200).json({ categorie:categorie });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
}

exports.update = async(req,res)=>{
    try {
        const categorieData = req.body;
           const existingCategorieVoiture = await CategorieVoiture.findOne({
                    nom_categorie: categorieData.nom_categorie.trim(),
                    _id: { $ne: categorieData._id }
                  });
                  
                if (existingCategorieVoiture) {
                    return res.status(400).json({
                        field: "nom_categorie",
                        message: "Il y a déjà une categorie portant ce nom"
                    });
                }
        
        await CategorieVoitureService.update(req.body);
        res.status(200).json({ message: "Categorie Voiture modifiée avec succès" });

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
          await CategorieVoitureService.update({ _id: id, statut: 1 });

                deletionResults.push({
                    id,
                    message: 'Categorie Voiture supprimée avec succès'
                });
        }

        // Renvoie le tableau de résultats de la suppression
        return res.status(200).json({ results: deletionResults });
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Une erreur est survenue lors de la suppression des categories", details: error.message });
    }
};





