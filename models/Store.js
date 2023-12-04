const mongoose=require('mongoose');

const mySchema=mongoose.Schema({
    title: String,
    // subTitle:String,
    // writtenBy:String,
    // tags:Array,
    img:{
        url: String,
        id: String
    },
    desc: String,
    // slug: {
    //     type: String,
    //     default: ''
    // },
    ts:String,
},{
    timestamps: true
});

const Store=mongoose.model('Store', mySchema);

module.exports=Store;
