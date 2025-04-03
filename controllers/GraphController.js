// controllers/GraphController.js
const GraphService = require('../services/GraphService');

    exports.getPaiementsParMois = async(req, res) =>{
        try {
            const data = await GraphService.getPaiementsParMois();
            res.json({
                success: true,
                data: data
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }
     exports.getTotalsThisYear = async(req, res)=> {
        try {
            const totals = await GraphService.getTotalsThisYear();
            res.json({
                success: true,
                data: totals
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }
    exports.getScoreDistributionThisYear= async(req, res)=> {
        try {
            const data = await GraphService.getScoreDistributionThisYear();
            res.json({
                success: true,
                data: data
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }
    exports.getTop10ServicesThisYear =async(req, res) =>{
        try {
            const data = await GraphService.getTop10ServicesThisYear();
            res.json({
                success: true,
                data: data
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }
     exports.getTop10MostExpensiveProductsThisYear= async(req, res) =>{
        try {
            const data = await GraphService.getTop10MostExpensiveProductsThisYear();
            res.json({
                success: true,
                data: data
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }