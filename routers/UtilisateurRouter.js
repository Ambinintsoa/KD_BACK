const express=require("express");
const userRouter=express.Router();

const UtilisateurController=require("../controllers/UtilisateurController");

userRouter.post("/register", UtilisateurController.register);

module.exports = userRouter;