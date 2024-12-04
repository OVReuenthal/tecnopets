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

    const query = await client.query(sql);

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
        const { id } = req.params;
        const sql = `
        SELECT
            o.order_id,
            o.order_date,
            o.order_price,
            s.order_state_name as order_state
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
        const { id } = req.params;
        const sql = `
        SELECT
            o.order_id,
            o.order_date,
            o.order_price,
            s.order_state_name as order_state
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
            
            const itemSql = `
                INSERT INTO "order_details" (product_id, order_id, product_quantity)
                VALUES ($1, $2, $3);
            `;
            const itemQuery = await client.query(itemSql, [item.product_id, orderquery.rows[0].order_id, item.quantity]);

            const updateStockSql = ` UPDATE products SET stock = stock - $1 WHERE product_id = $2; `;
            
            const updateStockQuery = await client.query(updateStockSql, [item.quantity, item.product_id]);


        }
        res.status(201).json({ status: "Ok", data: orderquery.rows[0] });
        
    } catch (error) {
        res.status(500).json({
            status: "Failed",
            error: error.message,
        });
    }
}


export const updateOrderStatus = async (req = request, res = response) => {
    const { order_id, order_state_id } = req.body;
    try{
        const sql = `
            UPDATE "order"
            SET order_state_id=$1
            WHERE order_id=$2;
        `;
        await client.query(sql, [order_state_id, order_id]);
        res.status(200).json({ status: "Ok", message: "Order status updated successfully" });
    } catch (error) {
        res.status(500).json({
            status: "Failed",
            error: error.message,
        });
    }
}

export const deleteOrderById = async (req = request, res = response) => {
    const { order_id } = req.params;
    try {
        const sql = `
            DELETE FROM "order_details"
            WHERE order_id=$1;
        `;
        await client.query(sql, [order_id]);
        const sql2 = `
            DELETE FROM "order"
            WHERE order_id=$1;
        `;
        await client.query(sql2, [order_id]);
        res.status(200).json({ status: "Ok", message: "Order deleted successfully" });
        
    } catch (error) {
        res.status(500).json({
            status: "Failed",
            error: error.message,
        });
    }
}

export const getOrderDetails = async (req = request, res = response) => {
    const { order_id } = req.params;
    try {
        const sql = `
            SELECT
                od.order_detail_id,
                p.product_name,
                od.product_quantity
            FROM
                "order_details" od
            JOIN
                "products" p ON od.product_id = p.product_id
            WHERE
                od.order_id=$1;
        `;
        const query = await client.query(sql, [order_id]);
        console.log(order_id); // Verifica el valor de order_id antes de ejecutar la consulta
        console.log(query.rows); 
        res.status(200).json({ status: "Ok", data: query.rows });
        
    } catch (error) {
        res.status(500).json({
            status: "Failed",
            error: error.message,
        });
    }
}