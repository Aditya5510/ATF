const express = require("express");
const env = require("dotenv");
const connectDB = require("./db/db");
const cors = require("cors");
const run = require("./Gemini/gen");

const app = express();
env.config();

//middleware
app.use(express.json());
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://atffrontend.vercel.app",
      "http://localhost:80",
    ],
  })
);

//db connection
connectDB();

//AI test
// run();

//Routes

app.use("/user", require("./Routes/userRoutes"));
app.use("/applicant", require("./Routes/applicantRoutes"));

//server setup
app.listen(process.env.PORT, (req, res) => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
