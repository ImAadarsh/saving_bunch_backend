const Coupan = require("../models/Coupan");
const { removeUndefined, uploadToCloudinary } = require("../util/util");
const cloudinary = require("cloudinary").v2;

const getCoupans=async ({id, slug})=>{
    let and = [];
    if(id)
    {
        and.push({_id: id});
    }
    if(slug)
    {
        and.push({slug});
    }
    if(and.length===0)
    {
        and.push({});
    }
    const data=await Coupan.find({$and: and});
    return {status: true,  data};
};

const postCoupan=async ({store, category, title, coupanCode, link, expiryDate, is_coupan, is_popular, is_exclusive, file, desc, auth})=>{
    // if(!auth || auth.role!=='ADMIN')
    // {
    //     return { status: false, message: "Not Authorised" };
    // }

    // console.log(title, subTitle, writtenBy, tags, file);

    var locaFilePath = file.path;
    var result = await uploadToCloudinary(locaFilePath);
    console.log(result);

    const newCoupan = new Coupan({
        store, category, title, coupanCode, link, expiryDate, is_coupan, is_popular, is_exclusive, img: {
            url: result.url,
            id: result.public_id
        }, desc, ts: new Date().getTime()
    });
    const saveCoupan = await newCoupan.save();

    return { status: true, message: 'New store created', data: saveCoupan };
};

const updateCoupan = async ({ id, auth, store, category, title, coupanCode, link, expiryDate, is_coupan, is_popular, is_exclusive, file, desc }) => {
    // if (!auth  || auth.role!=='ADMIN') {
    //     return { status: false, message: "Not Authorised" }
    // }

    let updateObj = removeUndefined({ store, category, title, coupanCode, link, expiryDate, is_coupan, is_popular, is_exclusive, desc });

    if (file !== '' && file !== undefined) {
        // insert new image as old one is deleted
        var locaFilePath = file.path;
        var result = await uploadToCloudinary(locaFilePath);
        updateObj['img'] = {
            url: result.url,
            id: result.public_id
        };
    }

    const updateCoupan = await Coupan.findByIdAndUpdate(id, { $set: updateObj }, { new: true });

    return { status: true, message: 'Coupan updated successfully', data: updateCoupan };
};

const deleteCoupanImage = async ({ auth, id }) => {
    // if (!auth || auth.role!=='ADMIN') {
    //     return { status: false, message: "Not Authorised" };
    // }
    id = id.replaceAll(':', '/');
    console.log(id);

    cloudinary.uploader.destroy(id, async (err, result) => {
        console.log(result);
        if (err) throw err;
    });

    return { status: true, message: 'Coupan image deleted successfully' };
};

const deleteCoupan = async ({ auth, id }) => {
    // if (!auth || auth.role!=='ADMIN') {
    //     return { status: false, message: "Not Authorised" };
    // }

    const deleteCoupan = await Coupan.findByIdAndDelete(id);
    if (deleteCoupan.img.url) {
        cloudinary.uploader.destroy(deleteCoupan.img.id, async (err, result) => {
            console.log(result);
            if (err) throw err;
        });
    }
    // console.log(deleteCoupan);

    return { status: true, message: 'Coupan deleted successfully' };
};

const deleteAllCoupans = async ({ auth }) => {
    // if (!auth) {
    //     return { status: false, message: "Not Authorised" }
    // }
    const deleteCoupan = await Coupan.deleteMany();

    return { status: true, message: 'All Coupans deleted successfully' };
};

module.exports={
    getCoupans,
    postCoupan,
    updateCoupan,
    deleteAllCoupans,
    deleteCoupan,
    deleteCoupanImage
};
