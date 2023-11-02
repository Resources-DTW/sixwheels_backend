const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const authRouter = require("./routes/auth");
const driverRouter = require("./routes/driver");
const providerRouter = require("./routes/provider");
const port = 3000;
const app = express();

dotenv.config();
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("db connected"))
  .catch((err) => console.log(err));

//To allow localhost network
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

app.use("/api/", authRouter);
app.use("/drivers/", driverRouter);
app.use("/provider", providerRouter);

app.listen(process.env.PORT || port, () =>
  console.log(`Sixwheels backend listening on port ${process.env.PORT}!`)
);
