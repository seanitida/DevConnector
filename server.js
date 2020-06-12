const express = require('express');
const app=express();
const mongoose=require('mongoose');
const users=require('./routes/api/users');
const profile=require('./routes/api/profile');
const posts=require('./routes/api/posts');

//DB CONFIG
db=require('./config/keys').mongoURI;

//Connect to mongoDB

mongoose
    .connect(db)
    .then(()=>console.log("MongoDB Connected"))
    .catch(err=>console.log(err))

app.get('/',(req,res)=>{
    res.send('Hello World')
})
//use routes

app.use('/api/users',users);
app.use('/api/posts',posts);
app.use('/api/profile',profile);


const port=process.env.PORT || 3000;

app.listen(port,()=>console.log(`Server running on port ${port}`,db));