const FactureService=require('../services/FactureService');

exports.readFactureByClient=async(req,res)=>{
    try{
        const token = req.header('Authorization');

        if (!token || !token.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'Permission non accordé' });
        }
      
            const token_without_bearer = token.split(' ')[1];
            const decoded = jwt.verify(token_without_bearer, process.env.SECRET_KEY_ACCESS);
            const client = decoded.userId;
    
        
       let factures= await FactureService.readFactureByClient(client);
        res.status(201).json({ factures:factures });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
}
exports.readFactureByRDV=async(req,res)=>{
    try{
         let factures=await FactureService.readFactureByRendezVous(req.params.rdv);
         res.status(201).json({ factures:factures });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
}
exports.readDetailFactureByFacture=async(req,res)=>{
    try{
         let factures=await FactureService.readDetailFactureByFacture(req.params.facture);
         res.status(201).json({ factures:factures });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
}