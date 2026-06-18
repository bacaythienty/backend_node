const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors')
const connectBD = require("./config/db");
const userRoute = require('./routes/user.route')
const questionRoute = require('./routes/question.route');

dotenv.config()
const app = express();
connectBD();
app.use(express.json());
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
const PORT = process.env.PORT;
app.listen( PORT , () => {
    console.log(`serveur démarré sur http://localhost:${PORT}` );
})

// ---------------les routes ----------

// inscription et connexion
app.use('/api/auth'  , userRoute);
// routes pour les questions
app.use('/api/questions', questionRoute);
app.get('/' , (req , res) => {
    res.send('Bienvenue sur mon serveur')
})