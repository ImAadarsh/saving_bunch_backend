const express = require('express');
const { getCoupans, postCoupan, updateCoupan, deleteCoupanImage, deleteCoupan, deleteAllCoupans, getCoupansByIds } = require('../controllers/coupanController');
const auth = require('../middleware/auth');
const { upload } = require('../util/util');
const router = express.Router();

router.get('/getCoupans', async (req, res) => {
    const data = await getCoupans({ ...req.query });
    res.json(data);
});

router.get('/getCoupansById', async (req, res) => {
    const { storeId, categoryId } = req.query;
    console.log("dds");
    
    // Assuming you have a function getCoupansByIds that accepts storeId and categoryId
    const data = await getCoupansByIds({...req.query, storeId, categoryId });
    res.json(data);
});

router.post('/postCoupan', upload, async (req, res) => {
    const data = await postCoupan({ ...req.body, file: req.file });
    if (!data.status) {
        return res.status(400).json(data);
    }
    res.json(data);
});

router.put('/updateCoupan/:id', upload,async (req, res) => {
    try {
        let data = await updateCoupan({ ...req.body, id: req.params.id, file: req.file });
        if (!data.status) {
            return res.status(400).json(data);
        }
        res.json(data);
    } catch (error) {
        console.log(error);
        res.status(400).json({ status: false, message: error.message });
    }
});

router.delete('/deleteCoupanImage/:id',async (req, res) => {
    try {
        let data = await deleteCoupanImage({ id: req.params.id });
        if (!data.status) {
            return res.status(400).json(data);
        }
        res.json(data);
    } catch (error) {
        console.log(error);
        res.status(400).json({ status: false, message: error.message });
    }
});

router.delete('/deleteCoupan/:id',async (req, res) => {
    try {
        let data = await deleteCoupan({ id: req.params.id });
        if (!data.status) {
            return res.status(400).json(data);
        }
        res.json(data);
    } catch (error) {
        console.log(error);
        res.status(400).json({ status: false, message: error.message });
    }
});

router.delete('/deleteAllCoupans', async (req, res) => {
    try {
        let data = await deleteAllCoupans({  });
        if (!data.status) {
            return res.status(400).json(data);
        }
        res.json(data);
    } catch (error) {
        console.log(error);
        res.status(400).json({ status: false, message: error.message });
    }
});

module.exports = router;
