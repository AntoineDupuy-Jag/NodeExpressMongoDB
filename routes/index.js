/*===============================
|      MODULES DEPENDENCIES     |
==============================*/

require('dotenv').config();
var express = require('express');
var router = express.Router();
const User = require('../models/users');
const Contact = require('../models/contact');
const { check, validationResult } = require('express-validator');
//__________________________________________________________________

/*==============================================
|   PAGE D'ACCUEIL (Formulaire de connexion)   |
=============================================*/

router.get('/', (req, res) => {
    res.render('index')
}); // EO get

/*===============================================
|     TRAITEMENT DU FORMULAIRE DE CONNEXION     |
==============================================*/

router.post('/', async(req, res) => {

    // Fonction pour authentification utilisateur ->
    function authenticate(pseudo, password) {

        User.findOne({ pseudo: pseudo })
            .exec(function(err, User) {
                if (!User) {
                    res.render('index', {
                        errorMessage: "Nom d'utilisateur incorrect"
                    })
                } else if (password === User.password) {
                    res.render('contact')
                    console.log(`${pseudo} is connected !`.bgBlack.green)
                } else {
                    res.render('index', {
                        errorMessage: "Mot de passe incorrect"
                    })
                }
            });
    }; // EO authenticate

    // Appel de la fonction authenticate, avec les champs saisies par l'utilisateur en paramètres ->
    authenticate(req.body.pseudo, req.body.password)

}); // EO post

//__________________________________________________________________

/*========================
|      PAGE CONTACT      |
=======================*/

router.get('/contact', (req, res) => {
    res.render('contact')
}); // EO get

/*===============================================
|      TRAITEMENT DU FORMULAIRE DE CONTACT      |
==============================================*/

router.post('/contact', [
    check('name')
    .isLength({ min: 3, max: 16 })
    .withMessage("Le champ 'Nom d'utilisateur' ne doit contenir qu'entre 3 et 16 caractères"),

    check('email')
    .isEmail()
    .withMessage("Merci d'entrer un format d'adresse e-mail valide, exemple : 'exemple@email.com'")
    .bail()
    .trim()
    .normalizeEmail(),

    check('msg')
    .isLength({ min: 1, max: 255 })
    .withMessage("Taille limite du message : 255 caractères"),
], async(req, res) => {
    // création d'une constante contenant les résultats des checks grâce à validationResult ->
    const errors = validationResult(req)

    // Traitement du formulaire si les saisies sont correctes après vérification ->
    if (errors.isEmpty()) {

        // Création d'un nouveau contact avec les saisies utilisateurs, suivant le modèle importé ->
        const contact = new Contact(req.body)

        // Envoi du nouveau contact vers notre collection à l'aide de .save :
        try {
            await contact.save();
            // Message d'information en vue administrateur ->
            console.log(`New contact saved -> NAME: [ ${contact.name} ] EMAIL: [ ${contact.email} ]`.bgBlack.green);
            // Redirection avec confirmation en vue utilisateur ->
            res.render('contact', {
                validateMessage: "Votre message a bien été envoyé ! Merci !"
            });
            // Envoi de l'e-mail de bienvenue via notre fonction sendWelcomeMail (ci-dessous) ->
            sendWelcomeMail(contact.email, contact.name);
            // Dans le même temps, envoi du message du contact au service en charge de traiter les demandes ->
            sendRequestContact(contact.email, contact.name, req.body.msg)
        } catch {
            res.render('contact', {
                errorMessage: "Votre adresse fait déjà partie de notre base de données, ou une erreur est survenue lors de l'envoi de votre formulaire. Merci de réessayer ultérieurement."
            })
        } // EO try / catch
    } else {
        res.render('contact', {
            errorMessageContact: errors.array()
        });
    }; // EO if
}); // EO post

//__________________________________________________________________

/*=======================
|      PAGE DELETE      |
======================*/

router.get('/deleteContact', (req, res) => {
    res.render('deleteContact')
}); // EO get

/*================================================
|      TRAITEMENT DE SUPPRESSION DU CONTACT      |
===============================================*/

