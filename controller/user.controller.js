const User = require("../models/user.model");
const bcrypt = require("bcrypt");

//  inscription

exports.inscription = async ( req , res ) => {
    
    try {
          
        const { prenom , nom , email, password } = req.body;

        // verifier si l'email du existe deja

        let user = await User.findOne({email}) ;
        
          if(user){
             return res.status(400).json({message: "utilisateur existe deja"});
          }
        //   si c'est pas le cas on continue

        // on crypte le password

        const verification = await bcrypt.genSalt(10);
        const passwordHasher = await bcrypt.hash(password , verification)

        // creer l'utilisateur 
        user = await User.create({
            prenom ,
            nom,
            email,
            password:passwordHasher
        });

        res.status(201).json({message:'Inscription réussie'});


    } catch (error) {
        res.status(500).json(error);
    }

}

