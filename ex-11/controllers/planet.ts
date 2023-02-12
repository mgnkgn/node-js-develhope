import { Request, Response } from "express";
import pgPromise from "pg-promise";

import Joi from "joi";

const db = pgPromise()("postgres://postgres:mg2022***@localhost:5432/video");

console.log(db);

const setupDb = async () => {
  await db.none(`
  DROP TABLE IF EXISTS planets;

  CREATE TABLE planets (
    id SERIAL NOT NULL PRIMARY KEY,
    name TEXT NOT NULL
  )      
  `);

  await db.none(`INSERT INTO planets (name) VALUES ('Earth')`);
  await db.none(`INSERT INTO planets (name) VALUES ('Mars')`);
  // await db.none(`INSERT INTO planets (name) VALUES ('Jupiter')`);

  const planets = await db.many(`SELECT * FROM planets;`);
  console.log(planets);
};

setupDb();

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

export { getAll, getOneById, create, updateById, deleteById };
