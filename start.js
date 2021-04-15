/*-------------------------------
|      MODULES DEPENDENCIES     |
------------------------------*/

require('colors');
require('dotenv').config();

const app = require('./app')
const mongoose = require('mongoose');

/*------------------------------------------------------------
|  LANCEMENT DU SERVEUR ET AFFICHAGE EN VUE ADMINISTRATEUR   |
-----------------------------------------------------------*/

const port = process.env.PORT;

app.listen(port, () => {
    console.log(`\t\t --------------------------------- `.bgWhite.green);
    console.log(`\t\t| Express is running on port ${port} |`.bgWhite.green);
    console.log(`\t\t --------------------------------- `.bgWhite.green);
});

/*------------------------------------------------------------
| CONNEXION A LA BD MONGO ET AFFICHAGE EN VUE ADMINISTRATEUR |
-----------------------------------------------------------*/

const myDb = process.env.DATABASE;

mongoose.connect(myDb, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
const db = mongoose.connection
db.once('open', () => {
    console.log("\t ------------------------------------------------- ".bgBlack.green)
    console.log(`\t| Connected to ${myDb} |`.bgBlack.green);
    console.log("\t ------------------------------------------------- ".bgBlack.green)
})
db.on('error', (err) => {
    console.log(`connection error: ${err.message}`.bgBlack.red);
});