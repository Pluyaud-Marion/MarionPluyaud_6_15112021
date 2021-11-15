//importation du modèle Sauce
const Sauce = require('../models/Sauce');

exports.createSauce = (req, res, next) => {
    const sauce = new Sauce({
        userId : req.body.userId,
        name : req.body.name,
        manufacturer : req.body.manufacturer,
        description : req.body.description,
        mainPepper : req.body.mainPepper,
        imageUrl : req.body.imageUrl,
        heat : req.body.heat,
        likes : req.body.likes,
        dislikes : req.body.dislikes
        //imageUrl : `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
    sauce.save()
    .then(() => res.status(201).json({ message: 'Sauce enregistrée !'}))
    .catch(error => res.status(400).json({ error }));
 
};