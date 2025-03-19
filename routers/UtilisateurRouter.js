const express = require("express");
const userRouter = express.Router();
const verifyToken = require('../middlewares/AuthMiddleware');
const UtilisateurController = require("../controllers/UtilisateurController");

userRouter.post("/register", UtilisateurController.register);
userRouter.put("/update",[verifyToken], UtilisateurController.update);
userRouter.post("/login", UtilisateurController.login);
userRouter.get("/refresh",UtilisateurController.refreshToken);
userRouter.get("/:page",verifyToken,UtilisateurController.read);

module.exports = userRouter;