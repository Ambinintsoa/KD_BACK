const Facture = require("../models/Facture");
const Paiement = require("../models/Paiement");
const DetailsFacture = require("../models/DetailsFacture");

exports.saveDetailsFacture = async (details_facture_object, id_facture, session_object) => {
    try {
        if (details_facture_object.service_details) {
            // Sauvegarde du service
            let temp_service = new DetailsFacture({
                prix: details_facture_object.service_details.prix,
                facture: id_facture,
                service: details_facture_object.service_details._id
            });
            await temp_service.save({ session: session_object });

        }



        // Sauvegarde des produits s'il y en a
        if (details_facture_object.produits?.length > 0) {
            for (const produit of details_facture_object.produits) {
                let temp_produit = new DetailsFacture({
                    prix: produit.prix,
                    quantite: produit.quantite,
                    facture: id_facture,
                    produit: produit.produit._id
                });

                await temp_produit.save({ session: session_object });
            }
        }

    } catch (error) {
        console.error("Erreur lors de l'enregistrement des détails de la facture :", error);
        throw error;
    }
};

exports.saveFacture = async (data_facture, rendez_vous, client, session_object) => {
    try {
        let facture_object = new Facture({
            rendez_vous: rendez_vous,
            montant_total: data_facture.total_devis,
            client: client,
            numero_facture: "FAC0" + await getNumeroFacture(),
            date: new Date()
        });

        // Sauvegarde avec session
        let last_facture = await facture_object.save({ session: session_object });

        // Sauvegarde des détails de devis liés à la facture
        for (const details of data_facture.devis_details) {
            await this.saveDetailsFacture(details, last_facture._id, session_object);
        }

    } catch (error) {
        console.error("Erreur lors de la sauvegarde de la facture :", error);
        throw error;
    }
};

const getNumeroFacture = async () => {
    try {
        let count = await Facture.countDocuments();
        return count + 1;
    } catch (error) {
        console.error("Erreur lors de la récupération du numéro de facture :", error);
        throw error;
    }
};

exports.readFactureByRendezVous = async (rendez_vous) => {

    try {
        let res = await Facture.find({ rendez_vous });

        return res;
    } catch (error) {
        console.error("Erreur lors de la récupération du numéro de facture :", error);
        throw error;
    }
}
exports.readDetailFactureByFacture = async (id_facture) => {

    try {
        let res = await DetailsFacture.find({ facture: id_facture })
            .populate("service")
            .populate("produit");

        return res;

    } catch (error) {
        console.error("Erreur lors de la récupération du numéro de facture :", error);
        throw error;
    }
}
exports.readFactureByClient = async (client) => {

    try {
        let res = await Facture.find({ client });

        return res;
    } catch (error) {
        console.error("Erreur lors de la récupération du numéro de facture :", error);
        throw error;
    }
}


exports.getFactures = async (params) =>{
    const { page = 1, limit = 10, search = '', sortBy = 'date', orderBy = 'desc' } = params;
    
    const query = search ? {
      $or: [
        { numero_facture: { $regex: search, $options: 'i' } },
      ]
    } : {};

    const factures = await Facture.find(query)
      .populate('client', 'nom email')
      .populate('rendez_vous')
      .sort({ [sortBy]: orderBy === 'asc' ? 1 : -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    const details = await DetailsFacture.find({
      facture: { $in: factures.map(f => f._id) }
    })
      .populate('service')
      .populate('produit')
      .lean();

    const paiements = await Paiement.find({
      facture: { $in: factures.map(f => f._id) }
    }).lean();

    const totalItems = await Facture.countDocuments(query);

    const enrichedFactures = factures.map(facture => ({
      ...facture,
      details: details.filter(d => d.facture.toString() === facture._id.toString()),
      paiements: paiements.filter(p => p.facture.toString() === facture._id.toString())
    }));

    return {
      factures: enrichedFactures,
      totalItems,
      totalPages: Math.ceil(totalItems / limit),
      currentPage: page
    };
  }
   exports.getFacturesByUser = async(params, userId)=> {  // Add userId parameter
    const { page = 1, limit = 10, search = '', sortBy = 'date', orderBy = 'desc' } = params;
    
    // Add client filter to only get invoices where the user is the client
    const query = {
      client: userId,  // Filter by the current user's ID
      ...(search ? {
        $or: [
          { numero_facture: { $regex: search, $options: 'i' } },
        ]
      } : {})
    };

    const factures = await Facture.find(query)
      .populate('client', 'nom email')
      .populate('rendez_vous')
      .sort({ [sortBy]: orderBy === 'asc' ? 1 : -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    const details = await DetailsFacture.find({
      facture: { $in: factures.map(f => f._id) }
    })
      .populate('service')
      .populate('produit')
      .lean();

    const paiements = await Paiement.find({
      facture: { $in: factures.map(f => f._id) }
    }).lean();

    const totalItems = await Facture.countDocuments(query);

    const enrichedFactures = factures.map(facture => ({
      ...facture,
      details: details.filter(d => d.facture.toString() === facture._id.toString()),
      paiements: paiements.filter(p => p.facture.toString() === facture._id.toString())
    }));

    return {
      factures: enrichedFactures,
      totalItems,
      totalPages: Math.ceil(totalItems / limit),
      currentPage: page
    };
  }
