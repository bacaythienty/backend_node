const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors')
const connectBD = require("./config/db");
const userRoute = require('./routes/user.route')
const questionRoute = require('./routes/question.route');
const commentaireRoute = require('./routes/commentaire.route')

dotenv.config()
const app = express();
connectBD();
app.use(express.json());
app.use(cors({ origin: [
'http://localhost:5173', 'https://front-node-sigma.vercel.app'
]}));
const PORT = process.env.PORT;
app.listen( PORT , () => {
    console.log(`serveur démarré sur http://localhost:${PORT}` );
})

// ---------------les routes ----------

// inscription et connexion
app.use('/api/auth'  , userRoute);
// routes pour les questions
app.use('/api/questions', questionRoute);
// routes pour les commentaires
app.use('/api/commentaires', commentaireRoute);
app.get('/' , (req , res) => {
    res.send('Bienvenue sur mon serveur')
})