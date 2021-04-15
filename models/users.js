/*=====================================
|           SCHEMA DE USERS           | 
====================================*/

// Importation du module mongoose ->
const mongoose = require('mongoose');

// Instanciation d'un objet schema permettant de définir la structure des données attendues ->
const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true
    },
    lastName: {
        type: String,
        required: true,
        trim: true
    },
    pseudo: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
}); // EO Schema

// Ici on exporte le schéma créé ci-dessus ->
module.exports = mongoose.model('users', userSchema);