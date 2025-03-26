const CategorieServiceModel=require("../models/CategorieService");
const CategorieService=require("../services/CategorieService");
const ServiceService=require("../services/ServiceService");

// Code backend (Express)
exports.save = async (req, res) => {
    try {
        const categorieData = req.body;

        // Vérification si le champ 'nom_categorie' est renseigné
        if (!categorieData.nom_categorie) {
            return res.status(400).json({
                field: "nom_categorie",
                message: "Le nom de la catégorie est obligatoire !"
            });
        }

        // Vérification si une catégorie existe déjà avec le même nom
        const existingCategorieCount = await CategorieService.countDocuments({
            nom_categorie: categorieData.nom_categorie.trim()
        });

        if (existingCategorieCount > 0) {
            return res.status(400).json({
                field: "nom_categorie",
                message: "Il y a déjà une catégorie portant ce nom"
            });
        }

        // Sauvegarde de la nouvelle catégorie
        categorieData.nom_categorie = categorieData.nom_categorie.trim();
        await CategorieService.save(categorieData);

        res.status(201).json({ message: "Insertion réussie" });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Une erreur est survenue lors de la sauvegarde.",
            error: error.message || error
        });
    }
};



exports.read = async (req, res) => {
    try {
        
        let page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 10;
        let search = req.query.search || ''; 
        let sortBy = req.query.sortBy || 'nom_categorie'; 
        let sortOrder = req.query.orderBy; 
        const filters = { statut: 0 };
        let { categories, total } = await CategorieService.read(page, limit, search, sortBy, sortOrder,filters);
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

exports.getAll = async (req, res) => {
    try {
        
        let { categories, total } = await CategorieService.getAll();
        res.status(200).json({ 
            categories,
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
        let categories=await CategorieService.readBy(offset,limit,req.body);

        res.status(200).json({ categories:categories });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
}

exports.readById = async(req,res)=>{
    try {
        let categorie=await CategorieService.readById(req.params.id);

        res.status(200).json({ categorie:categorie });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
}

exports.update = async(req,res)=>{
    try {
        const categorieData = req.body;
        const existingCategorie = await CategorieServiceModel.findOne({
            nom_categorie: categorieData.nom_categorie.trim(),
            _id: { $ne: categorieData._id }
          });
          
        if (existingCategorie) {
            return res.status(400).json({
                field: "nom_categorie",
                message: "Il y a déjà une catégorie portant ce nom"
            });
        }

        await CategorieService.update(req.body);
        res.status(200).json({ message: "Categorie modifiée avec succès" });

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
            const isUsedInOtherCollection = await ServiceService.countDocuments({ categorie_service: id });

            if (isUsedInOtherCollection > 0) {
                deletionResults.push({
                    id,
                    message: 'La catégorie est liée à une autre collection et ne peut pas être supprimée'
                });
                continue;  // Passe à l'ID suivant
            }

            // Effectue la suppression de la catégorie
            

            try {
              await CategorieService.update({ _id: id, statut: 1 });
                    deletionResults.push({
                        id,
                        message: 'Catégorie supprimée avec succès'
                    });
            } catch (error) {
                console.error(`Erreur lors de la suppression de la catégorie ${id}:`, error);
                deletionResults.push({
                    id,
                    message: 'Erreur lors de la suppression de la catégorie'
                });
            }
        }

        // Renvoie le tableau de résultats de la suppression
        return res.status(200).json({ results: deletionResults });
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Une erreur est survenue lors de la suppression des catégories", details: error.message });
    }
};



