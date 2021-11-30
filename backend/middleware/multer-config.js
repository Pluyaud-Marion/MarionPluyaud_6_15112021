// package pour gérer les requêtes http avec envoi de fichiers
const multer = require('multer');

//dictionnaire MIME_TYPES 
const MIME_TYPES = {
    'image/jpg' :'jpg',
    'image/jpeg' : 'jpg',
    'image/png' : 'png'
};

const storage = multer.diskStorage({
    //destination de stockage du fichier
    destination : (req, file, callback) => {
        callback(null, 'images')
    },
    //générer un nom de fichier unique
    filename : (req, file, callback) => {
        //remplace les espaces par _
        const name = file.originalname.split(' ').join('_');
        // rajoute extension fichier
        const extension = MIME_TYPES[file.mimetype];
        //génère un nom de fichier unique grâce à date.now
        callback(null, name + Date.now() + '.' + extension);
    }
});

//single -> fichier unique
module.exports = multer({ storage }).single('image');