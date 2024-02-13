require('dotenv').config();
require('./db/conn');
const express=require('express');
const cors=require('cors');
const port = process.env.PORT || 5000;
const app=express();
const Coupon = require('./models/Coupan');
const Category = require('./models/Category');
const Store = require('./models/Store');
const Banner = require('./models/Banner');
const ExclusiveBanner = require('./models/ExclusiveBanner');
const Email = require('./models/Email');


// const userRouter=require('./routes/userRouter');
const bannerRouter=require('./routes/bannerRouter');
const ExbannerRouter=require('./routes/ExclusiveBanner');
const storeRouter=require('./routes/storeRouter');
const coupanRouter=require('./routes/coupanRouter');
const categoryRouter=require('./routes/categoryRouter');
const emailRouter=require('./routes/emailRouter');
const brandRouter = require('./routes/brandRouter');
const dealRouter = require('./routes/dealRouter');
const Coupan = require('./models/Coupan');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:false}));


// app.use('/user', userRouter);
app.use('/banner', bannerRouter);
app.use('/exclusivebanner', ExbannerRouter);
app.use('/store', storeRouter);
app.use('/coupan', coupanRouter);
app.use('/category', categoryRouter);
app.use('/email', emailRouter);
app.use('/brands', brandRouter);
app.use('/deals', dealRouter);

app.get('/storesByCategory/:categoryId', async (req, res) => {
    try {
      const categoryId = req.params.categoryId;
  
      // Find all coupons with the specified category
      const coupons = await Coupan.find({ category: categoryId });
  
      // Extract store IDs from the coupons
      const storeIds = coupons.map(coupon => coupon.store);
  
      // Find all stores with the extracted IDs
      const stores = await Store.find({ _id: { $in: storeIds } });
      res.json({ status: true, data: stores });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  app.get('/categoriesByStore/:storeId', async (req, res) => {
    try {
        const storeId = req.params.storeId;

        // Find all coupons with the specified store
        const coupons = await Coupan.find({ store: storeId });

        // Extract category IDs from the coupons
        const categoryIds = coupons.reduce((acc, coupon) => {
            acc.push(...coupon.category);
            return acc;
        }, []);
        // Remove duplicate category IDs using Set
        const uniqueCategoryIds = [...new Set(categoryIds)];
        // Find all categories with the extracted IDs
        const categories = await Category.find({ _id: { $in: uniqueCategoryIds } });
        res.json({ status: true, data: categories });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
app.get('/categoriesByExclusive/', async (req, res) => {
    try {

        // Find all coupons with the specified store
        const coupons = await Coupan.find({ is_exclusive: true });

        // Extract category IDs from the coupons
        const categoryIds = coupons.reduce((acc, coupon) => {
            acc.push(...coupon.category);
            return acc;
        }, []);
        // Remove duplicate category IDs using Set
        const uniqueCategoryIds = [...new Set(categoryIds)];
        // Find all categories with the extracted IDs
        const categories = await Category.find({ _id: { $in: uniqueCategoryIds } });
        res.json({ status: true, data: categories });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/api/totalCouponsWithStoreInfo', async (req, res) => {
    try {
        // Use aggregation to count coupons in each store
        const result = await Coupon.aggregate([
            {
                $group: {
                    _id: '$store',
                    totalCoupons: { $sum: 1 }
                }
            },
            {
                $lookup: {
                    from: 'stores', // The name of the Store collection
                    localField: '_id',
                    foreignField: '_id',
                    as: 'storeInfo'
                }
            },
            {
                $project: {
                    storeName: { $arrayElemAt: ['$storeInfo.title', 0] },
                    storeImage: { $arrayElemAt: ['$storeInfo.img.url', 0] },
                    totalCoupons: 1
                }
            }
        ]);

        res.json({ status: true, data: result });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: false, message: 'Internal Server Error' });
    }
});

app.get('/api/totalCounts', async (req, res) => {
    try {
        const totalCounts = {
            coupons: await Coupon.countDocuments(),
            categories: await Category.countDocuments(),
            stores: await Store.countDocuments(),
            banners: await Banner.countDocuments(),
            exclusiveBanners: await ExclusiveBanner.countDocuments(),
            emails: await Email.countDocuments(),
        };

        res.json({ status: true, data: totalCounts });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: false, message: 'Internal Server Error' });
    }
});
// Define the search route
app.get('/api/searchCoupons', async (req, res) => {
    try {
      const { storeId, categoryId, searchTerm } = req.query;
  
      // Build the query based on the provided parameters
      const query = {};
      if (storeId) query.store = storeId;
      if (categoryId) query.category = categoryId;
      if (searchTerm) {
        query.$or = [
          { title: { $regex: searchTerm, $options: 'i' } },
          { subText: { $regex: searchTerm, $options: 'i' } },
          { coupanCode: { $regex: searchTerm, $options: 'i' } },
          { desc: { $regex: searchTerm, $options: 'i' } },
          { sideLine: { $regex: searchTerm, $options: 'i' } },
        ];
      }
  
      // Execute the query and retrieve the coupons
      const coupons = await Coupon.find(query);
  
      res.json({ status: true, data: coupons });
    } catch (error) {
      console.error(error);
      res.status(500).json({ status: false, message: 'Internal Server Error' });
    }
  });

  // Create a new endpoint to search for stores by name
app.get('/api/searchStores', async (req, res) => {
    try {
        const { storeName } = req.query;

        // Build the query based on the parameters
        const query = {
            status: true, // "AND" condition for status
        };
        const query1 = {
            status: true, // "AND" condition for status
        };

        if (storeName) {
            query.title = { $regex: storeName, $options: 'i' }; // "AND" condition for storeName
        }
        if (storeName) {
            query1.name = { $regex: storeName, $options: 'i' }; // "AND" condition for storeName
        }
        
        // Execute the query and retrieve the stores
        const stores = await Store.find(query).select('id title img.url');
        const categories = await Category.find(query).select('id name img.url');

        res.json({ status: true, data: stores, data1 : categories });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: false, message: 'Internal Server Error' });
    }
});

app.listen(port, ()=>{
    console.log(port);
});
