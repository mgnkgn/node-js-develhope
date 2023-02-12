import * as dotenv from "dotenv";
dotenv.config();

import express from "express";
import multer from "multer";

import {
  getAll,
  getOneById,
  create,
  updateById,
  deleteById,
  createImage,
} from "./controllers/planet";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage });

const app: express.Application = express();

const port = process.env.PORT;

app.use("/uploads", express.static("uploads"));
app.use("/static", express.static("static"));

app.use(express.json());

app.get("/planets", getAll);

app.get("/planets/:id", getOneById);

app.post("/planets", create);

app.delete("/planets/:id", deleteById);

app.put("/planets/:id", updateById);

app.post("/planets/:id/image", upload.single("image"), createImage);
app.listen(port, () => {
  console.log(`Server Running on http://localhost:${port}`);
});
