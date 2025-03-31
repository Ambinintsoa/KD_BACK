const express = require("express");
const marqueRouter = express.Router();
const MarqueController=require("../controllers/MarqueController");
const verifyToken = require('../middlewares/AuthMiddleware');
const RoleMiddleware = require('../middlewares/RoleMiddleware');

marqueRouter.post("/save",[verifyToken,RoleMiddleware.adminRole], MarqueController.save);
marqueRouter.put("/update",[verifyToken,RoleMiddleware.adminRole], MarqueController.update);
marqueRouter.delete("/:id",[verifyToken,RoleMiddleware.adminRole], MarqueController.delete);

marqueRouter.get("/:page",[verifyToken], MarqueController.read);
marqueRouter.get("/search/:page",[verifyToken], MarqueController.readBy);
marqueRouter.get("/id/:id",[verifyToken], MarqueController.readById);


module.exports = marqueRouter;


