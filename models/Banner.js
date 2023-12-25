const mongoose=require('mongoose');

const mySchema=mongoose.Schema({
    imgLink: String,
    buttonLink: String,
    buttonText: String,
    text: String,
    subText: String,
    sequence:String,
    ts:{
        type: String,
        default: new Date().getTime()
    }
},{
    timestamps: true
});

const Banner=mongoose.model('Banner', mySchema);

module.exports=Banner;
