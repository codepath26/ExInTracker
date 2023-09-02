require('dotenv').config(); 
const Expenses = require("../models/appo-Details");
const User = require("../models/user");
const DowHistory = require('./download_history');
const sequelize = require('../utils/database');
const AWS = require('aws-sdk');
const Expense = require('../models/appo-Details');
// let Items_PER_PAGE = 10


function uploadToS3(data , filename){
 
 const BUCKET_NAME= process.env.BUCKET_NAME
 const IAM_USER_KEY= process.env.IAM_USER_KEY
 const IAM_USER_SECRET= process.env.IAM_USER_SECRET

 let s3bucket = new AWS.S3({
  accessKeyId : IAM_USER_KEY,
  secretAccessKey : IAM_USER_SECRET,
 })

  var params = {
     Bucket : BUCKET_NAME,
     Key : filename,
     Body : data ,
     ACL: 'public-read',
  }


  return new Promise ((resolve, reject)=>{
    s3bucket.upload(params , (err,s3response)=>{
      if(err){
        console.log('somiething went wrong' , err);
        reject(err);
        
      }else{
        // console.log('success' ,s3response);
        resolve(s3response.Location) ;
      }
      
  })
});
  
}





exports.downloadExpenses = async (req ,res)=>{
  try{
    const user = await User.findByPk(req.user.userId)
    const expenses = await user.getExpenses();
    const stringifyExpenses = JSON.stringify(expenses);
    const filename = `Expense${user.id}/${new Date()}.txt`;
     const fileUrl = await uploadToS3(stringifyExpenses, filename);
    //  console.log(fileUrl)
       DowHistory.History(fileUrl , user.id)
    res.status(200).json({fileUrl , success : true});
  }catch(err){
    res.status(500).json({fileUrl : '' , success : false});
  }
}



exports.getDetails = async (req, res, next) => {
  try {
     console.log(req.user.userId , "this");
     console.log("ii am here");
    let data = await Expenses.findAll({ where: { userId: req.user.userId } });
   
    res.status(200).json(data);
  } catch (err) {
    console.log('user is not able to created')
    return res.status(500).json({ message: "user not able to create" });
  }
};



exports.postDetail = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const id = req.user.userId
    const user = await User.findByPk(id);
    const { amount, description, category } = req.body;
    // console.log(`this is the adding amount ==> ${amount}`)
    // console.log(`this is TotalExpenses amount ==> ${user.totalExpenses}`)
    
     let total = user.totalExpenses + parseInt(amount);
    //  console.log(`this is the total wnated to add ==>${total}`);
     await  user.update({totalExpenses : total },{
        transaction : t
      });
 
    const newUser = await Expenses.create({
      amount: amount,
      description: description,
      category: category,
      userId: user.id,
    },{ transaction: t });
    await t.commit();
    res.status(201).json(newUser); // Assuming you want to send the created user back
  } catch (err) {
    await t.rollback();
    res.status(500).json({ message: "internal server error" });
  }
};




exports.deletDetail = async (req, res, next) => {

  const listId = req.params.id;
 
  try {
    const expense = await Expenses.findOne({ where: { id: listId } });
     const id = expense.userId;
    const user =  await User.findByPk(id);
    // console.log(user.totalExpenses)
    // console.log(parseInt(expense.amount))
    const expenseAmount = parseInt(expense.amount)
    let total = user.totalExpenses - expenseAmount ;
    // console.log(total)
    // console.log(typeof(total))
    user.update({totalExpenses : total})
    expense.destroy();
    return res.status(200).json({ message: "data deleted successfully" });
  } catch (error) {
    return res.status(500).json({ error: "Error Deleting data" });
   }
};
exports.updateDetail = async (req, res, next) => {
  try {
 
  const listtId = req.params.id;
  let expense = await Expenses.updateByPk(listtId);
  const id = expense.userId;
  const user = User.findByPk(id);
  const expenseAmount = parseInt(expense.amount)
  let total = user.totalExpenses - expenseAmount ;
  user.update({totalExpenses : total})
    res.status(200).json(expense);
  } catch (err) {
    res.status(500).json({ err: "Error Updating data" });
  }
};

exports.getDetailsbyId = async (req, res) => {
  try {
    let getId = req.params.id;
    let expense = await Expenses.findOne({ where: { id: getId } });
    res.status(200).json(expense);
  } catch (err) {
    res.status(500).json({ err: "Error getting data" });
  }
};



exports.getProducts = async ( req,res)=>{
  try{
  
   let Items_PER_PAGE = +req.query.row
   console.log(typeof(Items_PER_PAGE))

    const page = +req.query.page || 1;
    let totalItems ;
    let total = await Expense.count()
    totalItems = total;
    console.log(`page ==> ${page}`)
    const products = await Expense.findAll({
      offset :(page -1 ) * Items_PER_PAGE ,
      limit : Items_PER_PAGE,
    })
  //  console.log(products)
    res.status(200).json({
      products : products ,
      currentPage : page,
      hasNextpage : page< Math.ceil(totalItems/ Items_PER_PAGE) ,
      nextPage : page + 1,
      hasPreviousPage :  page > 1,
      PreviousPage : page - 1,
      lastPage : Math.ceil(totalItems/ Items_PER_PAGE),
    });
  }catch(err){
    res.status(500).json(err);
  }
}