import * as dotenv from "dotenv";
dotenv.config();

import express from "express";
import Joi from "joi";
import { Request, Response } from "express";
const app: express.Application = express();

const port = process.env.PORT;

app.use(express.json());

type Planet = {
  id: number;
  name: string;
};

type Planets = Planet[];

let planets: Planets = [
  {
    id: 1,
    name: "Earth",
  },
  {
    id: 2,
    name: "Mars",
  },
];
const planetSchema = Joi.object({
  id: Joi.number().integer().required(),
  name: Joi.string().required(),
});
app.get("/planets", (req: Request, res: Response) => {
  res.status(200).json(planets);
});

app.get("/planets/:id", (req: Request, res: Response) => {
  const receivedId = req.params.id;
  const desiredPlanet = planets.find((planet) => planet.id === +receivedId);
  res.status(200).json(desiredPlanet);
});

app.post("/planets", (req: Request, res: Response) => {
  const { id, name } = req.body;

  const newPlanet = { id, name };
  const validatedNewPlanet = planetSchema.validate(newPlanet);
  if (validatedNewPlanet.error) {
    return res
      .status(400)
      .json({ msg: validatedNewPlanet.error.details[0].message });
  }
  planets = [...planets, newPlanet];
  console.log(planets);
  res.status(201).json({ msg: "Planet added succesfully." });
});

app.delete("/planets/:id", (req: Request, res: Response) => {
  const receivedId = req.params.id;
  const planetsAfterDeletion = planets.filter(
    (planet) => planet.id !== +receivedId
  );
  planets = planetsAfterDeletion;
  console.log(planets);
  res.status(200).json({ msg: "Planet deleted successfully." });
});

app.put("/planets/:id", (req: Request, res: Response) => {
  const receivedId = req.params.id;
  const newPlanetName = req.body.name;
  planets = planets.map((planet) =>
    planet.id === +receivedId ? { ...planet, name: newPlanetName } : planet
  );
  console.log(planets);
  res.status(200).json({ msg: "Planet updated successfully." });
});

app.listen(port, () => {
  console.log(`Server Running on http://localhost:${port}`);
});
