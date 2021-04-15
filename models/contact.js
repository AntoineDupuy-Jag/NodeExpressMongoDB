/*=======================================
|           SCHEMA DE CONTACT           | 
======================================*/

// Importation du module mongoose ->
const mongoose = require('mongoose');

// Instanciation d'un objet Schema permettant de définir la structure des données attendues ->
const contactSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        trim: true,
    },
}); // EO contactSchema

// Ici on exporte le schéma créé ci-dessus ->
module.exports = mongoose.model('contact', contactSchema);