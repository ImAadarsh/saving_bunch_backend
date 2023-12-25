const Brand = require('../models/Brand');

// Controller for creating a new brand
const createBrand = async (req, res) => {
    try {
        const { brandName, storeWebsite, fullName, officeNumber, mobileNumber, emailAddress, comments } = req.body;

        const newBrand = new Brand({
            brandName,
            storeWebsite,
            fullName,
            officeNumber,
            mobileNumber,
            emailAddress,
            comments,
        });

        const savedBrand = await newBrand.save();

        res.json({ status: true, message: 'Brand created successfully', data: savedBrand });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: false, message: 'Internal Server Error' });
    }
};

// Controller for fetching all brands
const getAllBrands = async (req, res) => {
    try {
        const brands = await Brand.find();
        res.json({ status: true, data: brands });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: false, message: 'Internal Server Error' });
    }
};

module.exports = {
    createBrand,
    getAllBrands,
};
