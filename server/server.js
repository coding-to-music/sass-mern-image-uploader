import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import path from "path";
import config from "./config/config.js";
import imageRoute from "./routes/imageRoute.js";
import { approotdir } from "./utils/approotdir.js";
import dotenv from "dotenv";
dotenv.config();
const __dirname = approotdir;
mongoose.Promise = global.Promise;

const app = express();
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.info(
      "Successfully connected to the database",
      process.env.MONGODB_URI
    );
  })
  .catch((err) => {
    console.log(err);
  });
mongoose.connection.on("error", () => {
  throw new Error(
    `Unable to connect to the database ${process.env.MONGODB_URI}`
  );
});
app.use(express.static(path.join(__dirname, "..", "build")));
app.use(express.json());
app.use(express.urlencoded());
app.use(cors());
app.use("/", imageRoute);

app.use((req, res, next) => {
  res.sendFile(path.join(__dirname, "..", "build", "index.html"));
});

app.listen(config.port, (err) => {
  if (err) {
    console.error(err);
  }
  console.info("Server listened on port %s", process.env.PORT);
});
