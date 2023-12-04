const User = require('../models/User');
const bcrypt=require('bcryptjs');
const jwt = require('jsonwebtoken');

const getUsers=async()=>{
    const data=await User.find();
    return {status: true, data};
};

const signin=async({name, email, phone, password})=>{
    const checkUser=await User.findOne({email});
    const checkUser1=await User.findOne({phone});

    if(checkUser || checkUser1)
    {
        return {status: false, message: 'User already exists'};
    }

    const pass=await bcrypt.hash(password, 8);
    const newUser=new User({
        name,
        email,
        phone,
        password: pass,
        role: 'ADMIN'
    });
    const saveUser=await newUser.save();
    return {status: true, data: saveUser, message: 'User Registration Successful'};
};

const login = async ({ email, password }) => {
    let emailCheck = await User.findOne({ email });
    if (!emailCheck) {
        return { status: false, message: "Invalid Credentials" };
    }
    const passwordVerify = await bcrypt.compare(password, emailCheck.password);
    if (!passwordVerify) {
        return { status: false, message: "Invalid Credentials" };
    }
    let token=jwt.sign({_id:emailCheck._id},process.env.SK);
    return { status: true, message: "Login success", token, user: emailCheck };
};

const deleteUsers=async()=>{
    const ans = await User.deleteMany();
    return {status: true, data: ans};
};

module.exports={
    getUsers,
    signin,
    login,
    deleteUsers
};
