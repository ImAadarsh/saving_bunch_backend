const mongoose=require('mongoose');

const mySchema=mongoose.Schema({
    title: String,
    img:{
        url: String,
        id: String
    },
    desc: String,
    ts:String,
},{
    timestamps: true
});

const Store=mongoose.model('Store', mySchema);

module.exports=Store;
