// services/GraphService.js
const Paiement = require('../models/Paiement');
const RendezVous = require('../models/RendezVous');
const StockProduit = require('../models/StockProduit');
const AvisClient = require('../models/AvisClient');
const DetailsFacture = require('../models/DetailsFacture');

class GraphService {
    async getPaiementsParMois() {
        const anneeActuelle = new Date().getFullYear();

        // Pipeline d'agrégation MongoDB
        const result = await Paiement.aggregate([
            // Filtrer les paiements de l'année en cours
            {
                $match: {
                    date_heure: {
                        $gte: new Date(`${anneeActuelle}-01-01`),
                        $lte: new Date(`${anneeActuelle}-12-31`)
                    }
                }
            },
            // Grouper par mois
            {
                $group: {
                    _id: { $month: "$date_heure" }, // Extraire le mois (1-12)
                    totalMontant: { $sum: "$montant_payer" }, // Somme des montants
                    nombrePaiements: { $sum: 1 } // Compter le nombre de paiements
                }
            },
            // Trier par mois
            {
                $sort: { "_id": 1 }
            },
            // Formater la sortie
            {
                $project: {
                    mois: "$_id",
                    totalMontant: 1,
                    nombrePaiements: 1,
                    _id: 0
                }
            }
        ]);

        // Créer un tableau complet pour tous les mois (1 à 12)
        const moisComplet = Array.from({ length: 12 }, (_, i) => ({
            mois: i + 1,
            totalMontant: 0,
            nombrePaiements: 0
        }));

        // Remplir avec les données réelles
        result.forEach(data => {
            moisComplet[data.mois - 1] = {
                mois: data.mois,
                totalMontant: data.totalMontant || 0,
                nombrePaiements: data.nombrePaiements || 0
            };
        });

        return moisComplet;
    }
    async getTotalsThisYear() {
        const anneeActuelle = new Date().getFullYear(); // 2025

        // Nombre total de rendez-vous
        const totalRendezVous = await RendezVous.countDocuments({
            date_heure_debut: {
                $gte: new Date(`${anneeActuelle}-01-01`),
                $lte: new Date(`${anneeActuelle}-12-31`)
            }
        });

        // Somme totale des paiements
        const paiementResult = await Paiement.aggregate([
            {
                $match: {
                    date_heure: {
                        $gte: new Date(`${anneeActuelle}-01-01`),
                        $lte: new Date(`${anneeActuelle}-12-31`)
                    }
                }
            },
            {
                $group: {
                    _id: null,
                    totalMontant: { $sum: "$montant_payer" }
                }
            },
            {
                $project: {
                    _id: 0,
                    totalMontant: 1
                }
            }
        ]);

        // Somme totale de quantite_entree * prix_unitaire
        const stockResult = await StockProduit.aggregate([
            {
                $match: {
                    date: {
                        $gte: new Date(`${anneeActuelle}-01-01`),
                        $lte: new Date(`${anneeActuelle}-12-31`)
                    }
                }
            },
            {
                $group: {
                    _id: null,
                    totalStockValue: {
                        $sum: { $multiply: ["$quantite_entree", "$prix_unitaire"] }
                    }
                }
            },
            {
                $project: {
                    _id: 0,
                    totalStockValue: 1
                }
            }
        ]);

        // Extraction des valeurs avec des valeurs par défaut
        const totalMontant = paiementResult.length > 0 ? paiementResult[0].totalMontant : 0;
        const totalStockValue = stockResult.length > 0 ? stockResult[0].totalStockValue : 0;

        // Calcul du chiffre d'affaires
        const totalChiffreAffaire = totalMontant - totalStockValue;

        return {
            totalRendezVous: totalRendezVous,
            totalMontant: totalMontant,
            totalStockValue: totalStockValue,
            totalChiffreAffaire: totalChiffreAffaire
        };
    }
    async getScoreDistributionThisYear() {
        const anneeActuelle = new Date().getFullYear(); // 2025

        const result = await AvisClient.aggregate([
            {
                $match: {
                    date: {
                        $gte: new Date(`${anneeActuelle}-01-01`),
                        $lte: new Date(`${anneeActuelle}-12-31`)
                    },
                    est_valide: true // Ne compter que les avis validés
                }
            },
            {
                $group: {
                    _id: "$score",
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { "_id": 1 } // Trier par score croissant
            },
            {
                $project: {
                    _id: 0,
                    score: "$_id",
                    count: 1
                }
            }
        ]);

        // Créer un tableau complet pour tous les scores possibles (0 à 5)
        const scores = [0, 1, 2, 3, 4, 5];
        const distribution = scores.map(score => ({
            score: score,
            count: 0
        }));

        // Remplir avec les données réelles
        result.forEach(data => {
            const index = scores.indexOf(data.score);
            if (index !== -1) {
                distribution[index].count = data.count;
            }
        });

        return distribution;
    }
    async getTop10ServicesThisYear() {
        const anneeActuelle = new Date().getFullYear(); // 2025

        const result = await DetailsFacture.aggregate([
            {
                $match: {
                    createdAt: {
                        $gte: new Date(`${anneeActuelle}-01-01`),
                        $lte: new Date(`${anneeActuelle}-12-31`)
                    },
                    service: { $ne: null } // Exclure les entrées sans service
                }
            },
            {
                $group: {
                    _id: "$service",
                    count: { $sum: "$quantite" } // Compter la quantité totale par service
                }
            },
            {
                $sort: { count: -1 } // Trier par ordre décroissant
            },
            {
                $limit: 10 // Limiter aux 10 premiers
            },
            {
                $lookup: {
                    from: 'services', // Nom de la collection dans MongoDB
                    localField: '_id',
                    foreignField: '_id',
                    as: 'serviceDetails'
                }
            },
            {
                $unwind: '$serviceDetails'
            },
            {
                $project: {
                    _id: 0,
                    serviceId: '$_id',
                    nom: '$serviceDetails.nom',
                    categorie: '$serviceDetails.categorie',
                    count: 1
                }
            }
        ]);

        // Calculer le total des quantités pour déterminer les pourcentages
        const totalCount = result.reduce((sum, item) => sum + item.count, 0);
        return result.map(item => ({
            ...item,
            percentage: totalCount > 0 ? (item.count / totalCount * 100).toFixed(2) : 0
        }));
    }
    async getTop10MostExpensiveProductsThisYear() {
        const anneeActuelle = new Date().getFullYear(); // 2025

        const result = await StockProduit.aggregate([
            {
                $match: {
                    date: {
                        $gte: new Date(`${anneeActuelle}-01-01`),
                        $lte: new Date(`${anneeActuelle}-12-31`)
                    },
                    produit: { $ne: null }, // Exclure les lignes sans produit
                    quantite_entree: { $gt: 0 }, // S'assurer que quantite_entree est positive
                    prix_unitaire: { $gt: 0 } // S'assurer que prix_unitaire est positif
                }
            },
            {
                $group: {
                    _id: "$produit",
                    totalValue: { $sum: { $multiply: ["$quantite_entree", "$prix_unitaire"] } }, // Somme de quantite_entree * prix_unitaire
                    latestPrixUnitaire: { $last: "$prix_unitaire" }, // Dernier prix unitaire pour l'affichage
                    totalQuantiteEntree: { $sum: "$quantite_entree" }
                }
            },
            {
                $sort: { totalValue: -1 } // Trier par valeur totale décroissante
            },
            {
                $limit: 10 // Limiter aux 10 premiers
            },
            {
                $lookup: {
                    from: 'produits', // Nom de la collection dans MongoDB
                    localField: '_id',
                    foreignField: '_id',
                    as: 'produitDetails'
                }
            },
            {
                $unwind: '$produitDetails'
            },
            {
                $project: {
                    _id: 0,
                    produitId: '$_id',
                    nom: '$produitDetails.nom_produit',
                    image: '$produitDetails.image',
                    totalValue: 1,
                    prixUnitaire: '$latestPrixUnitaire',
                    quantiteEntree: '$totalQuantiteEntree'
                }
            }
        ]);

        return result;
    }
}

module.exports = new GraphService();