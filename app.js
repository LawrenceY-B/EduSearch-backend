const express = require('express');
const res = require('express/lib/response');
const app = express();
app.use(express.json())
const port = 3003;

const Loginroutes = require('./routes/Login');
// const Transferroutes = require('./routes/Transfer')
//mongodb database
require('./database/db')


//routes
app.use('/api', Loginroutes);
// app.use('/api', Transferroutes);



//error handler
app.all('*', (req, res) => {
    res.status(404).json({ message: 'Page Not Found' })
})


app.listen(port, () => {
    console.log(`listening to port ${port}`)
});