import { request, response } from "express";
import { client } from "../DB/db.js";

export const getProducts = async (req = request, res = response) => {
    try {
        // Usar comillas de plantilla (backticks) para la cadena SQL
        const sql = `
          SELECT 
            product_id AS id, 
            product_name AS title, 
            product_price AS price, 
            product_img AS thumbnail
          FROM products
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
