require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const { connectMongoDB } = require("./db");
const userRoutes = require("./routes/user");
const authRoutes = require("./routes/auth");

//database connection
connectMongoDB(process.env.DB)
  .then(() => {
    console.log("Connected to mongodb");
  })
  .catch((err) => {
    console.log(err);
  });

//middlewares
app.use(express.json());
app.use(cors());
app.use(
  cors({
    origin: [
      "http://localhost:3000", // for local development
      "https://authinmern.vercel.app", // your Vercel frontend
    ],
    credentials: true, // If you need to send cookies or credentials, include this line
  })
);
app.use(express.urlencoded({ extended: true }));

//routes
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
