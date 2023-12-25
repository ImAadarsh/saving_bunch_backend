const mongoose = require('mongoose');

const brandSchema = new mongoose.Schema({
    brandName: {
        type: String,
        required: true,
    },
    storeWebsite: {
        type: String,
        required: true,
    },
    fullName: {
        type: String,
        required: true,
    },
    officeNumber: {
        type: String,
        required: true,
    },
    mobileNumber: {
        type: String,
        required: true,
    },
    emailAddress: {
        type: String,
        required: true,
    },
    comments: {
        type: String,
    },
});

const Brand = mongoose.model('Brand', brandSchema);

module.exports = Brand;
