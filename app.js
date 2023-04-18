const express = require('express');
const app = express();
app.use(express.json())
const port = 3003;

const Authroutes = require('./routes/auth.routes');
const Schoolroutes = require('./routes/sch.routes')
//mongodb database
require('./database/db')


//routes
app.use('/api', Authroutes);
app.use('/api/school',Schoolroutes);



//error handler
app.all('*', (req, res) => {
    res.status(404).json({ message: 'Page Not Found' })
})


app.listen(port, () => {
    console.log(`listening to port ${port}`)
    
});