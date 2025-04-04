const express = require("express");
const factureRouter = express.Router();
const FactureController=require("../controllers/FactureController");
const verifyToken = require('../middlewares/AuthMiddleware');
const RoleMiddleware = require('../middlewares/RoleMiddleware');

//factureRouter.get("/factures_client",[verifyToken], FactureController.readByClient);
//factureRouter.get("/facture_rdv/:rdv",[verifyToken], FactureController.readByScoreDESC);
//factureRouter.get("/detail_facture/:facture",[verifyToken], FactureController.readById);
factureRouter.get('/', [verifyToken,RoleMiddleware.adminRole], FactureController.getFactures);
factureRouter.get('/client', [verifyToken], FactureController.getFacturesByClient);

module.exports = factureRouter;


