const Category = require("../models/Category");
const { removeUndefined, uploadToCloudinary } = require("../util/util");
const cloudinary = require("cloudinary").v2;

const getCategorys=async ({id, slug})=>{
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
    const data=await Category.find({$and: and});
    return {status: true,  data};
};

const getCategorySEO = async ({ name }) => {
    const query = {};
  
    if (name) {
      // Replace hyphens with spaces and make the search case-insensitive
      const formattedTitle = name.replace(/-/g, ' ');
      query.name = new RegExp(formattedTitle, 'i');
    }
  
  
    console.log('Query Object:', query);
  
    try {
      const data = await Category.find(query);
      console.log('Returned Data:', data);
      return { status: true, data };
    } catch (error) {
      console.error('Error:', error.message);
      return { status: false, error: error.message };
    }
  };

const getAllCategoriesByFirstLetter = async () => {
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

    const data = await Category.aggregate(pipeline);
    return { status: true, data };
};





const postCategory=async ({title, file, desc, priority, seoTitle, name, pageTitle, auth})=>{
    var locaFilePath = file.path;
    var result = await uploadToCloudinary(locaFilePath);
    console.log(result);
    // res.json({ url: result.url, public_id: result.public_id,msg:"Image Upload Successfully" });

    const newCategory = new Category({
        title, img: {
            url: result.url,
            id: result.public_id,
        }, desc,priority,seoTitle,name,pageTitle, ts: new Date().getTime()
    });
    const saveCategory = await newCategory.save();

    return { status: true, message: 'New category created', data: saveCategory };
};

const updateCategory = async ({ id, auth, title, desc, slug, priority,  file }) => {
    // if (!auth  || auth.role!=='ADMIN') {
    //     return { status: false, message: "Not Authorised" }
    // }

    let updateObj = removeUndefined({ title, desc, priority });

    if (file !== '' && file !== undefined) {
        // insert new image as old one is deleted
        var locaFilePath = file.path;
        var result = await uploadToCloudinary(locaFilePath);
        updateObj['img'] = {
            url: result.url,
            id: result.public_id
        };
    }

    const updateCategory = await Category.findByIdAndUpdate(id, { $set: updateObj }, { new: true });

    return { status: true, message: 'Category updated successfully', data: updateCategory };
};

const deleteCategoryImage = async ({ auth, id }) => {
    // if (!auth || auth.role!=='ADMIN') {
    //     return { status: false, message: "Not Authorised" };
    // }
    id = id.replaceAll(':', '/');
    console.log(id);

    cloudinary.uploader.destroy(id, async (err, result) => {
        console.log(result);
        if (err) throw err;
    });

    return { status: true, message: 'Category image deleted successfully' };
};

const deleteCategory = async ({ auth, id }) => {
    // if (!auth || auth.role!=='ADMIN') {
    //     return { status: false, message: "Not Authorised" };
    // }

    const deleteCategory = await Category.findByIdAndDelete(id);
    if (deleteCategory.img.url) {
        cloudinary.uploader.destroy(deleteCategory.img.id, async (err, result) => {
            console.log(result);
            if (err) throw err;
        });
    }
    // console.log(deleteCategory);

    return { status: true, message: 'Category deleted successfully' };
};

const deleteAllCategorys = async ({ auth }) => {
    // if (!auth) {
    //     return { status: false, message: "Not Authorised" }
    // }
    const deleteCategory = await Category.deleteMany();

    return { status: true, message: 'All Categorys deleted successfully' };
};

module.exports={
    getCategorys,
    postCategory,
    updateCategory,
    deleteAllCategorys,
    deleteCategory,
    deleteCategoryImage,
    getAllCategoriesByFirstLetter,
    getCategorySEO
};
