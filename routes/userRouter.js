const express=require('express');
const { getUsers, signin, login, deleteUsers } = require('../controllers/userController');
const router=express.Router();

router.get('/getUsers', async (req,res)=>{
    const data=await getUsers();
    res.json(data);
});

router.post('/signin', async (req,res)=>{
    const data=await signin({...req.body});
    if(!data.status)
    {
        return res.status(400).json(data);
    }
    res.json(data);
});

router.post('/login', async (req,res)=>{
    const data=await login({...req.body});
    if(!data.status)
    {
        return res.status(400).json(data);
    }
    res.json(data);
});

router.delete('/deleteUsers', async (req,res)=>{
    const data=await deleteUsers({...req.body});
    if(!data.status)
    {
        return res.status(400).json(data);
    }
    res.json(data);
});

module.exports=router;
