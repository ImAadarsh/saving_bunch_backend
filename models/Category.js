const mongoose=require('mongoose');

const mySchema=mongoose.Schema({
    title: String,
    name: String,
    seoTitle: String,
    pageTitle: String,
    img:{
        url: String,
        id: String
    },
    desc: String,
    priority: Number,
    ts:String,
},{
    timestamps: true
});

const Category=mongoose.model('Category', mySchema);

module.exports=Category;
