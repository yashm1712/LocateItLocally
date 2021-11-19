import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import passport from "passport";
//import { Router } from "express";
const router = express.Router();

//Models
import { UserModel } from "../../../SchemaModels/user/index.js";

//Validation for fields we are entering
import { ValidateSignup , ValidateSignin} from "../../../Validation/auth";



/*
Route         /signup
Descrip       Signup with email and password
Params        None
Access        Public
Method        POST
*/

router.post("/signup", async(req,res) => {
  try {
    
      await ValidateSignup(req.body);

      const bool=await UserModel.findByEmailAndPhone(req.body);
  //DB
        if(bool === true)
        {
          return res.status(401).json('User Already Exist');
        }
      console.log(req.body);
      console.log("above newuser");
    //const newUser = await UserModel.create(req.body.credentials);
    const user = req.body;
    const newUser = new UserModel(user);
    await newUser.save();
    console.log("After Save");
    console.log(newUser);
    console.log("After fdone")


   //JWT Auth Token
     
    

   return res.status(200).json({userExists:newUser});

  } catch (error) {
    return res.status(500).json({error: error.message});
  }
});


/*
Route         /signin
Descrip       Signin with email and password
Params        None
Access        Public
Method        POST
*/

 router.post("/signin", async(req,res) => {
   try {
    console.log(req.body);
     await ValidateSignin(req.body);
     console.log(req.body);
    
    const user = await UserModel.findByEmailAndPassword(req.body);
    console.log(user);
    //JWT Auth Token
    //const token = user.generateJwtToken();
    if(user===null)
    {
      return res.status(401).json('Invalid Login');
    }
      
     return res.json({ userExists: user });
    //return res.status(200).json({token, status: "Success"});

   } catch (error) {
     return res.status(500).json({error: error.message});
   }
 });


// /*
// Route         /google
// Descrip       Google Signin
// Params        None
// Access        Public
// Method        GET
// */

router.get("/google", passport.authenticate("google",{
 scope: [
   "https://www.googleapis.com/auth/userinfo.profile",
   "https://www.googleapis.com/auth/userinfo.email"
 ],
 })
 );

// /*
// Route         /google/callback
// Descrip       Google Signin callback
// Params        None
// Access        Public
// Method        GET
// */

 router.get("/google/callback", passport.authenticate("google",{failureRedirect: "/"}),
 (req,res) => {
   return res.json({token: req.session.passport.user.token});
 }
 );

export default router;
