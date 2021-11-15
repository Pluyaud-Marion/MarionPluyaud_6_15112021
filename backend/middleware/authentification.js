//importation jsonwebtoken
const jwt = require('jsonwebtoken');

//importation dotenv
const dotenv = require('dotenv');
const result = dotenv.config();


//exportation du middleware
module.exports = (res, req, next) => {
    try{
        //récupérer bearer token dans la requête
        const token = req.headers.authorization.split(' ')[1];
        //décoder le token avec la clé de chiffrement
        const decodedToken = jwt.verify(token, `${process.env.KEY_TOKEN}`);
        //récupérer le userId du token
        const userId = decodedToken.userId;
        //si userID en clair ds la requête est différent de l'userID contenu dans le token
        if (req.body.userId && req.body.userId !== userId) {
            throw "User Id non valide";
        }else{
            next();
        }
    }catch(error){ //si pas de token 
        res.status(401).json({error})
    }
   
    

}