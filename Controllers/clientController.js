import { request, response } from "express";
import { client } from "../DB/db.js";

export const getClients = async (req = request, res = response) => {
  try {
    const sql = "SELECT * FROM clients";
    const query = await client.query(sql);

    res.status(200).json({ status: "Ok", data: query.rows });
  } catch (error) {
    res.status(500).json({
      status: "Error",
      message: "Hubo un error al obtener los clientes",
      error,
    });
  }
};

export const getClientById = async (req = request, res = response) => {
  try {
    const { id } = req.params;

    const sql = "SELECT * FROM clients WHERE client_id = $1";
    const query = await client.query(sql, [id]);

    if (query.rows.length === 0) {
      throw new Error("El cliente no existe");
    }

    res.status(200).json({ status: "Ok", data: query.rows[0] });
  } catch (error) {
    res.status(500).json({
      status: "Error",
      message: "Hubo un error al obtener el cliente",
      error,
    });
  }
};

export const createClient = async (req = request, res = response) => {
  try {
    const { client_name, rif, email, phone, address, user_name } = req.body;
    const password = Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;
    const passwordString = password.toString();
    const sqlUser = `
        INSERT INTO public.users(
        user_name, password, role)
        VALUES ($1, $2, $3) RETURNING user_id;
        `;
    console.log("createClient");

    const queryUser = await client.query(sqlUser, [
      user_name,
      passwordString,
      0,
    ]);
    const user_id = queryUser.rows[0].user_id;
    
    const sql = `
            INSERT INTO public.clients(
            user_id, client_name, rif, email, phone, address)
            VALUES ($1, $2, $3, $4, $5, $6);
        `;
    const query = await client.query(sql, [
      user_id,
      client_name,
      rif,
      email,
      phone,
      address,
    ]);

    const sqlWallet = `
      INSERT INTO public.wallet(
	    user_id, total_dept, balance)
	    VALUES ($1, $2, $3);
    `;
    console.log("user_id: " + user_id);
    await client.query(sqlWallet, [user_id, 0, 0]);
    

    res.status(201).json({ status: "Ok", data: query.rows[0] });


  } catch (error) {
    res.status(500).json({
      status: "Error",
      message: "Hubo un error al crear el cliente",
      error,
    });
  }
};