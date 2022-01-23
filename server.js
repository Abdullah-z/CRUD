require('dotenv').config();
const express= require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const req = require('express/lib/request');




const app= express();
// // app.use(express.static(path.join(__dirname, 'uploads')));
// app.use('/uploads', express.static('./uploads'));
app.use( express.static("uploads"));

const PORT= process.env.PORT || 3000;

mongoose.connect(process.env.DB_URL);
const db= mongoose.connection;
db.on('error', (error)=> console.log(error));
db.once('open', ()=> console.log("Connected to Database"))

app.use(express.urlencoded({extended:false}));
app.use(express.json());


app.use(session({
  secret: 'secret key',
  saveUninitialized: true,
  resave: false,
}))

app.use((req,res,next)=>{
  res.locals.message = req.session.message;
  delete req.session.message;
  next();
});



app.set('view engine', 'ejs');

app.use("",require("./routes/routes"));

app.listen(PORT,()=>{
  console.log('Server started');
});