router.post('/deleteContact', (req, res) => {

    // Fonction pour suppression d'un contact ->
    function deleteAccount(email, confirmation) {

        Contact.findOne({ email: email })
            .exec(function(err, Contact) {
                if (!Contact) {
                    res.render('deleteContact', {
                        errorMessage: "Votre adresse e-mail ne fait pas partie de notre base de données"
                    });
                } else {
                    Contact.deleteOne({ email: email })
                    res.render('deleteContact', {
                        validateMessage: "Votre demande a bien été enregistrée. Vous ne faites plus partie de notre base de données."
                    });
                    console.log("Un contact a supprimé ses données de la bd avec succès".bgBlack.green)
                }
            });
    }; // EO deleteAccount

    // Appel de la fonction deleteAccount, avec les champs saisies par l'utilisateur en paramètres ->
    deleteAccount(req.body.email, req.body.check)

}); // EO post

//__________________________________________________________________

/*==================================================
|    ENVOI D'UN E-MAIL AUTOMATIQUE DE BIENVENUE    |
=================================================*/

function sendWelcomeMail(contactAdress, contactName) {

    // Module nodemailer ->
    const nodemailer = require('nodemailer')

    // Etape 1 : Création du 'transporteur' ->
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.MAIL_ADRESS, //  => export des valeurs sensibles dans le fichier .env
            pass: process.env.MAIL_PASSWORD //             (grâce au module dotenv)
        }
    });

    // Etape 2 : paramétrage des options d'envoi ->
    let mailOptions = {
        from: 'efcdwwm@gmail.com',
        to: contactAdress,
        subject: `Bienvenue parmis nous ${contactName} !!!`,
        text: `Bonjour ${contactName}, voila un petit message pour te souhaiter la bienvenue !
        Si tu ne souhaites plus reçevoir d'e-mails de notre part, suit ce lien http://localhost:3000/deleteContact`
    }

    // Etape 3 : fonction envoyant l'email, avec deux paramètres : notre variable mailOptions et une fonction callback ->
    transporter.sendMail(mailOptions, function(err, data) {
        if (err) {
            console.log(`Erreur lors de l'envoi de l'email de bienvenue à [ ${contactName} ] !`.bgBlack.red)
        } else {
            console.log(`Email de bienvenue envoyé à [ ${contactName} ] sur l'adresse [ ${contactAdress} ]`.bgBlack.green)
        }
    });

    /* Etape 4 : modifier les restrictions de sécurité au niveau de notre compte gmail ->
          Lien : https://myaccount.google.com/lesssecureapps 
          Attention : ne pas utiliser sur des adresses sensibles, ou modifier les restrictions de manière plus ciblée */

} // EO sendWelcomeMail

//__________________________________________________________________

/*=========================================================================================================
|    ENVOI D'UN E-MAIL CONTENANT LE MESSAGE UTILISATEUR AU SERVICE TRAITANT LES DEMANDES (par exemple)    |
========================================================================================================*/

// Mêmes étapes que la fonction ci-dessus, on ajoutera le paramètre 'contactRequest' contenant le message du contact à transférer au service concerné ->

function sendRequestContact(contactAdress, contactName, contactRequest) {

    const nodemailer = require('nodemailer')
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.MAIL_ADRESS,
            pass: process.env.MAIL_PASSWORD
        }
    });

    /*  On envoie ici le message du contact au service client, le texte contiendra donc le message du client ainsi que l'heure et la date 
     *  de sa requête. On ajoute l'adresse e-mail et le nom du contact pour faciliter la réponse du service client. */

    let today = new Date();
    todayString = today.toString();

    let mailOptions = {
        from: 'service web',
        to: 'service.client@dwwm.fr',
        subject: `Requête de : ${contactName}`,
        text: "Date : " + todayString + `/ Adresse du contact : ${contactAdress} ` + " / Message : " + contactRequest
    }

    transporter.sendMail(mailOptions, function(err, data) {
        if (err) {
            console.log(`Erreur lors du transfert du message de [ ${contactName} ] au service client, le ${todayString} !`.bgBlack.red)
        } else {
            console.log(`Transfert du message de [ ${contactName} ] au service client le ${todayString}`.bgBlack.green)
        }
    });

} // EO sendRequestContact

//__________________________________________________________________

// Export du router ->
module.exports = router;