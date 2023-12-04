const express=require('express');
const { getBanners, postBanner, deleteBanner } = require('../controllers/bannerController');
const auth = require('../middleware/auth');
const router=express.Router();

router.get('/getBanners', async (req,res)=>{
    const data=await getBanners();
    res.json(data);
});

router.post('/postBanner', async (req,res)=>{
    const data=await postBanner({...req.body});
    if(!data.status)
    {
        return res.status(400).json(data);
    }
    res.json(data);
});

router.delete('/deleteBanner/:id', async (req,res)=>{
    const data=await deleteBanner({id: req.params.id, auth: req.user});
    if(!data.status)
    {
        return res.status(400).json(data);
    }
    res.json(data);
});

module.exports=router;
