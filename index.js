require('dotenv').config();
require('./db/conn');
const express=require('express');
const cors=require('cors');
const port = process.env.PORT || 5011;
const app=express();

// const userRouter=require('./routes/userRouter');
const bannerRouter=require('./routes/bannerRouter');
const storeRouter=require('./routes/storeRouter');
const coupanRouter=require('./routes/coupanRouter');
const categoryRouter=require('./routes/categoryRouter');
const emailRouter=require('./routes/emailRouter');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:false}));


// app.use('/user', userRouter);
app.use('/banner', bannerRouter);
app.use('/store', storeRouter);
app.use('/coupan', coupanRouter);
app.use('/category', categoryRouter);
app.use('/email', emailRouter);

app.listen(port, ()=>{
    console.log('Listening ...');
});
