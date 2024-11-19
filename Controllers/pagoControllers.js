import { request, response } from "express";
import { client } from "../DB/db.js";

export const getPagosByBilletera = async (req = request, res = response) => {
  try {
    const sql = `
        
        SELECT 
            p.payment_id, 
            p.payment_type,
            p.payment_amount,
            p.payment_date,
            s.payment_name AS estado
        FROM 
            payments p
        JOIN 
            payment_states s
        ON 
            p.payment_state_id = s.payment_state_id
        WHERE 
            p.wallet_id = $1;

        `;
    const query = await client.query(sql, [req.params.id_billetera]);
  } catch (err) {
    res.status(500).json({
      message: "Error al obtener los pagos por billetera",
      error: err.message,
    });
  }
};




