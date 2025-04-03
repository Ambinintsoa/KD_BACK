const express = require("express");
const graphRouter = express.Router();

const GraphController=require("../controllers/GraphController");

const verifyToken = require('../middlewares/AuthMiddleware');
const RoleMiddleware = require('../middlewares/RoleMiddleware');

graphRouter.get('/paiement/mois', [verifyToken,RoleMiddleware.adminRole], GraphController.getPaiementsParMois);
graphRouter.get('/total', [verifyToken,RoleMiddleware.adminRole], GraphController.getTotalsThisYear);
graphRouter.get('/score-distribution', [verifyToken,RoleMiddleware.adminRole], GraphController.getScoreDistributionThisYear);
graphRouter.get('/top-10-services', [verifyToken,RoleMiddleware.adminRole], GraphController.getTop10ServicesThisYear);
graphRouter.get('/top-10-expensive-products', [verifyToken,RoleMiddleware.adminRole], GraphController.getTop10MostExpensiveProductsThisYear);
module.exports = graphRouter;
