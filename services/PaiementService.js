const Paiement = require('../models/Paiement');

exports.save = async (paiement_data) => {
    const error_field = [];
    try {
        
        const paiement = new Paiement(paiement_data);
        if (!paiement.facture) {
            error_field.push({ field: "facture", message: "La facture est obligatoire!" });
        }
        if (paiement.montant_payer < 0) {
            error_field.push({ field: "montant", message: "Le montant doit avoir une valeur positive!" });
        }
        if (error_field.length > 0) {
            throw { message: "Validation failed", errors: error_field };
        }
        await paiement.save();

    } catch (error) {
        console.error(error);
        
        if (error.errors) {
            // Renvoyer les erreurs de validation
            throw { message: error.message, errors: error.errors };
        } else {
            // Gestion d'autres erreurs imprévues
            throw new Error("Une erreur interne s'est produite");
        }
    }
};
exports.read=async({ page = 1, limit = 10, search = '', sortBy = 'date', orderBy = 'desc' })=>{
    try{
        const query = search ? { paiement: { $regex: search, $options: 'i' } } : {};
        const sortOrder = orderBy === 'asc' ? 1 : -1;
  
        const paiementList = await Paiement
          .find(query)
          .sort({ [sortBy]: sortOrder })
          .skip((page - 1) * limit)
          .limit(limit);
  
        const totalItems = await Paiement.countDocuments(query);
  
        return {
          paiement: paiementList,
          totalItems,
          totalPages: Math.ceil(totalItems / limit),
          currentPage: page
        };
    }catch (error) {
        console.error(error);
    }
}