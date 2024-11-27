import { request, response } from "express";
import { client } from "../DB/db.js";

export const getOrders = async (req = request, res = response) => {
  try {
    const sql = `
        SELECT
            o.order_id,
            o.order_date,
            o.order_price,
            s.order_state_name as order_state,
            c.client_name -- Suponiendo que también deseas el nombre del cliente
        FROM
            "order" o
        JOIN
            "users" u ON o.user_id = u.user_id
        JOIN
            "clients" c ON u.user_id = c.user_id
        JOIN
            "order_state" s ON o.order_state_id = s.order_state_id
        ORDER BY
            o.order_date DESC;
        `;

    const query = await client.query(sql, [user_id]);

    res.status(200).json({ status: "Ok", data: query.rows });
  } catch (error) {
    res.status(500).json({
      status: "Failed",
      error: error.message,
    });
  }
};

export const getPendingOrdersById = async (req = request, res = response) => {
    try {
        const { id } = req.params.id;
        const sql = `
        SELECT
            o.order_id,
            o.order_date,
            o.order_price,
            s.order_state_name as order_state,
        FROM
            "order" o
        JOIN
            "users" u ON o.user_id = u.user_id
        JOIN
            "order_state" s ON o.order_state_id = s.order_state_id
        WHERE
            o.order_state_id < 5 and u.user_id = $1
        ORDER BY
            o.order_date DESC;
        `;
        const pendingQuery = await client.query(sql, [id]);
        res.status(200).json({ status: "Ok", data: pendingQuery.rows });
        
    } catch (error) {
        res.status(500).json({
            status: "Failed",
            error: error.message,
        });
    }
}

export const getFinishedOrderById = async (req = request, res = response) => {
    try {
        const { id } = req.params.id;
        const sql = `
        SELECT
            o.order_id,
            o.order_date,
            o.order_price,
            s.order_state_name as order_state,
        FROM
            "order" o
        JOIN
            "users" u ON o.user_id = u.user_id
        JOIN
            "order_state" s ON o.order_state_id = s.order_state_id
        WHERE
            o.order_state_id = 5 and u.user_id = $1
        ORDER BY
            o.order_date DESC;
        `;
        const finishedQuery = await client.query(sql, [id]);
        res.status(200).json({ status: "Ok", data: finishedQuery.rows });
        
    } catch (error) {
        res.status(500).json({
            status: "Failed",
            error: error.message,
        });
    }
}


export const createOrder = async (req = request, res = response) => {
    const {user_id, order_date, order_price, items } = req.body;

    try {
        const orderSql = `
            INSERT INTO "order" (user_id, order_date, order_state_id, order_price)
            VALUES ($1, $2, $3, $4)
            RETURNING *;
        `;
        const orderquery = await client.query(orderSql, [user_id, order_date, 1, order_price]);

        for(let item of items) {
            console.log(item);
            const itemSql = `
                INSERT INTO "order_details" (product_id, order_id, product_quantity)
                VALUES ($1, $2, $3);
            `;
            const itemQuery = await client.query(itemSql, [item.product_id, orderquery.rows[0].order_id, item.quantity]);
        }
        res.status(201).json({ status: "Ok", data: orderquery.rows[0] });
        
    } catch (error) {
        res.status(500).json({
            status: "Failed",
            error: error.message,
        });
    }
}

        



