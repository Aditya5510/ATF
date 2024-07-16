const express = require("express");
const env = require("dotenv");
const connectDB = require("./db/db");
const cors = require("cors");
const run = require("./Gemini/gen");

const app = express();
env.config();

//middleware
app.use(express.json());

//accepting request from all origins
app.use(
  cors({
    origin: "*",
  })
);

//db connection
connectDB();

//AI test
run();

//server setup
app.listen(process.env.PORT, (req, res) => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
