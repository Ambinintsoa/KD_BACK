const express = require("express");
const categoryRouter = express.Router();
const CategorieController=require("../controllers/CategorieController");
const verifyToken = require('../middlewares/AuthMiddleware');
const RoleMiddleware = require('../middlewares/RoleMiddleware');

categoryRouter.post("/save",[verifyToken,RoleMiddleware.adminRole], CategorieController.save);
categoryRouter.put("/update",[verifyToken,RoleMiddleware.adminRole], CategorieController.update);
categoryRouter.delete("/:id",[verifyToken,RoleMiddleware.adminRole], CategorieController.delete);

categoryRouter.get("",[verifyToken], CategorieController.read);
categoryRouter.get("/getAll",[verifyToken], CategorieController.getAll);
categoryRouter.get("/search/:page",[verifyToken], CategorieController.readBy);
categoryRouter.get("/id/:id",[verifyToken], CategorieController.readById);


module.exports = categoryRouter;


