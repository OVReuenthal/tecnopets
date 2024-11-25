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
    console.log(id);

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
    const role = 0;
    const sqlUser = `
        INSERT INTO public.users(
        user_name, password, role)
        VALUES ($1, $2, $3) RETURNING user_id;
        `;
    console.log("createClient");

    const queryUser = await client.query(sqlUser, [
      user_name,
      passwordString,
      role,
    ]);
    const user_id = queryUser.rows[0].user_id;

    const sql = `
            INSERT INTO public.clients(
            user_id, client_name, rif, email, phone, address)
            VALUES ($1, $2, $3, $4, $5, $6) RETURNING user_id;
        `;
    const query = await client.query(sql, [
      user_id,
      client_name,
      rif,
      email,
      phone,
      address,
    ]);

    res.status(201).json({ status: "Ok", data: query.rows[0] });

    const sqlWallet = `
        INSERT INTO public.wallet(
        user_id, dept, balance)
        VALUES ($1, $2, $3);
        `;
    await client.query(sqlWallet, [user_id, 0, 0]);
  } catch (error) {
    res.status(500).json({
      status: "Error",
      message: "Hubo un error al crear el cliente",
      error,
    });
  }
};

export const getWalletById = async (req = request, res = response) => {
  try {
    const { id } = req.params;
    const sql =
      "SELECT total_dept, balance, total_dept - balance as dept FROM wallet WHERE user_id = $1";
    const query = await client.query(sql, [id]);
    console.log(query.rows[0]);

    if (query.rows.length === 0) {
      throw new Error("La billetera no existe");
    }

    res.status(200).json({ status: "Ok", data: query.rows[0] });
  } catch (error) {
    res.status(500).json({
      status: "Error",
      message: "Hubo un error al obtener la wallet",
      error,
    });
  }
};

export const getUserMovements = async (req = request, res = response) => {
  try {
      const { id } = req.params;
      const sql =
      `SELECT 
          'pago' AS movementType, 
          p.payment_id AS movement_id, 
          ps.payment_name AS movement_state, 
          p.payment_amount AS movement_price, 
          p.payment_date AS movement_date
      FROM 
          payments p
      JOIN 
          payment_states ps ON p.payment_state_id = ps.payment_state_id
      JOIN 
          wallet w ON p.wallet_id = w.wallet_id
      WHERE 
          w.user_id = $1
      UNION ALL
      SELECT 
          'orden' AS movementType, 
          o.order_id AS movement_id, 
          os.order_state_name AS movement_state, 
          -o.order_price AS movement_price, 
          o.order_date AS movement_date
      FROM 
          "order" o
      JOIN 
          order_state os ON o.order_state_id = os.order_state_id
      WHERE 
          o.user_id = $1
      ORDER BY 
          movement_date DESC;
  `;
  const query = await client.query(sql, [id]);
  res.status(200).json({ status: "Ok", data: query.rows });
  } catch (error) {
    res.status(500).json({
      status: "Error",
      message: "Hubo un error al obtener los movements",
      error,
    });
  }
}
