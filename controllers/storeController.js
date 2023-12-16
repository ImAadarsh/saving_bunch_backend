const Store = require("../models/Store");
const { removeUndefined, uploadToCloudinary } = require("../util/util");
const cloudinary = require("cloudinary").v2;

const getStores=async ({id})=>{
    let and = [];
    if(id)
    {
        and.push({_id: id});
    }
    if(and.length===0)
    {
        and.push({});
    }
    const data=await Store.find({$and: and});
    return {status: true,  data};
};

const postStore=async ({title, file, desc, auth})=>{
    // if(!auth || auth.role!=='ADMIN')
    // {
    //     return { status: false, message: "Not Authorised" };
    // }

    // console.log(title, subTitle, writtenBy, tags, file);

    var locaFilePath = file.path;
    var result = await uploadToCloudinary(locaFilePath);
    console.log(result);
    // res.json({ url: result.url, public_id: result.public_id,msg:"Image Upload Successfully" });

    const newStore = new Store({
        title, file, desc, img: {
            url: result.url,
            id: result.public_id
        }, ts: new Date().getTime()
    });
    const saveStore = await newStore.save();

    return { status: true, message: 'New store created', data: saveStore };
};

const updateStore = async ({ id, auth, title, file, desc }) => {
    // if (!auth  || auth.role!=='ADMIN') {
    //     return { status: false, message: "Not Authorised" }
    // }

    let updateObj = removeUndefined({ title, desc });

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
    deleteStoreImage
};
