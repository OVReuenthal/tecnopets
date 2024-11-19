import { request, response } from "express";
import { client } from "../DB/db.js";

export const postPayments = async (req = request, res = response) => {
    try {
      const { payment_type_id, payment_amount, payment_date, wallet_id } = req.body;
      const payment_state_id = 0;
      const payment_img = req.file.filename; // Obtener el nombre del archivo subido
      const sql = `
          INSERT INTO payments (wallet_id, payment_type_id, payment_state_id, payment_amount, payment_date, payment_img)
          VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;
          `;
  
      const result = await client.query(sql, [
        wallet_id,
        payment_type_id,
        payment_state_id,
        payment_amount,
        payment_date,
        payment_img
      ]);
      res.status(201).json(result.rows[0]);
    } catch (err) {
      res.status(500).json({
        message: "Error al crear un pago",
        error: err.message,
      });
    }
};

export const updatePaymentState = async (request, response) => {
  try {
    const { paymemt_id, payment_state_id } = request.body;
    const sql = `
      UPDATE public.payments
        SET payment_state_id=$1
      WHERE payment_id=$2;
      `;
        
    await client.query(sql, [payment_state_id, payment_id]);
    response.status(200).json({ message: "Pago actualizado con éxito" });
    
  } catch (error) {
    response.status(500).json({
      message: "Error al actualizar el estado del pago",
      error: error.message,
    });
  
  }
}