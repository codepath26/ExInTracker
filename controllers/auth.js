require('dotenv').config(); 
const jwt = require("jsonwebtoken");

exports.authenticateUser = (req,res ,next)=>{
  const token = req.header("Authorization");
  const user = jwt.verify(token,process.env.JSONWEB_SECRET_KEY);

  // this is gives the userid make this very simple using the disign patern
  // const userId = Number(jwt.verify(token,process.env.JSONWEB_SECRET_KEY));
  console.log(user)
  req.user = user ;
  next();
}