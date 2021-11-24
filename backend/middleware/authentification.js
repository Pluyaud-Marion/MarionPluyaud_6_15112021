//importation jsonwebtoken
const jwt = require('jsonwebtoken');

//importation dotenv
const dotenv = require('dotenv');
dotenv.config();


module.exports = (req, res, next) => {
    try{
        const token = req.headers.authorization.split(' ')[1];

        //Donne l'accès au contenu de req.token dans d'autres fichiers  -> qui contient l'userId
        req.token = jwt.verify(token, `${process.env.KEY_TOKEN}`);

        //console.log(req.token);
        if (req.body.userId && req.body.userId !== req.token.userId){
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
