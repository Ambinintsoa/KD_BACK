const CategorieService=require("../services/CategorieService");

exports.save = async(req,res)=>{
    try {
        await CategorieService.save(req.body);
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
        let sortBy = req.query.sortBy || 'nom_categorie'; 
        let sortOrder = req.query.orderBy; 
        let { categories, total } = await CategorieService.read(page, limit, search, sortBy, sortOrder);
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
        await CategorieService.update(req.body);
        res.status(200).json({ message: "Categorie modifiée avec succès" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
}
exports.delete = async(req,res)=>{
    try {
        await CategorieService.delete(req.params.id);
        res.status(200).json({ message: " Categorie effacée avec succès" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
}


