require('dotenv').config()
const express = require('express');
const app = express();
const userRoute = require('./router/user');
const mongoose = require('mongoose');

main().then(()=>{
       console.log('database is connected')
}).catch(err => console.log(err));

async function main() {
    try{
  await mongoose.connect('mongodb://127.0.0.1:27017/project');
    }
    catch(err){
        console.log('internal server error');
    }
}

app.use(express.json());
app.use('/user', userRoute);


app.all((err , req , res)=>{
    console.log(err);
})
const port = 3000;

app.listen(port, () => {
  console.log(`you application running on port ${port} `);
});