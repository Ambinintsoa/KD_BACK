const express = require("express");
const userRouter = express.Router();
const verifyToken = require('../middlewares/AuthMiddleware');
const UtilisateurController = require("../controllers/UtilisateurController");

userRouter.post("/register", UtilisateurController.register);
userRouter.post("/login", UtilisateurController.login);
userRouter.post("/refresh",UtilisateurController.refreshToken);
userRouter.get("/:page",verifyToken,UtilisateurController.read);
userRouter.get('/', UtilisateurController.read);
userRouter.get('/:id', UtilisateurController.getUtilisateurById);
userRouter.post('/', UtilisateurController.createUtilisateur);
userRouter.put('/:id', UtilisateurController.updateUtilisateur);
userRouter.delete('/:id', UtilisateurController.deleteUtilisateur);
module.exports = userRouter;