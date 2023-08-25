
const express = require("express");
const app = express();
app.use(express.json({ limit: "10mb" }));
const port = 3003;
const Authroutes = require("./routes/auth.routes");
const Schoolroutes = require("./routes/sch.routes");
const Universityroutes = require("./routes/uni.routes");
const cors = require("cors");
// const ErrorHandler = require("./middleware/errorhandler");
const {ErrorHandler} = require("./middleware/errorhandler");
//mongodb database
require("./database/db");

app.use(cors())

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods",'POST, GET, PUT, DELETE, PATCH');
  res.setHeader("Access-Control-Allow-Headers","Content-Type, Authorization, Reset-Authorization");
  next()
});
//routes
app.use("/api", Authroutes);
app.use("/api/school", Schoolroutes);
app.use("/api/university", Universityroutes);

//error handler
app.all("*", (req, res) => {
  res.status(404).json({ message: "Page Not Found" });
});

app.use(ErrorHandler);



app.listen(port, () => {
  console.log(`listening to port ${port}`);
});
