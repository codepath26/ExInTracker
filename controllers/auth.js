require('dotenv').config(); 
const jwt = require("jsonwebtoken");

exports.authenticateUser = async (req,res ,next)=>{
 try{
   console.log("user authemtication")
   const token = req.header("Authorization");
   const user = jwt.verify(token,process.env.JSONWEB_SECRET_KEY);
   console.log(user)
   req.user = user ;
   next();
  }catch(err){

    return res.status(200).json({success:false})
  }

 
  
}