//importation bcrypt pour hasher password
const bcrypt = require('bcrypt');

//importation cryptoJS pour crypter email
const cryptojs = require('crypto-js');

//importation dotenv
const dotenv = require('dotenv');
const result = dotenv.config();

//importation jsonwebtoken pour générer le token
const jwt = require('jsonwebtoken');

//importation du modèle User
const User = require('../models/User');

//fonction signup
exports.signup = (req, res, next) => {
    //chiffrer l'email avant de l'envoyer dans la base de données
    const emailCryptoJs = cryptojs.HmacSHA256(req.body.email, `${process.env.CRYPTOJS_EMAIL}`).toString();

    bcrypt.hash(req.body.password, 10)
    .then(hash => {
        const user = new User ({
            email : emailCryptoJs,
            //email : req.body.email,
            password : hash
        });
        user.save()
        .then(() => res.status(201).json({ message : 'Utilisateur créé et sauvegardé'}))
        .catch(error => res.status(400).json({error}));
    })
    .catch(error => res.status(500).json({error}));
};

//fonction login (+création middleware authentification)
exports.login = (req, res, next) => {
    //chiffrer email de la requête pour comparaison avec db
    const emailCryptoJs = cryptojs.HmacSHA256(req.body.email, `${process.env.CRYPTOJS_EMAIL}`).toString();

    //chercher dans la db si utilisateur est présent et retourne promesse
    User.findOne({email : emailCryptoJs})
    //User.findOne({email : req.body.email})

    //si le mail de l'user n'est pas présent -> il n'existe pas dans la base
    .then(user => {
        if(!user){
            return res.status(401).json({error : "utilisateur inexistant"})
        }

    //controler la validité du password
    bcrypt.compare(req.body.password, user.password) // compare chaine de caractère en clair avec la chaine hashée
        .then(verifPassword => { 
            //si mot de passe incorrect (si renvoi false)
            if (!verifPassword){
                return res.status(401).json({error : "Le mot de passe est incorrect"})
            }else { // si mot de pass correct -> envoi dans la response du serveur de l'user id + du token
                res.status(200).json({ 
                    //encodage du userId pour création de nouveaux objets (objets et userId liés)
                    userId : user._id, //_id contenu dans user précédent
                    token : jwt.sign( // 3 arguments
                        {userId : user._id},
                        `${process.env.KEY_TOKEN}`,
                        {expiresIn: "24h"}
                    )
                });
            }
        })
        .catch(error => res.status(500).json({error}));
    })
    .catch(error => res.status(500).json({error}));
};