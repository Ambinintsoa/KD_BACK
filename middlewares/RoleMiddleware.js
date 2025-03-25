const jwt = require('jsonwebtoken');

function adminRole(req,res,next){
    const token = req.header('Authorization');

    if (!token || !token.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Permission non accordé' });
    }
    try {
        const token_without_bearer = token.split(' ')[1];
        const decoded = jwt.verify(token_without_bearer, process.env.SECRET_KEY_ACCESS);
        req.userId = decoded.userId;
        if(decoded.role==="admin"){
            next()
        }else{
             res.status(401).json({ error: 'Vous n\'avez pas la permission pour cette fonction' + error });
        }
    } catch (error) {
        res.status(401).json({ error: 'Invalid token' + error });
    }
}

function clientRole(req,res,next){
    const token = req.header('Authorization');

    if (!token || !token.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Permission non accordé' });
    }
    try {
        const token_without_bearer = token.split(' ')[1];
        const decoded = jwt.verify(token_without_bearer, process.env.SECRET_KEY_ACCESS);
        req.userId = decoded.userId;
        if(decoded.role==="client"){ // changer en client
            next()
        }else{
             res.status(401).json({ error: 'Vous n\'avez pas la permission pour cette fonction' + error });
        }
    } catch (error) {
        res.status(401).json({ error: 'Invalid token' + error });
    }
}
function managerRole(req,res,next){
    const token = req.header('Authorization');

    if (!token || !token.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Permission non accordé' });
    }
    try {
        const token_without_bearer = token.split(' ')[1];
        const decoded = jwt.verify(token_without_bearer, process.env.SECRET_KEY_ACCESS);
        req.userId = decoded.userId;
        if(decoded.role==="admin"){ // changer en client
            next()
        }else{
             res.status(401).json({ error: 'Vous n\'avez pas la permission pour cette fonction' + error });
        }
    } catch (error) {
        res.status(401).json({ error: 'Invalid token' + error });
    }
}
module.exports = {adminRole,clientRole,managerRole};
