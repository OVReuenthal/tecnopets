import { request, response } from "express";
import { client } from "../DB/db.js";
import { generateAccessToken } from "../helpers/generateToken.js";
import jwt from 'jsonwebtoken';

export const getAllUser = async (req = request, res = response) => {
  try {
    const sql = `SELECT * FROM users`;

    const querySQL = await client.query(sql);

    res.status(200).json({ status: "Ok", data: querySQL.rows });
  } catch (err) {
    res.status(500).json({
      status: "Failed",
      error: err.message,
    });
  }
};

export const loginUser = async (req = request, res = response) => {
  try {
    const { user_name, password } = req.body;
    console.log(user_name, password);
    const sql = `SELECT * FROM "users" WHERE "user_name" = $1 AND "password" = $2`;
    const results = await client.query(sql, [user_name, password]);

    if (results.rows.length == 0) {
      throw new Error("this username does not exist in the DB");
    }

    const user = results.rows[0].user_name;
    const id_user = results.rows[0].user_id;
    const role = results.rows[0].role;

    const token = generateAccessToken(id_user, role);

    res.cookie("jwt", token, { httpOnly: true, secure: false });
    res.status(200).json({
      status: "user logged",
      data: { isAuthenticated: true, role, id_user },
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      status: "FAILED",
      error: err.message,
    });
  }
};

export const createUser = async (req = request, res = reponse) => {
  try {
    const { user_name, password, rol } = req.body;
    // INSERT the new user.
    const sql = `INSERT INTO "users"("user_name","password","adm") VALUES ($1,$2,$3)`;
    const results = await client.query(sql, [user_name, password, rol]);

    // if everthing goes well. res.status(201)

    res.status(201).json({
      status: "Created",
    });
  } catch (err) {
    // if something goes wrong it will catch and show Error
    res.status(400).json({
      status: "FAILED",
      error: err.message,
    });
  }
};

export const editUser = async (req = request, res = response) => {
  try {
    const { id_user, user_name } = req.body;

    // patch name query
    const sql =
      "UPDATE users SET user_name = $1 WHERE id_user = $2 RETURNING user_name";
    const query = await client.query(sql, [user_name, id_user]);
    console.log(query.rows);

    res.status(200).json({
      status: "OK",
      data: "Modifed",
      new_name: query.rows[0].user_name,
    });
  } catch (error) {
    // if something goes wrong it will catch and show Error
    res.status(400).json({
      status: "FAILED",
      error: error.message,
    });
  }
};

export const deleteUser = async (req = request, res = response) => {
  try {
    const { id_user } = req.body;
    // Query to delete
    const query = "DELETE  FROM  users  WHERE id_user  = $1";
    await client.query(query, [id_user]);

    res.status(200).json({ status: "OK", data: "Deleted" });
  } catch (err) {
    res.status(500).json({
      status: "Failed server",
      data: err.message,
    });
  }
};

export const logOut = async (req = request, res = response) => {
  try {
    res.clearCookie("jwt");
    res.status(200).json({ msg: "User logged out successfully" });
  } catch (error) {
    res.status(500).json({
      status: "Failed",
      data: err.message,
    });
  }
};

export const online = async (req = request, res = response) => {
  res.send("SERVER ONLINE");
};
