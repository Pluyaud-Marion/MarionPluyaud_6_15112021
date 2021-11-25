//importation jsonwebtoken
const jwt = require('jsonwebtoken');

//importation dotenv
const dotenv = require('dotenv');
dotenv.config();


module.exports = (req, res, next) => {
    try{
        //récupère le token dans headers
        const token = req.headers.authorization.split(' ')[1];

        //Décode le token -> récupère userId
        //Donne l'accès au contenu de res.locals.token dans d'autres fichiers  -> qui contient l'userId
        res.locals.token = jwt.verify(token, `${process.env.KEY_TOKEN}`);
    
        if (req.body.userId && req.body.userId !== res.locals.token.userId){
            throw "UserId non valide"
        }else{
            next()
        }
    }catch{
        res.status(401).json({ 
            error : new Error ('Requête non authentifié')
        });
    }
}
