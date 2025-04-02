const express = require("express");
const productRouter = express.Router();
const ProduitController=require("../controllers/ProduitController");
const verifyToken = require('../middlewares/AuthMiddleware');
const DemandeProduitController = require('../controllers/DemandeProduitController');
const RoleMiddleware = require('../middlewares/RoleMiddleware');
//upload file
const multer = require('multer');
const EntreeStockController = require("../controllers/EntreeStockController");
// Configuration de multer pour les fichiers
const upload = multer({ storage: multer.memoryStorage() });
productRouter.post("/save",[verifyToken,RoleMiddleware.adminRole], ProduitController.save);
productRouter.put("/update",[verifyToken,RoleMiddleware.adminRole], ProduitController.update);
productRouter.delete("",[verifyToken,RoleMiddleware.adminRole], ProduitController.delete);

productRouter.get("",[verifyToken], ProduitController.read);
productRouter.get("/search/:page",[verifyToken], ProduitController.readBy);
productRouter.get("/id/:id",[verifyToken], ProduitController.readById);
productRouter.post("/import",upload.single('file'),[verifyToken], ProduitController.import);
productRouter.get("/export",[verifyToken], ProduitController.export);
// Route pour demander un réassort
productRouter.post('/reassort',[verifyToken], DemandeProduitController.requestReassort);

// Route pour lister les demandes de réassort
productRouter.get('/reassort-requests', [verifyToken], DemandeProduitController.listReassortRequests);
// Routes pour les entrées de stock
productRouter.post('/stock-entry',  [verifyToken], upload.single('invoice'), EntreeStockController.addStockEntry);
productRouter.get('/stock-entries',  [verifyToken], EntreeStockController.listStockEntries);
productRouter.delete('/stock-entry/:id', [verifyToken], EntreeStockController.deleteStockEntry); //
productRouter.delete('/reassort/:id', [verifyToken], DemandeProduitController.delete); //
module.exports = productRouter;


