const Store = require("../models/Store");
const { removeUndefined, uploadToCloudinary } = require("../util/util");
const cloudinary = require("cloudinary").v2;

const getStores = async ({ id, isFeatured }) => {
    const query = {};

    if (id) {
        query._id = id;
    }

    if (isFeatured) {
        query.isFeatured = isFeatured;
    }
    console.log('Query Object:', query);
  const data = await Store.find(query).populate('similarStores').populate('category');


    console.log('Returned Data:', data);
    return { status: true, data };
    
};


const getAllStoreByFirstLetter = async () => {
    const pipeline = [
        {
            $project: {
                firstLetter: { $substr: ['$title', 0, 1] },
                name: '$title',  // Include the title field as 'name'
                _id: 1,  // Include the _id field
                img: 1,  // Include the img field
                // Add other fields if needed
            },
        },
        {
            $project: {
                firstLetter: { $toUpper: '$firstLetter' },
                name: 1,
                _id: 1,
                img: 1,
                // Add other fields if needed
            },
        },
        {
            $group: {
                _id: '$firstLetter',
                data: { $push: { name: '$name', _id: '$_id', img: '$img' } },
            },
        },
        { $sort: { _id: 1 } },
    ];

    const data = await Store.aggregate(pipeline);
    return { status: true, data };
};

const postStore=async ({title, file, desc, isFeatured, subHeading, priority, invalidLink, seoTitle, pageTitle, status, category, similarStore,storeOverview, auth})=>{
    // if(!auth || auth.role!=='ADMIN')
    // {
    //     return { status: false, message: "Not Authorised" };
    // }

    // console.log(title, subTitle, writtenBy, tags, file);

    var locaFilePath = file.path;
    var result = await uploadToCloudinary(locaFilePath);
  
    // res.json({ url: result.url, public_id: result.public_id,msg:"Image Upload Successfully" });
    similarStores = JSON.parse(similarStore);
    category = JSON.parse(category);
    const newStore = new Store({
       subHeading, title, file, desc: storeOverview, priority, invalidLink, seoTitle, pageTitle, status, category, similarStores,storeOverview: desc, img: {
            url: result.url,
            id: result.public_id
        }, isFeatured, ts: new Date().getTime()
    });
    const saveStore = await newStore.save();

    return { status: true, message: 'New store created', data: saveStore };
};

const updateStore = async ({ id, auth, title, file, desc, isFeatured, priority }) => {
    // if (!auth  || auth.role!=='ADMIN') {
    //     return { status: false, message: "Not Authorised" }
    // }

    let updateObj = removeUndefined({ title, desc, isFeatured, priority });

    if (file !== '' && file !== undefined) {
        // insert new image as old one is deleted
        var locaFilePath = file.path;
        var result = await uploadToCloudinary(locaFilePath);
        updateObj['img'] = {
            url: result.url,
            id: result.public_id
        };
    }

    const updateStore = await Store.findByIdAndUpdate(id, { $set: updateObj }, { new: true });

    return { status: true, message: 'Store updated successfully', data: updateStore };
};

const deleteStoreImage = async ({ auth, id }) => {
    // if (!auth || auth.role!=='ADMIN') {
    //     return { status: false, message: "Not Authorised" };
    // }
    id = id.replaceAll(':', '/');
    // console.log(id);

    cloudinary.uploader.destroy(id, async (err, result) => {
        console.log(result);
        if (err) throw err;
    });

    return { status: true, message: 'Store image deleted successfully' };
};

const deleteStore = async ({ auth, id }) => {
    // if (!auth || auth.role!=='ADMIN') {
    //     return { status: false, message: "Not Authorised" };
    // }

    const deleteStore = await Store.findByIdAndDelete(id);
    if (deleteStore.img.url) {
        cloudinary.uploader.destroy(deleteStore.img.id, async (err, result) => {
            // console.log(result);
            if (err) throw err;
        });
    }
    // console.log(deleteStore);

    return { status: true, message: 'Store deleted successfully' };
};

const deleteAllStores = async ({ auth }) => {
    // if (!auth) {
    //     return { status: false, message: "Not Authorised" }
    // }
    const deleteStore = await Store.deleteMany();

    return { status: true, message: 'All Stores deleted successfully' };
};

module.exports={
    getStores,
    postStore,
    updateStore,
    deleteAllStores,
    deleteStore,
    deleteStoreImage,
    getAllStoreByFirstLetter
};
