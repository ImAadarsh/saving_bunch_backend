const express = require('express');
const { getCategorys, postCategory, updateCategory, deleteCategoryImage, deleteCategory, deleteAllCategorys } = require('../controllers/coupanController');
const auth = require('../middleware/auth');
const { upload } = require('../util/util');
const router = express.Router();

router.get('/getCategorys', async (req, res) => {
    const data = await getCategorys({ ...req.query });
    res.json(data);
});

router.post('/postCategory', upload, async (req, res) => {
    const data = await postCategory({ ...req.body, file: req.file });
    if (!data.status) {
        return res.status(400).json(data);
    }
    res.json(data);
});

router.put('/updateCategory/:id', upload,async (req, res) => {
    try {
        let data = await updateCategory({ ...req.body, id: req.params.id, file: req.file });
        if (!data.status) {
            return res.status(400).json(data);
        }
        res.json(data);
    } catch (error) {
        console.log(error);
        res.status(400).json({ status: false, message: error.message });
    }
});

router.delete('/deleteCategoryImage/:id',async (req, res) => {
    try {
        let data = await deleteCategoryImage({ id: req.params.id });
        if (!data.status) {
            return res.status(400).json(data);
        }
        res.json(data);
    } catch (error) {
        console.log(error);
        res.status(400).json({ status: false, message: error.message });
    }
});

router.delete('/deleteCategory/:id',async (req, res) => {
    try {
        let data = await deleteCategory({ id: req.params.id });
        if (!data.status) {
            return res.status(400).json(data);
        }
        res.json(data);
    } catch (error) {
        console.log(error);
        res.status(400).json({ status: false, message: error.message });
    }
});

router.delete('/deleteAllCategorys', async (req, res) => {
    try {
        let data = await deleteAllCategorys({  });
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
