const Coupan = require("../models/Coupan");
const { removeUndefined, uploadToCloudinary } = require("../util/util");
const cloudinary = require("cloudinary").v2;

const getCoupans = async ({ store, category, status, isExclusive }) => {
    const query = {};

    if (store) {
        query.store = store;
    }
    if (store) {
        query.status = status;
    }

    if (category) {
        query.category = category;
    }
    if (isExclusive) {
        query.is_exclusive = isExclusive;
    }

    console.log('Query Object:', query);

    try {
        // Assuming you have a Mongoose model named 'Coupon'
        const data = await Coupan.find(query).populate('store').sort({ priority: -1 }).exec();

        return { status: true, data };
    } catch (error) {
        // Handle any potential errors here
        console.error('Error fetching coupons:', error);
        return { status: false, error: 'Error fetching coupons' };
    }
};

const getCoupansByIds = async ({ storeId, categoryId}) => {
    // Your logic to retrieve coupans based on storeId and categoryId
    // ...
    console.log(storeId);

    // For example:
    const coupans = await Coupan.find({ store: storeId, status: true}).sort({ priority: -1 }).exec();;

    return { status: true, data: coupans };
};


const postCoupan = async ({priority, store, category, title, coupanCode, link, expiryDate, is_coupan, is_popular, is_exclusive, desc, sideLine, subText, auth }) => {
    // ... (Your commented out authorization check)
//     console.log('Input Data - store:', store);
//     console.log('Input Data - category:', category);
//     console.log('Input Data - store:', );
// console.log('Input Data - category:', );
storeId = (store).replace(/^"(.*)"$/, '$1');;
category = JSON.parse(category);
    try {

        const newCoupan = new Coupan({
            store: storeId,
            category,
            title,
            coupanCode,
            link,
            expiryDate,
            is_coupan,
            is_popular,
            is_exclusive,
            sideLine,
            subText,
            priority,
            desc,
            ts: new Date().getTime()
        });

        const saveCoupan = await newCoupan.save();
        return { status: true, message: 'New Coupon created', data: saveCoupan };
    } catch (error) {
        console.error('Error in postCoupan:', error);
        return { status: false, message: 'Error creating coupon', error: error.message };
    }
};

// Example usage:
// postCoupan({ store: '{"key": "value"}', category: '{"key": "value"}', ...otherParams });


const updateCoupan = async ({ id, auth, store, priority, category, title, coupanCode, link, expiryDate, is_coupan, is_popular, is_exclusive, file, desc }) => {
    // if (!auth  || auth.role!=='ADMIN') {
    //     return { status: false, message: "Not Authorised" }
    // }
    if(store){
        store = (store).replace(/^"(.*)"$/, '$1');;
    }
    if(category){
        category = JSON.parse(category);
    }

    let updateObj = removeUndefined({ store, category, title, priority, link, expiryDate, is_coupan, is_popular, is_exclusive, desc });
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
    deleteCoupanImage,
    getCoupansByIds
};
