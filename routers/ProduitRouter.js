const express = require("express");
const productRouter = express.Router();
const ProduitController=require("../controllers/ProduitController");
const verifyToken = require('../middlewares/AuthMiddleware');
const RoleMiddleware = require('../middlewares/RoleMiddleware');

productRouter.post("/save",[verifyToken,RoleMiddleware.adminRole], ProduitController.save);
productRouter.put("/update",[verifyToken,RoleMiddleware.adminRole], ProduitController.update);
productRouter.delete("/:id",[verifyToken,RoleMiddleware.adminRole], ProduitController.delete);

productRouter.get("",[verifyToken], ProduitController.read);
productRouter.get("/search/:page",[verifyToken], ProduitController.readBy);
productRouter.get("/id/:id",[verifyToken], ProduitController.readById);


module.exports = productRouter;


