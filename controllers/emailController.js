const Email = require("../models/Email");
const { removeUndefined, uploadToCloudinary } = require("../util/util");
const cloudinary = require("cloudinary").v2;
const nodemailer = require('nodemailer');

const getEmails = async ({ id }) => {
    let and = [];
    if (id && id!=="" && id!=="undefined") {
        and.push({ _id: id });
    }
    if (and.length === 0) {
        and.push({});
    }
    const data = await Email.find({ $and: and });
    return { status: true, data };
};

const postEmail = async ({ email }) => {
    // if(!auth || auth.role!=='ADMIN')
    // {
    //     return { status: false, message: "Not Authorised" };
    // }

    const newEmail = new Email({
        email, ts: new Date().getTime()
    });
    const saveEmail = await newEmail.save();

    return { status: true, message: 'New email created', data: saveEmail };
};

const updateEmail = async ({ id, auth, email }) => {
    // if (!auth  || auth.role!=='ADMIN') {
    //     return { status: false, message: "Not Authorised" }
    // }

    let updateObj = removeUndefined({ email });

    const updateEmail = await Email.findByIdAndUpdate(id, { $set: updateObj }, { new: true });

    return { status: true, message: 'Email updated successfully', data: updateEmail };
};

const deleteEmailImage = async ({ auth, id }) => {
    // if (!auth || auth.role!=='ADMIN') {
    //     return { status: false, message: "Not Authorised" };
    // }
    id = id.replaceAll(':', '/');
    console.log(id);

    cloudinary.uploader.destroy(id, async (err, result) => {
        console.log(result);
        if (err) throw err;
    });

    return { status: true, message: 'Email image deleted successfully' };
};

const deleteEmail = async ({ auth, id }) => {
    // if (!auth || auth.role!=='ADMIN') {
    //     return { status: false, message: "Not Authorised" };
    // }

    const deleteEmail = await Email.findByIdAndDelete(id);
    return { status: true, message: 'Email deleted successfully' };
};

const deleteAllEmails = async ({ auth }) => {
    // if (!auth) {
    //     return { status: false, message: "Not Authorised" }
    // }
    const deleteEmail = await Email.deleteMany();

    return { status: true, message: 'All Emails deleted successfully' };
};

module.exports = {
    getEmails,
    postEmail,
    updateEmail,
    deleteAllEmails,
    deleteEmail
};
