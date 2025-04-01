const express = require("express");
const categoryRouter = express.Router();
const CategorieController=require("../controllers/CategorieController");
const verifyToken = require('../middlewares/AuthMiddleware');
const RoleMiddleware = require('../middlewares/RoleMiddleware');
//upload file
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
categoryRouter.post("/save",[verifyToken,RoleMiddleware.adminRole], CategorieController.save);
categoryRouter.put("/update",[verifyToken,RoleMiddleware.adminRole], CategorieController.update);
categoryRouter.delete("",[verifyToken,RoleMiddleware.adminRole], CategorieController.delete);

categoryRouter.get("",[verifyToken], CategorieController.read);
categoryRouter.get("/getAll",[verifyToken], CategorieController.getAll);
categoryRouter.get("/search/:page",[verifyToken], CategorieController.readBy);
categoryRouter.get("/id/:id",[verifyToken], CategorieController.readById);
categoryRouter.post("/import",upload.single('file'),[verifyToken], CategorieController.import);
categoryRouter.get("/export",[verifyToken], CategorieController.export);


module.exports = categoryRouter;


