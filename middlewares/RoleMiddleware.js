const jwt = require('jsonwebtoken');

function checkRole(token,role,req,next){
   

    if (!token || !token.startsWith('Bearer ')) {
        throw new Error('Permission non accordé');
    }
    try {
        const token_without_bearer = token.split(' ')[1];
        const decoded = jwt.verify(token_without_bearer, process.env.SECRET_KEY_ACCESS);
        req.userId = decoded.userId;
        console.log(decoded.role);
        if(decoded.role===role){ 
            next()
        }else{
             throw new Error('Vous n\'avez pas la permission pour cette fonction' );
        }
    } catch (error) {
        throw new Error('Invalid token' + error);
    }
}
function adminRole(req,res,next){
    const token = req.header('Authorization');
    try {
       
        checkRole(token,"admin",req,next);
    } catch (error) {
        res.status(401).json({ error: 'Invalid token' + error });
    }
}

function clientRole(req,res,next){
    const token = req.header('Authorization');
    try {
        checkRole(token,"client",req,next);
    } catch (error) {
        res.status(401).json({ error: 'Invalid token' + error });
    }
    
}

function managerRole(req,res,next){
    const token = req.header('Authorization');
    try {
       
        checkRole(token,"admin",req,next);
    } catch (error) {
        res.status(401).json({ error: 'Invalid token' + error });
    }
}
module.exports = {adminRole,clientRole,managerRole};
