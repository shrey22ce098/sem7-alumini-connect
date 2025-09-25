const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const cors = require("cors");
const cookiesParser = require("cookie-parser");
const app = express();
const rateLimiter = require('./src/middlewares/rateLimiter');
const router = require("./src/routes");

app.use(rateLimiter);
app.use(express.json());

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));
app.use(
  express.json({
    limit: "16kb",
  })
);

app.use(
  express.urlencoded({
    extended: true,
    limit: "16kb",
  })
);

app.use(express.static(`${__dirname}/public`));
app.use(cookiesParser());
app.use("/", router);

const PORT = process.env.PORT || 5000;

// mongoose.set("useFindAndModify", false);
async function connectDB() {
  try {
    const connectionInstance = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      autoIndex: true,
    });
    console.log(
      `\n MongoDB connected !! DB HOST: ${connectionInstance.connection.host}`
    );
  } catch (error) {
    console.log("MONGODB connection FAILED ", error);
    process.exit(1);
  }
}
connectDB();

const connection = mongoose.connection;
connection.once("open", function () {
  console.log("MongoDB connection established successfully.");
});

app.listen(PORT, function () {
  console.log("Server is running on port : ", PORT);
});

module.exports = app;
