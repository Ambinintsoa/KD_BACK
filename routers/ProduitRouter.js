const express = require("express");
const productRouter = express.Router();
const ProduitController=require("../controllers/ProduitController");
const verifyToken = require('../middlewares/AuthMiddleware');
const RoleMiddleware = require('../middlewares/RoleMiddleware');

productRouter.post("/save",[verifyToken,RoleMiddleware.adminRole], ProduitController.save);


module.exports = productRouter;


