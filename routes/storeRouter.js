const express = require('express');
const { getStores, postStore, updateStore, deleteStoreImage, deleteStore, deleteAllStores } = require('../controllers/storeController');
const auth = require('../middleware/auth');
const { upload } = require('../util/util');
const router = express.Router();

router.get('/getStores', async (req, res) => {
    const data = await getStores({ ...req.query });
    res.json(data);
});

router.post('/postStore', upload, async (req, res) => {
    const data = await postStore({ ...req.body, file: req.file });
    if (!data.status) {
        return res.status(400).json(data);
    }
    res.json(data);
});

router.put('/updateStore/:id', upload,async (req, res) => {
    try {
        let data = await updateStore({ ...req.body, id: req.params.id, file: req.file });
        if (!data.status) {
            return res.status(400).json(data);
        }
        res.json(data);
    } catch (error) {
        console.log(error);
        res.status(400).json({ status: false, message: error.message });
    }
});

router.delete('/deleteStoreImage/:id',async (req, res) => {
    try {
        let data = await deleteStoreImage({ id: req.params.id });
        if (!data.status) {
            return res.status(400).json(data);
        }
        res.json(data);
    } catch (error) {
        console.log(error);
        res.status(400).json({ status: false, message: error.message });
    }
});

router.delete('/deleteStore/:id',async (req, res) => {
    try {
        let data = await deleteStore({ id: req.params.id });
        if (!data.status) {
            return res.status(400).json(data);
        }
        res.json(data);
    } catch (error) {
        console.log(error);
        res.status(400).json({ status: false, message: error.message });
    }
});

router.delete('/deleteAllStores', async (req, res) => {
    try {
        let data = await deleteAllStores({  });
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
