const Produit=require('../models/Produit');

// enregistre un produit
exports.saveProduit= async(produitData)=>{
    try{
        const produit=new Produit(produitData);
        if(!produit.nom_produit || !produit.unite) throw new Error("Le nom du produit et l'unité sont obligatoires !");
        
        if(! await Produit.find({nom_produit:produit.nom_produit})){
            produit.save();
        }else{
            throw new Error("Il y a déjà un produit de ce nom!");
        }
    }catch(error){
        console.error(error);
        throw error;
    }
}