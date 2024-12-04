import { request, response } from "express";
import { client } from '../DB/db.js';



export const validateStock = async (req = request, res = response, next) => {
    try {
        const items = req.body.items;

        const sqlCheckStock = `SELECT * FROM "products" WHERE "product_id" = $1 AND "stock" >= $2`;
        for (let item of items) {
            const { product_id, quantity } = item;
            const checkStock = await client.query(sqlCheckStock, [product_id, quantity]);
            if (checkStock.rows.length <= 0) {
                return res.status(400).json({
                    status: "Failed",
                    message: `The product with id ${product_id} does not have enough stock`
                });
            }
        }

        next(); // Llamar a next() si todo está bien
    } catch (error) {
        res.status(500).json({
            status: "Failed",
            error: error.message,
        });
    }
}
