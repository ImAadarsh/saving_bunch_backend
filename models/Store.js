const mongoose = require('mongoose');

const mySchema = mongoose.Schema({
    title: String,
    img: {
        url: String,
        id: String
    },
    desc: String,
    priority: Number,
    isFeatured: String,
    subHeading: String,
    seoTitle: String,
    pageTitle: String,
    invalidLink: String,
    status: {
        type: Boolean,
        default: true,
        required: true
    },
    storeOverview: String,
    ts: String,
    similarStores: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Store'
    }],
    category: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category'
    }]
}, {
    timestamps: true
});

const Store = mongoose.model('Store', mySchema);

module.exports = Store;
