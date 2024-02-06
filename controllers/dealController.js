const Banner = require('../models/Deal');
const nodemailer = require('nodemailer');
const { removeUndefined, uploadToCloudinary } = require('../util/util');
const Store = require('../models/Store');

const getDeals = async () => {
    const data = await Banner.find();
    const dealsWithStoreInfo = await Promise.all(data.map(async deal => {
        const storeInfo = await Store.findById(deal.storeId);
        return {
            imgLink: deal.imgLink,
            buttonLink: deal.buttonLink,
            storeId: deal.storeId,
            text: deal.text,
            subText: deal.subText,
            isExclusive: deal.isExclusive,
            ts: deal.ts,
            storeImg: storeInfo?.img.url,
            storeImgId: storeInfo?.img.id,
            createdAt: deal.createdAt,
            updatedAt: deal.updatedAt,
            __v: deal.__v
        };
    }));

    return { status: true, data: dealsWithStoreInfo, message: "Exclusive Banner saved Successfully" };
};



const postDeals = async ({ file, text, subText, isExclusive, storeId, buttonLink}) => {
    var locaFilePath = file.path;
    var result = await uploadToCloudinary(locaFilePath);
    const newBanner = new Banner({
        imgLink: result.url,
        text, subText, isExclusive, storeId, buttonLink
    });
    const saveUser = await newBanner.save();

    return { status: true, data: saveUser, message: 'Exclusive Deal saved Successfully' };
};

const updateDeals = async ({ id, file, text, subText, isExclusive, storeId, buttonLink }) => {
    const updateObj = removeUndefined({
        text, subText, isExclusive, storeId, buttonLink
    });
    if(file !== '' && file !== undefined)
    {
        var locaFilePath = file.path;
        var result = await uploadToCloudinary(locaFilePath);
        updateObj['imgLink'] = result.url;
    }
console.log(updateObj);
    const saveUser = await Banner.findByIdAndUpdate(id, {$set: updateObj}, {new: true});

    return { status: true, data: saveUser, message: 'Update Deal Successfully' };
};

const deleteDeals = async ({ id, auth }) => {
    // if (!auth || auth.role !== 'ADMIN') {
    //     return { status: false, message: "Not Authorised" };
    // }

    const ans = await Banner.findByIdAndDelete(id);
    return { status: true, message: 'Deal deleted Successfully' };
};

module.exports = {
    getDeals,
    postDeals,
    updateDeals,
    deleteDeals
};

