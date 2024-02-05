const mongoose=require('mongoose');
const Store = require('./Store');
const Category = require('./Category');

const mySchema = mongoose.Schema({
    store: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Store'
    },
    category: [{
        type: mongoose.Schema.Types.ObjectId,  // Assuming ObjectId is used for Category
        ref: 'Category'  // Use the name of the referenced model
    }],
    title: String,
    subText: String,
    coupanCode: String,
    link: String,
    sideLine: String,
    expiryDate: String,
    img: {
        url: String,
        id: String
    },
    desc: String,
    priority: Number,
    is_coupan: {
        type: Boolean,
        default: false
    },
    is_popular: {
        type: Boolean,
        default: false
    },
    is_exclusive: {
        type: Boolean,
        default: false
    },
    ts: String,
}, {
    timestamps: true
});


const Coupan=mongoose.model('Coupan', mySchema);

module.exports=Coupan;
