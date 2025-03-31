const express = require("express");
const CategorieVoitureRouter = express.Router();
const CategorieVoitureController=require("../controllers/CategorieVoitureController");
const verifyToken = require('../middlewares/AuthMiddleware');
const RoleMiddleware = require('../middlewares/RoleMiddleware');

CategorieVoitureRouter.post("/save",[verifyToken,RoleMiddleware.adminRole], CategorieVoitureController.save);
CategorieVoitureRouter.put("/update",[verifyToken,RoleMiddleware.adminRole], CategorieVoitureController.update);
CategorieVoitureRouter.delete("/:id",[verifyToken,RoleMiddleware.adminRole], CategorieVoitureController.delete);

CategorieVoitureRouter.get("/:page",[verifyToken], CategorieVoitureController.read);
CategorieVoitureRouter.get("/search/:page",[verifyToken], CategorieVoitureController.readBy);
CategorieVoitureRouter.get("/id/:id",[verifyToken], CategorieVoitureController.readById);


module.exports = CategorieVoitureRouter;


