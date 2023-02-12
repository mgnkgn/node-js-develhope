import { Request, Response } from "express";
import { db } from "../db";
import Joi from "joi";

console.log(db);

const planetSchema = Joi.object({
  // id: Joi.number().integer().required(),
  name: Joi.string().required(),
});

const getAll = async (req: Request, res: Response) => {
  const planets = await db.many(`SELECT * FROM planets`);
  res.status(200).json(planets);
};

const getOneById = async (req: Request, res: Response) => {
  const receivedId = req.params.id;
  const planet = await db.oneOrNone(
    `SELECT * FROM planets WHERE id=$1;`,
    +receivedId
  );
  // const desiredPlanet = planets.find((planet) => planet.id === +receivedId);
  res.status(200).json(planet);
};

const create = async (req: Request, res: Response) => {
  const { name } = req.body;

  const newPlanet = { name };
  const validatedNewPlanet = planetSchema.validate(newPlanet);
  if (validatedNewPlanet.error) {
    return res
      .status(400)
      .json({ msg: validatedNewPlanet.error.details[0].message });
  }

  await db.none(`INSERT INTO planets (name) VALUES ($1)`, name);
  // planets = [...planets, newPlanet];

  res.status(201).json({ msg: "Planet added succesfully." });
};

const updateById = async (req: Request, res: Response) => {
  const receivedId = req.params.id;
  const newPlanetName = req.body.name;

  await db.none(`UPDATE planets SET name=$2 WHERE name=$1`, [
    receivedId,
    newPlanetName,
  ]);

  res.status(200).json({ msg: "Planet updated successfully." });
};

const deleteById = async (req: Request, res: Response) => {
  const receivedId = req.params.id;
  await db.none(`DELETE FROM planets WHERE id=$1`, +receivedId);
  // const planetsAfterDeletion = planets.filter(
  //   (planet) => planet.id !== +receivedId
  // );
  // planets = planetsAfterDeletion;
  // console.log(planets);
  res.status(200).json({ msg: "Planet deleted successfully." });
};

const createImage = async (req: Request, res: Response) => {
  console.log(req.file);
  const receivedId = req.params.id;
  const fileName = req.file?.path;

  if (!fileName) {
    res
      .status(400)
      .json({ msg: "Planet image could not uploaded. Please try again." });
  }
  db.none(`UPDATE planets SET image=$2 WHERE id=$1`, [receivedId, fileName]);
  res.status(201).json({ msg: "Planet image uploaded successfully." });
};

export { getAll, getOneById, create, updateById, deleteById, createImage };
