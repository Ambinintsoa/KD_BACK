const userService=require("../services/UtilisateurService");

exports.register=async(req,res)=>{
    try {
        await userService.saveUser(req.body);
        res.status(201).json({message:"Inscription à succes"});
    } catch (error) {
        console.error(error);
        res.status(500).json({error:error.message});
    }
}