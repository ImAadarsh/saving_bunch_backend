const mongoose=require('mongoose');

const mySchema=mongoose.Schema({
    name: String,
    email:String,
    phone:String,
    password:String,
    role: String
},{
    timestamps: true
});

const User=mongoose.model('User', mySchema);

module.exports=User;
