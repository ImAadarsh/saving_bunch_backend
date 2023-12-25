const Banner = require('../models/ExclusiveBanner');
const nodemailer = require('nodemailer');
const { removeUndefined, uploadToCloudinary } = require('../util/util');

const getBanners = async () => {
    const data = await Banner.find();
    return { status: true, data };
};

const postBanner = async ({ file, sequence}) => {
    var locaFilePath = file.path;
    var result = await uploadToCloudinary(locaFilePath);
    const newBanner = new Banner({
        imgLink: result.url,
        sequence
    });
    const saveUser = await newBanner.save();

    return { status: true, data: saveUser, message: 'Exclusive Banner saved Successfully' };
};

const updateBanner = async ({ id, file, sequence }) => {
    const updateObj = removeUndefined({
        sequence
    });
    if(file !== '' && file !== undefined)
    {
        var locaFilePath = file.path;
        var result = await uploadToCloudinary(locaFilePath);
        updateObj['imgLink'] = result.url;
    }
console.log(updateObj);
    const saveUser = await Banner.findByIdAndUpdate(id, {$set: updateObj}, {new: true});

    return { status: true, data: saveUser, message: 'Update Banner Successfully' };
};

const deleteBanner = async ({ id, auth }) => {
    // if (!auth || auth.role !== 'ADMIN') {
    //     return { status: false, message: "Not Authorised" };
    // }

    const ans = await Banner.findByIdAndDelete(id);
    return { status: true, message: 'Conatct deleted Successfully' };
};

module.exports = {
    getBanners,
    postBanner,
    updateBanner,
    deleteBanner
};

