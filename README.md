# NodeExpressMongoDB
MongoDB relation + authenticate + create entry + nodemailer

ECF DWWM / 14-04-2021  
Antoine DUPUY          
NodeJS                 
Template: ejs         
Database: MongoDB

ECF Developpeur Web / Web Mobile : PAGE D'AUTHENTIFICATION ET GESTION D'UNE PAGE CONTACT

Pour portail d'authentification :
=================================

Nom d'utilisateur : Qoophee
Password : dwwm78660

cf. le fichier 'db.contacts.users' dans le dossier 'db'

Actions réalisées lors de l'évalution :
======================================

----------------------------------------------------------------------------------------------------------------------------
1°/ Création d'une base de données et implémentation de quelques data pour les tests (cf le dossier 'db')
----------------------------------------------------------------------------------------------------------------------------
2°/ Création d'une app sous NodeJs avec un moteur de view ejs, et connexion à la db créée
----------------------------------------------------------------------------------------------------------------------------
3°/ Page d'accueil : formulaire d'authentification avec traitement des erreurs
----------------------------------------------------------------------------------------------------------------------------
4°/ Page de contact : formulaire et création de contact dans la base de données selon les données saisies par l'utilisateur (avec vérifications préalables)
----------------------------------------------------------------------------------------------------------------------------
5°/ Gestion des envois d'emails à la création du contact (email de bienvenue pour le contact, et email contenant le message du contact au 'service client')
----------------------------------------------------------------------------------------------------------------------------
6°/ Création d'une page permettant à l'utilisateur de supprimer ses data de notre base de données (via un lien présent dans l'email de bienvenue envoyé).
    (ou sur la page http://localhost:3000/deleteContact)
----------------------------------------------------------------------------------------------------------------------------
7°/ Création du header et du footer, intégré à 'layout' et des messages d'erreurs dans le dossier 'partials'
----------------------------------------------------------------------------------------------------------------------------
8°/ Front-end : habillage du projet avec Bootstrap et CSS 
----------------------------------------------------------------------------------------------------------------------------
