const mongoose=require('mongoose');

const mySchema=mongoose.Schema({
    email: String,
    ts: String,
},{
    timestamps: true
});

const Email=mongoose.model('Email', mySchema);

module.exports=Email;
