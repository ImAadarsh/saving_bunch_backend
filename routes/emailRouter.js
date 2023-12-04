const express = require('express');
const { getEmails, postEmail, updateEmail, deleteEmail, deleteAllEmails } = require('../controllers/emailController');
const auth = require('../middleware/auth');
const { upload } = require('../util/util');
const router = express.Router();

router.get('/getEmails', async (req, res) => {
    const data = await getEmails({ ...req.query });
    res.json(data);
});

router.post('/postEmail', async (req, res) => {
    const data = await postEmail({ ...req.body, auth: req.user });
    if (!data.status) {
        return res.status(400).json(data);
    }
    res.json(data);
});

router.put('/updateEmail/:id',  async (req, res) => {
    try {
        let data = await updateEmail({ ...req.body, auth: req.user, id: req.params.id });
        if (!data.status) {
            return res.status(400).json(data);
        }
        res.json(data);
    } catch (error) {
        console.log(error);
        res.status(400).json({ status: false, message: error.message });
    }
});

router.delete('/deleteEmail/:id',  async (req, res) => {
    try {
        let data = await deleteEmail({ auth: req.user, id: req.params.id });
        if (!data.status) {
            return res.status(400).json(data);
        }
        res.json(data);
    } catch (error) {
        console.log(error);
        res.status(400).json({ status: false, message: error.message });
    }
});

router.delete('/deleteAllEmails', async (req, res) => {
    try {
        let data = await deleteAllEmails({ auth: req.user });
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
