require('dotenv').config();
require('./db/conn');
const express=require('express');
const cors=require('cors');
const port = process.env.PORT || 5011;
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

app.listen(port, ()=>{
    console.log(port);
});
