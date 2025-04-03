const PaiementService=require('../services/PaiementService');

exports.save=async(req,res)=>{
    try {
        await PaiementService.save(req.body);
        res.status(200).json({"message":"Payer avec succes"});
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
}

exports.read = async (req, res) => {
    try {
        
        let page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 10;
        let search = req.query.search || ''; 
        let sortBy = req.query.sortBy || 'date'; 
        let sortOrder = req.query.orderBy; 
        const filters = { statut: 0 };
        let { categories, total } = await PaiementService.read(page, limit, search, sortBy, sortOrder,filters);
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
