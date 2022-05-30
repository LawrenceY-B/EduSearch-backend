const express = require('express');
const app= express();
app.use(express.json())
const port=3003;
//accept post form data
const bodyParser = require('body-parser');
const Loginroutes  = require('./routes/Login');
// const Currencyroutes = require('./routes/Currency')
//mongodb database
require('./database/db')


//routes
app.use('/api', Loginroutes);
// app.use('/api', Currencyroutes);

//error handler
app.all('*', (req, res)=>{
    res.status(404).json({message: 'Page Not Found'})
})


app.listen(port,()=>{
    console.log(`listening to port ${port}`)
    
});