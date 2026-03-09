const express = require("express");
require("dotenv").config();
const cors = require("cors");
const proxyRoutes = require("./routes/proxy.routes");
const { PORT } = require("./config/env");


const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,             
  })
);

//  * Handle preflight requests
//  */
app.options("*", cors());

app.use("/", proxyRoutes);



app.listen(PORT, () => {
  console.log(` API Gateway running on port ${PORT}`);
});