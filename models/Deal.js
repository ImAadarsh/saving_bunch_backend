const mongoose=require('mongoose');

const mySchema=mongoose.Schema({
    imgLink: String,
    buttonLink: String,
    storeId: String,
    text: String,
    subText: String,
    isExclusive: Boolean,
    ts:{
        type: String,
        default: new Date().getTime()
    }
},{
    timestamps: true
});

const Banner=mongoose.model('Deals', mySchema);

module.exports=Banner;
