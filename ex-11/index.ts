import * as dotenv from "dotenv";
dotenv.config();

import express from "express";

import {
  getAll,
  getOneById,
  create,
  updateById,
  deleteById,
} from "./controllers/planet";
const app: express.Application = express();

const port = process.env.PORT;

app.use(express.json());

app.get("/planets", getAll);

app.get("/planets/:id", getOneById);

app.post("/planets", create);

app.delete("/planets/:id", deleteById);

app.put("/planets/:id", updateById);

app.listen(port, () => {
  console.log(`Server Running on http://localhost:${port}`);
});
