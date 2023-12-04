const Banner = require('../models/Banner');
const nodemailer = require('nodemailer');

const getBanners = async () => {
    const data = await Banner.find();
    return { status: true, data };
};

const postBanner = async ({ name, email, phone, company, message }) => {
    const newBanner = new Banner({
        name,
        email,
        phone,
        company,
        message
    });
    const saveUser = await newBanner.save();

    // var transport = nodemailer.createTransport({
    //     service: "Gmail",
    //     auth: {
    //         user: "gravityinfosolutions201@gmail.com",
    //         // pass: "Gravity2001!"
    //         pass: "rdgqycmtkgrocnwb"
    //     }
    // });

    // var message = {
    //     // from: 'Gravity Infosolutions <gravityinfosolutions201@gmail.com>',
    //     from: 'Gravity Infosolutions <info@gravityinfosolutions.com',

    //     to: '"Gravity Infosolutions" <info@gravityinfosolutions.com>',
    //     // to: '"Gravity Infosolutions" <hitenkhatri14@gmail.com>',

    //     subject: 'Banner Form Details',

    //     text: `<div>
    //             <p>Name: ${name}</p>
    //             <p>Email: ${email}</p>
    //             <p>Phone: ${phone}</p>
    //             <p>Company: ${company}</p>
    //             <p>Message: ${message}</p>
    //         </div>`,

    //     html: `<div>
    //             <p>Name: ${name}</p>
    //             <p>Email: ${email}</p>
    //             <p>Phone: ${phone}</p>
    //             <p>Company: ${company}</p>
    //             <p>Message: ${message}</p>
    //         </div>`
    // };

    // transport.sendMail(message, function (error) {
    //     if (error) {
    //         console.log('Error occured');
    //         console.log(error.message);
    //         return;
    //     }
    //     console.log('Message sent successfully!');
    // });

    return { status: true, data: saveUser, message: 'Conatct sent Successfully' };
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
    deleteBanner
};

