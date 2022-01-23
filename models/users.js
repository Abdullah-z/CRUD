const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type:String,
        required:true,
    },
    dob: {
        type:String,
        required:true,
    },
    image:{
        type:String,
        required:true,
    },

    contact:{
        type:String,
        required:true,
    
    },

    email:{
        type:String,
        required:true,
        
    },

    address:{
        type: String,
        required: true,
    },
    
    created:{
        type:Date,
        required:true,
        default: Date.now,
    },

});

module.exports = mongoose.model('User', userSchema);