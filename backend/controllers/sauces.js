//importation du modèle Sauce
const Sauce = require('../models/Sauce');

//importation du package fs
const fs = require('fs');

//route pour créer une sauce
exports.createSauce = (req, res, next) => { 
    const sauceObject = JSON.parse(req.body.sauce);
    const sauce = new Sauce({
        ...sauceObject,
        imageUrl : `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
    sauce.save()
    .then(() => res.status(201).json({ message: 'Sauce enregistrée !' }))
    .catch(error => res.status(400).json({ error }))
};

//route pour obtenir toutes les sauces de la base de données
exports.getAllSauces = (req, res, next) => {
    Sauce.find()
    .then((allSauces) => res.status(200).json(allSauces))
    .catch(error => res.status(400).json({error}))
};

//on récupère l'id de la sauce passé dans la requête + on lui rajoute une clé '_id' pour format attendu par mongodb
exports.getOneSauce = (req, res, next) => {
    Sauce
    .findOne({ _id : req.params.id})
    .then( sauce => res.status(200).json(sauce))
    .catch(error => res.status(404).json({error}))
};

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