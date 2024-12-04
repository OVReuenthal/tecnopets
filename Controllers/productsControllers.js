import { request, response } from "express";
import { client } from "../DB/db.js";

export const getProducts = async (req = request, res = response) => {
    try {
        const sql = `
        SELECT 
        p.product_id AS id, 
        p.product_name AS title, 
        p.product_price AS price, 
        p.product_img AS thumbnail,
        p.stock as stock,
        c.category_name AS category
        FROM products p
        JOIN categories c ON p.category_id = c.category_id
        `;
        const query = await client.query(sql);
        
        res.status(200).json({ status: "Ok", data: query.rows });
        
    } catch (error) {
        res.status(500).json({
            status: "Failed",
            error: error.message,
        });
    }
}
