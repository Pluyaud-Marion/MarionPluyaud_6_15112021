//importation d'express
const express = require('express');

//importation mongoose
const mongoose = require('mongoose');

//importation userRoutes
const userRoutes = require('./routes/user');

//importation sauceRoutes
const saucesRoutes = require('./routes/sauces');

//création application express
const app = express();

//bodyparser
app.use(express.json());

//Connection à mongoDB
mongoose.connect(`mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.jeboe.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`,
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

// Middleware de paramétrage du CORS
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.use("/api/auth", userRoutes);
app.use("/api/sauces", saucesRoutes);

//exportation de l'application
module.exports = app;