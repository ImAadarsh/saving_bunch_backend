const express = require('express');
const { getDeals, postDeals, updateDeals, deleteDeals } = require('../controllers/dealController');
const auth = require('../middleware/auth');
const { upload } = require('../util/util');
const router = express.Router();

router.get('/getDeals', async (req, res) => {
    const data = await getDeals();
    res.json(data);
});

router.post('/postDeals', upload, async (req, res) => {
    const data = await postDeals({ ...req.body, file: req.file });
    if (!data.status) {
        return res.status(400).json(data);
    }
    res.json(data);
});

router.put('/updateDeals/:id', upload, async (req, res) => {
    try {
        let data = await updateDeals({ ...req.body, id: req.params.id, file: req.file });
        if (!data.status) {
            return res.status(400).json(data);
        }
        res.json(data);
    } catch (error) {
        console.log(error);
        res.status(400).json({ status: false, message: error.message });
    }
});

router.delete('/deleteDeals/:id', async (req, res) => {
    const data = await deleteDeals({ id: req.params.id, auth: req.user });
    if (!data.status) {
        return res.status(400).json(data);
    }
    res.json(data);
});

module.exports = router;
