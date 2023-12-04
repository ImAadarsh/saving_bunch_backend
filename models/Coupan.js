const mongoose=require('mongoose');

const mySchema=mongoose.Schema({
    store:Object,
    category: Object,
    title: String,
    coupanCode:String,
    link:String,
    expiryDate:String,
    img:{
        url: String,
        id: String
    },
    desc: String,
    is_coupan: {
        type: String,
    },
    is_popular: {
        type: String,
    },
    is_exclusive: {
        type: String,
    },
    ts:String,
},{
    timestamps: true
});

const Coupan=mongoose.model('Coupan', mySchema);

module.exports=Coupan;
