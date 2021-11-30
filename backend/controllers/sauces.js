//importation du modèle Sauce
const Sauce = require('../models/Sauce');

//importation du package fs
const fs = require('fs');

//importation http-status
const status = require('http-status');

/*
fonction pour créer une sauce
sauce = instance du modèle Sauce qui contient tout le corps de la requête de l'utilisateur + l'image.
Condition pour vérifier que les 2 usersId sont identiques -> pas de piratage
sauce.userId = l'userId contenu dans l'objet à créer
res.locals.token.userId = userId contenu dans le token de la requête (déchiffré)
*/
exports.createSauce = (req, res, next) => { 
    //transforme les infos de la requête en objet JS
    const sauceObject = JSON.parse(req.body.sauce);
    
    const sauce = new Sauce({
        //copie les champs dans le corps de la requête et les met dans l'instance sauce
        //confifure l'url de l'image
        ...sauceObject,
        imageUrl : `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
    
    if (sauce.userId === res.locals.token.userId){
        //si authentification ok = enregistrement de la sauce dans la base de données mongoDB
        sauce.save()
            .then(() => res.status(status.CREATED).json({ message: 'Sauce enregistrée !' }))
            .catch(error => res.status(status.BAD_REQUEST).json({ error }))
    } else {
        res.status(status.UNAUTHORIZED).json({error : "userId non valide"})
    }
    
};

/*
fonction pour obtenir toutes les sauces de la base de données
renvoi tableau avec toutes les sauces
*/
exports.getAllSauces = (req, res, next) => {
    Sauce.find()
    .then((allSauces) => {
        res.status(status.OK).json(allSauces)
    })
    .catch(error => res.status(status.BAD_REQUEST).json({error}))
    
};

/*
fonction qui récupère une sauce et la renvoi avec son id
on récupère l'id de la sauce passé dans la requête + on lui rajoute une clé '_id' pour format attendu par mongodb
*/
exports.getOneSauce = (req, res, next) => {
    Sauce
    .findOne({ _id : req.params.id})
    .then(sauce => {
        res.status(status.CREATED).json(sauce)
    })
    .catch(error => res.status(status.NOT_FOUND).json({error}))
};

/*
fonction qui met à jour la sauce avec _id fourni
Condition pour vérifier = 
sauceObject.userId = l'id de celui qui a créé la sauce
res.locals.token.userId = id de celui qui veut modifier
Mise à jour de la base de données avec updateOne
*/
exports.updateSauce = (req, res, next) => {
    //opérateur ternaire = fichier image envoyé avec la requête ou non?
    const sauceObject = req.file ?
    //si oui : on copie les champs du corps de la requête et on transforme en objet JS + configuration url de l'image
    //si non : on traite les champs du corps de la requête
    {
        ...JSON.parse(req.body.sauce),
        imageUrl : `${req.protocol}://${req.get('host')}/images/${req.file.filename}` 
    } : {...req.body};

    if (sauceObject.userId === res.locals.token.userId){
        
        Sauce
        //argument 1 : sauce selectionnée (id envoyé avec la requête) / argument 2 : version mise à jour de cette sauce
        .updateOne({ _id : req.params.id}, {...sauceObject, _id : req.params.id})
        .then(() => res.status(status.OK).json({message : 'La sauce a été modifiée'}))
        .catch(error => res.status(status.BAD_REQUEST).json({error}))
    } else {
        res.status(status.UNAUTHORIZED).json({ error : "Pas d'autorisation pour modifier cette sauce"})

    }
};
/*
fonction qui supprime la sauce
On récupère la sauce qui a l'id correspondant à celui des paramètres de requête
Donne une promesse -> contenue dans sauce 
Condition pour vérifier que l'utilisateur qui supprime la sauce est bien celui qui l'a créée 
sauce.userId = l'userId contenu dans la sauce (celui qui a créé la sauce)
res.locals.token.userId = l'userId contenu dans la requête (celui qui veut supprimer)
->si les 2 userId identiques -> on supprime la sauce
*/
exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
    .then(sauce => {
        if(sauce.userId === res.locals.token.userId){
            //récupération du nom du fichier à supprimer et split retourne tableau avec avant / après image -> on prend le chemin après
            const filename = sauce.imageUrl.split('/images/')[1];
            
            //fs.unlink supprime l'image de la base de données
            fs.unlink(`images/${filename}`, () => {
                Sauce.deleteOne({_id : req.params.id}) //supprime sauce par son id de la base de données
                .then(() => res.status(status.OK).json({message : 'La sauce a été supprimée'}))
                .catch(error => res.status(status.BAD_REQUEST).json({error}));
            });
        } else {
            res.status(status.UNAUTHORIZED).json({ error : "Pas d'autorisation pour supprimer cette sauce"})
        }
    })
    .catch(error => res.status(status.INTERNAL_SERVER_ERROR).json({error}));
};

