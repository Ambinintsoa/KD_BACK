const express = require("express");
const productRouter = express.Router();
const ProduitController=require("../controllers/ProduitController");
const verifyToken = require('../middlewares/AuthMiddleware');
const RoleMiddleware = require('../middlewares/RoleMiddleware');
//upload file
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
productRouter.post("/save",[verifyToken,RoleMiddleware.adminRole], ProduitController.save);
productRouter.put("/update",[verifyToken,RoleMiddleware.adminRole], ProduitController.update);
productRouter.delete("",[verifyToken,RoleMiddleware.adminRole], ProduitController.delete);

productRouter.get("",[verifyToken], ProduitController.read);
productRouter.get("/search/:page",[verifyToken], ProduitController.readBy);
productRouter.get("/id/:id",[verifyToken], ProduitController.readById);
productRouter.post("/import",upload.single('file'),[verifyToken], ProduitController.import);
productRouter.get("/export",[verifyToken], ProduitController.export);

module.exports = productRouter;


