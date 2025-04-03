const AvisClient = require('../models/AvisClient');

class AvisClientService {
  static async createAvis(avisData) {
    try {
      const avis = new AvisClient(avisData);
      const savedAvis = await avis.save();
      return { success: true, message: 'Avis créé', data: savedAvis };
    } catch (error) {
      throw new Error(`Erreur lors de la création de l’avis : ${error.message}`);
    }
  }

  static async getAvis({ page = 1, limit = 10, search = '', sortBy = 'date', orderBy = 'desc' }) {
    try {
      const query = search ? { avis: { $regex: search, $options: 'i' } } : {};
      const sortOrder = orderBy === 'asc' ? 1 : -1;

      const avisList = await AvisClient
        .find(query)
        .populate('client', 'nom')
        .populate('mecanicien', 'nom')
        .sort({ [sortBy]: sortOrder })
        .skip((page - 1) * limit)
        .limit(limit);

      const totalItems = await AvisClient.countDocuments(query);

      return {
        avis: avisList,
        totalItems,
        totalPages: Math.ceil(totalItems / limit),
        currentPage: page
      };
    } catch (error) {
      throw new Error(`Erreur lors de la récupération des avis : ${error.message}`);
    }
  }

  static async validateAvis(avisId) {
    try {
      const avis = await AvisClient.findByIdAndUpdate(
        avisId,
        { est_valide: true, statut: 1 }, // Valider et publier
        { new: true }
      );
      if (!avis) throw new Error('Avis non trouvé');
      return { success: true, message: 'Avis validé et publié', data: avis };
    } catch (error) {
      throw new Error(`Erreur lors de la validation de l’avis : ${error.message}`);
    }
  }

  static async deleteAvis(avisId) {
    try {
      const avis = await AvisClient.findByIdAndDelete(avisId);
      if (!avis) throw new Error('Avis non trouvé');
      return { success: true, message: 'Avis supprimé' };
    } catch (error) {
      throw new Error(`Erreur lors de la suppression de l’avis : ${error.message}`);
    }
  }
  static async getValidatedAvisRandom(limit = 5) {
    try {
      const avisList = await AvisClient
        .aggregate([
          { $match: { est_valide: true, statut: 1 } }, // Filtrer les avis validés et publiés
          { $sample: { size: limit } }, // Sélectionner aléatoirement 'limit' éléments
          {
            $lookup: {
              from: 'utilisateurs',
              localField: 'client',
              foreignField: '_id',
              as: 'client'
            }
          },
          { $unwind: { path: '$client', preserveNullAndEmptyArrays: true } },
          {
            $lookup: {
              from: 'utilisateurs',
              localField: 'mecanicien',
              foreignField: '_id',
              as: 'mecanicien'
            }
          },
          { $unwind: { path: '$mecanicien', preserveNullAndEmptyArrays: true } }
        ]);

      return { avis: avisList };
    } catch (error) {
      throw new Error(`Erreur lors de la récupération des avis validés : ${error.message}`);
    }
  }
}

module.exports = AvisClientService;