exports.likes = (req, res, next) => {
    let like = req.body.like; // affiche 1, -1 ou 0
    let userId = req.body.userId; // userId
    let sauceId = req.params.id; // id de la sauce

    let deleteDislike = {
        $pull: {usersDisliked : userId}, 
        $inc : {dislikes : -1} 
    };

    let deleteLike = {
        $pull: {usersLiked : userId},
        $inc : { likes : -1}
    };

    let addLike = {
        $push: {usersLiked : userId },
        $inc: { likes: +1}
    };
    let addDislike = {
        $push: {usersDisliked : userId },
        $inc: { dislikes: +1}
    };

    // si l'utilisateur like la sauce
    switch (like) {
        case 1:
            Sauce.findOne({ _id : sauceId})
            .then(sauce =>{
                //on vérifie si l'userId était déjà dans le tableau usersLiked = si oui -> il veut liker 2 fois
                if(sauce.usersLiked.includes(userId)) {
                    //on retire son like du tableau et on décrémente
                    Sauce.updateOne({ _id : sauceId}, deleteLike)
                    .then(() => res.status(status.CREATED).json({message : "Like annulé"}))
                    .catch(error => res.status(status.BAD_REQUEST).json({error}))

                //s'il veut liker alors qu'il est déjà dans le tableau des dislikes
                } else if(sauce.usersDisliked.includes(userId)){
                    return res.status(status.BAD_REQUEST).json({ message : "Annulez d'abord votre dislike"})

                // s'il n'a pas déjà liké ni disliké
                } else { 
                    Sauce.updateOne({ _id : sauceId}, addLike)
                    .then(() => res.status(status.CREATED).json({message : "You Like"}))
                    .catch(error => res.status(status.BAD_REQUEST).json({error}))
                }

            })
            .catch(error => res.status(status.BAD_REQUEST).json({error}));
          
        break;

        //si l'utilisateur reclique sur like ou dislike 
        //CAS TRAITE POUR POSTMAN SI like : 0
        case 0 : 
            Sauce.findOne({ _id : sauceId}) //on cherche la sauce qui a le params.id contenu dans la requête
                .then(sauce =>{
                    //si l'utilisateur a déjà liké la sauce = on annule son like
                    if(sauce.usersLiked.includes(userId)) {
                        Sauce.updateOne({ _id : sauceId}, deleteLike)
                        .then(()=>res.status(status.OK).json({ message : 'Like annulé'}))
                        .catch(error => res.status(status.BAD_REQUEST).json(error))

                    //si l'utilisateur a déjà disliké la sauce = on annule son dislike
                    } else if (sauce.usersDisliked.includes(userId)) {
                        Sauce.updateOne({ _id : sauceId}, deleteDislike)
                        .then(() => res.status(status.OK).json({ message : 'Dislike annulé'}))
                        .catch(error => res.status(status.BAD_REQUEST).json(error))
                    } else {
                        return res.status(status.BAD_REQUEST).json({message : "Vous n'avez pas la possibilité de faire ça!"})
                    }
                })
                .catch(error => res.status(status.BAD_REQUEST).json({error}))
              
        break;

        case -1:
            Sauce.findOne({_id : sauceId})
            .then(sauce =>{
                // on vérifie s'il est déjà ds tableau des dislikes : si oui il veut disliker 2 fois
                // on retire son dislike du tableau et on décrémente(on passe à 0)
                if(sauce.usersDisliked.includes(userId)) {
                    Sauce.updateOne({ _id : sauceId}, deleteDislike)
                    .then(() => res.status(status.CREATED).json({message : "Dislike annulé"}))
                    .catch(error => res.status(status.BAD_REQUEST).json({error}))
                    

                //s'il est déjà dans le tableau des likes et qu'il veut disliker
                } else if(sauce.usersLiked.includes(userId)){
                    return res.status(status.BAD_REQUEST).json({ message : "Annulez d'abord votre like"})

                //s'il n'a pas déjà disliké -> il peut le faire
                } else {
                    Sauce.updateOne({ _id : sauceId}, addDislike)
                    .then(() => res.status(status.CREATED).json({message : "You Dislike"}))
                    .catch(error => res.status(status.BAD_REQUEST).json(error))
                }
            })
            .catch(error => res.status(status.BAD_REQUEST).json({error}))
           
        break;
        // CAS TRAITE POUR POSTMAN -> si l'utilisateur fait autre chose que like : 1 / 0 / -1
        default:
            return res.status(status.BAD_REQUEST).json({message : "Vous n'avez pas la possibilité de faire ça!"})
    }
};
