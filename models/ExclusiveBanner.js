const mongoose=require('mongoose');

const mySchema=mongoose.Schema({
    imgLink: String,
    sequence:String,
    ts:{
        type: String,
        default: new Date().getTime()
    }
},{
    timestamps: true
});

const Banner=mongoose.model('ExclusiveBanner', mySchema);

module.exports=Banner;
