require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const sequelize = require("./utils/database");
const path = require("path");

const port = process.env.PORT;
const User = require("./models/user");
const Order = require("./models/order");
const Expense = require("./models/appo-Details");
const DowHistory = require("./models/historyDowload");
const ForgotPassword = require("./models/forgotpass");

const userRoutes = require("./routes/expense");
const loginRoutes = require("./routes/login");
const ForgotPasswordRoutes = require("./routes/changePass");

const app = express();
app.use(bodyParser.json());
app.use(cors());

app.use(userRoutes);
app.use(loginRoutes);
app.use("/password", ForgotPasswordRoutes);
app.get('/' , (req,res)=>{
    res.sendFile(path.join(__dirname, 'public/login.html'));
})
app.use((req, res) => {
  console.log(req.url);
  console.log("thisis the dirname", __dirname);
  res.sendFile(path.join(__dirname, `public/${req.url}`));
});

User.hasMany(Expense);
Expense.belongsTo(User, { onDelete: "CASCADE" });
User.hasMany(Order);
Order.belongsTo(User, { onDelete: "CASCADE" });
User.hasMany(ForgotPassword);
User.hasMany(DowHistory), DowHistory.belongsTo(User, { onDelete: "CASCADE" });
ForgotPassword.belongsTo(User, { onDelete: "CASCADE" });

sequelize.sync();

app.listen(port  , () => console.log(`Example app listening on port ${port}!`));
