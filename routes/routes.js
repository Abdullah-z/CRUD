const express = require('express');
const router =  express.Router();
const User = require('../models/users');
const multer = require('multer');
const bodyParser = require("body-parser")
const mongoose = require('mongoose');
const users = require('../models/users');
const ejs = require("ejs");
const { route } = require('express/lib/application');
const fs= require('fs');  
const { info } = require('console');



const db= mongoose.connection;
const imageStorage = multer.diskStorage({
       
    destination: './uploads', 
      filename: (req, file, cb) => {
          cb(null, file.fieldname + '_' + Date.now())
           
    }
});

const imageUpload = multer({
    storage: imageStorage,
    limits: {
      fileSize: 10000000 
    },
    fileFilter(req, file, cb) {
      if (!file.originalname.match(/\.(png|jpg)$/)) { 
        
         return cb(new Error('Please upload a Image'))
       }
     cb(undefined, true)
  }
}) 
router.post('/add', imageUpload.single('image'), (req,res)=>{
    
     const user = new User({
        name:req.body.name,
        email:req.body.email,
        dob:req.body.dob,
        image:req.file.filename,
        contact:req.body.contact,
        address:req.body.address,
    });
    user.save((err)=>{
        if(err){
            res.json({message: err.message, type: 'danger'});
        } else {
            req.session.message ={
                type: 'success',
                message: 'Person Data Successfully Uploaded!'
            };
            res.redirect("/")
        }   
    })
})




// router.get('/data', (req, res) => {
//     db.collection('users').find().toArray()
//       .then(results => {
//         console.log(results)
//       })
//       .catch(error => console.error(error))
    
//   });



 



router.get('/edit/:id',(req,res)=>{
  let id= req.params.id;
  User.findById(id,(err,user)=>{
    if(err){
      res.redirect('/');
    } else{
      if (user == null){
        res.redirect('/')
      } else{
        res.render('edit_person',{
          title: "Edit",
          user:user,
        });
      }
    }
  });
});

router.get('/delete/:id',(req,res)=>{
  let id= req.params.id;
  User.findByIdAndRemove(id,(err,result)=>{
    if(result.image !=""){
      try {
        fs.unlinkSync("./uploads/"+ result.image);
      } catch (err){
        console.log(err);
      }
    }

    if (err) {
      res.json({ message: err.message });

    } else{
      req.session.message ={
        type: "info",
        message: "User Deleted Successfully",
      };
      res.redirect('/')
    };
  });
});

// router.get('/delete/:id',(req,res)=>{
//   let id= req.params.id;
//   user.findByIdAndRemove(id);
// });

// router.get('/delete/(:id)', function(req, res, next) {
//   User.findByIdAndRemove(req.params.id, (err, doc) => {
//       if (!err) {
//           res.redirect('/');
//       } else {
//           console.log('Failed to Delete user Details: ' + err);
//       }
//   });
// })


//UPDATE EDIT CODE

router.post('/edit/:id',imageUpload.single('image'),(req,res)=>{
  let id= req.params.id;
  let new_image= "";

  if (req.file){
    new_image = req.file.filename;
    try{
      fs.unlinkSync('./uploads'/+req.body.old_image);
    } catch(err){
      console.log(err);
    }
  } else {
    new_image= req.body.old_image;
   }

   User.findByIdAndUpdate(id, {
     name: req.body.name,
     email:req.body.email,
     dob:req.body.dob,
     contact:req.body.contact,
     address:req.body.address,
     image: new_image,
   }, (err,result)=>{
     if(err){
       res.json({message: err.message,type:'danger'})
     } else{
       req.session.message ={
         type:'success',
         message:'User Updated'
       };
       res.redirect('/')
     }
   } )
});






router.get('/add', (req,res)=>{
    res.render('add_person', { title: "Add Person"})
});



router.get("/contact", (req,res)=> {
  User.find().exec((err,users)=>{
    if(err){
      res.json({message: err.message});
    } else {
      res.render('contact',{
        title: "Contact"
      });
    }
  });
});

router.get("/about", (req,res)=> {
  User.find().exec((err,users)=>{
    if(err){
      res.json({message: err.message});
    } else {
      res.render('about',{
        title: "About",
      });
    }
  });
});

router.get("/", (req,res)=> {
  User.find().exec((err,users)=>{
    if(err){
      res.json({message: err.message});
    } else {
      res.render('index',{
        title: "Home Page",
        users: users,
      });
    }
  });
});

router.get('/person/:id',(req,res)=>{
  let id= req.params.id;
  User.findById(id,(err,user)=>{
    if(err){
      res.redirect('/');
    } else{
      if (user == null){
        res.redirect('/')
      } else{
        res.render('person_id',{
          title: "Details",
          user:user,
        });
      }
    }
  });
});



module.exports = router;