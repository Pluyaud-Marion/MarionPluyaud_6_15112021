//importation du modèle Sauce
const Sauce = require('../models/Sauce');

//importation du package fs
const fs = require('fs');

/*
fonction pour créer une sauce
sauce = instance du modèle Sauce qui contient tout le corps de la requête de l'utilisateur + l'image.
enregistrée dans db
*/
exports.createSauce = (req, res, next) => { 

    const sauceObject = JSON.parse(req.body.sauce);
    
    const sauce = new Sauce({
        //copie les champs dans le corps de la requête et les met dans l'instance sauce
        ...sauceObject,
        imageUrl : `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
    sauce.save()
    .then(() => res.status(201).json({ message: 'Sauce enregistrée !' }))
    .catch(error => res.status(400).json({ error }))
};

/*
fonction pour obtenir toutes les sauces de la base de données
renvoi tableau avec toutes les sauces
*/
exports.getAllSauces = (req, res, next) => {
    Sauce.find()
    .then((allSauces) => {
        res.status(200).json(allSauces)
        //console.log(allSauces)
    })
    .catch(error => res.status(400).json({error}))
    
};

/*
fonction qui récupère une sauce et la renvoi avec son id
on récupère l'id de la sauce passé dans la requête + on lui rajoute une clé '_id' pour format attendu par mongodb
*/
exports.getOneSauce = (req, res, next) => {
    Sauce
    .findOne({ _id : req.params.id})
    .then(sauce => {
        res.status(200).json(sauce)
        //console.log(sauce);
    })
    .catch(error => res.status(404).json({error}))
};

/*
fonction qui met à jour la sauce avec _id fourni
Si un fichier est présent -> on met à jour imageUrl et on prend les infos de la sauce dans req.body.sauce
Si aucun fichier présent -> on prend les infos de la sauce dans le corps de la requete
*/
exports.updateSauce = (req, res, next) => {
    const sauceObject = req.file ?
    {
        ...JSON.parse(req.body.sauce),
        imageUrl : `${req.protocol}://${req.get('host')}/images/${req.file.filename}` 
    } : {...req.body};
    Sauce
    .updateOne({ _id : req.params.id}, {...sauceObject, _id : req.params.id})
    .then(() => res.status(200).json({message : 'La sauce a été modifiée'}))
    .catch(error => res.status(400).json({error}))
};

/*
fonction qui supprime la sauce
*/
exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
    .then(sauce => {
        const filename = sauce.imageUrl.split('/images/')[1];
        fs.unlink(`images/${filename}`, () => {
            Sauce.deleteOne({_id : req.params.id})
            .then(() => res.status(200).json({message : 'La sauce a été supprimée'}))
            .catch(error => res.status(400).json({error}));
        });
    })
    .catch(error => res.status(500).json({error}));
};

exports.likes = (req, res, next) => {
  
    // let like = req.body.like; // affiche 1 ou -1
    // let userId = req.body.userId; // userId
    // let sauceId = req.params.id; // id de la sauce
    
    // switch(like){
    //     //cas like
    //     case 1:
    //         Sauce.updateOne({ _id : sauceId}, { 
    //             $push: {usersLiked : userId }, 
    //             $inc: { likes: +1}
    //         })
    //         .then(() => res.status(201).json({message : "You Like"}))
    //         .catch(error => res.status(400).json({error}))

    //     break

    //     case 0:
    //         Sauce.findOne({ _id : sauceId})
    //         .then(sauce =>{
    //             if(sauce.usersLiked.includes(userId)) {
    //                 Sauce.updateOne({ _id : sauceId},{
    //                     $pull : {usersLiked : userId},
    //                     $inc : { likes : -1}
    //                 })
    //                 .then(()=>res.status(200).json({ message : 'Like annulé'}))
    //                 .catch(error => res.status(400).json(error))
    //             }else if (sauce.usersDisliked.includes(userId)) {
    //                 Sauce.updateOne({ _id : sauceId},{
    //                     $pull : {usersDisliked : userId},
    //                     $inc : { dislikes : -1}
    //                 })
    //                 .then(() => res.status(200).json({ message : 'Dislike annulé'}))
    //                 .catch(error => res.status(400).json(error))
    //             }
    //         })
    //         .catch(error => res.status(400).json({error}))

    //     break

    //     //cas dislike
    //     case -1:
    //         Sauce.updateOne({_id:sauceId}, {
    //             $push: {usersDisliked : userId},
    //             $inc : {dislikes : +1}
    //         })
    //         .then(() => res.status(201).json({message : "You Dislike"}))
    //         .catch(error => res.status(400).json({error}))
    //     break
    // }

    let userId = req.body.userId; // userId
    let sauceId = req.params.id; // id de la sauce

    // si l'utilisateur like la sauce
    if(req.body.like == 1 ){
        // on veut modifier la sauce qui a le params.id contenu dans la requête 
        Sauce.updateOne({ _id : sauceId}, { 
            $push: {usersLiked : userId }, //on ajoute l'userID contenu dans la requête au tableau usersLiked 
            $inc: { likes: +1} //on incrémente le compteur des likes
        })
        .then(() => res.status(201).json({message : "You Like"}))
        .catch(error => res.status(400).json({error}))

    //si l'utilisateur reclique sur like ou dislike    
    } else if(req.body.like == 0){
        Sauce.findOne({ _id : sauceId}) //on cherche la sauce qui a le params.id contenu dans la requête
        .then(sauce =>{
            //si l'utilisateur a déjà liké la sauce = on annule son like
            if(sauce.usersLiked.includes(userId)) {
                Sauce.updateOne({ _id : sauceId},{
                    $pull : {usersLiked : userId},//on retire l'userID contenu dans la requête du tableau usersLiked 
                    $inc : { likes : -1} //on décrémente le compteur des likes
                })
                .then(()=>res.status(200).json({ message : 'Like annulé'}))
                .catch(error => res.status(400).json(error))

            //si l'utilisateur a déjà disliké la sauce = on annule son dislike
            }else if (sauce.usersDisliked.includes(userId)) {
                Sauce.updateOne({ _id : sauceId},{
                    $pull : {usersDisliked : userId},
                    $inc : { dislikes : -1}
                })
                .then(() => res.status(200).json({ message : 'Dislike annulé'}))
                .catch(error => res.status(400).json(error))
            }
        })
        .catch(error => res.status(400).json({error}))

    //si l'utilisateur dislike la sauce
    } else if (req.body.like == -1){
        Sauce.updateOne({_id:sauceId}, {
            $push: {usersDisliked : userId}, //on ajoute l'userID contenu dans la requête au tableau usersDisliked 
            $inc : {dislikes : +1} //on incrémente le compteur des dislikes
        })
        .then(() => res.status(201).json({message : "You Dislike"}))
        .catch(error => res.status(400).json({error}))
    }
};
    


    