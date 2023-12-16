const express = require('express');
const { getBanners, postBanner, updateBanner, deleteBanner } = require('../controllers/bannerController');
const auth = require('../middleware/auth');
const { upload } = require('../util/util');
const router = express.Router();

router.get('/getBanners', async (req, res) => {
    const data = await getBanners();
    res.json(data);
});

router.post('/postBanner', upload, async (req, res) => {
    const data = await postBanner({ ...req.body, file: req.file });
    if (!data.status) {
        return res.status(400).json(data);
    }
    res.json(data);
});

router.put('/updateBanner/:id', upload, async (req, res) => {
    try {
        let data = await updateBanner({ ...req.body, id: req.params.id, file: req.file });
        if (!data.status) {
            return res.status(400).json(data);
        }
        res.json(data);
    } catch (error) {
        console.log(error);
        res.status(400).json({ status: false, message: error.message });
    }
});

router.delete('/deleteBanner/:id', async (req, res) => {
    const data = await deleteBanner({ id: req.params.id, auth: req.user });
    if (!data.status) {
        return res.status(400).json(data);
    }
    res.json(data);
});

module.exports = router;
