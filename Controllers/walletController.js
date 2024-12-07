import { request, response } from "express";
import { client } from "../DB/db.js";


  
  export const getUserMovements = async (req = request, res = response) => {
    try {
        const { user_id } = req.body;
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
    const query = await client.query(sql, [user_id]);
    res.status(200).json({ status: "Ok", data: query.rows });
    } catch (error) {
      res.status(500).json({
        status: "Error",
        message: "Hubo un error al obtener los movements",
        error,
      });
    }
  }

export const getWalletById = async (req = request, res = response) => {
    try {
      const { user_id } = req.body;

      const response = await fetch('https://pydolarve.org/api/v1/dollar');
      if (!response.ok) {
          throw new Error('Error al obtener los datos del servidor');
      }
      
      const data = await response.json();
      
      const bcvPrice = data.monitors.bcv.price;

      const sql =
        "SELECT total_dept, balance, total_dept - balance as dept, due_date FROM wallet WHERE user_id = $1";
      const query = await client.query(sql, [user_id]);
  
      if (query.rows.length === 0) {
        throw new Error("La billetera no existe");
      }

      // Añadir bcvPrice al objeto de datos que estás enviando
      res.status(200).json({ 
        status: "Ok", 
        data: { ...query.rows[0], bcvPrice } 
      });
    } catch (error) {
      res.status(500).json({
        status: "Error",
        message: "Hubo un error al obtener la wallet",
        error: error.message,
      });
    }
};


export const postPayments = async (req = request, res = response) => {
    try {
      const { payment_type_id, payment_amount, payment_date, wallet_id } = req.body;
      const payment_img = req.file ? req.file.filename : '';
      const sql = `
          INSERT INTO payments (wallet_id, payment_type_id, payment_state_id, payment_amount, payment_date, payment_img)
          VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;
          `;
  
      const result = await client.query(sql, [
        wallet_id,
        payment_type_id,
        1,
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
    const { payment_id, payment_state_id, user_id } = request.body;
    if (payment_state_id === 2){

      const paymentSql = `select * from payment where payment_id = ?;`;
      const paymentResult = await client.query(paymentSql, [payment_id]);
      const payment_amount = paymentResult.rows[0].payment_amount;

      const walletSql = `select * from wallet where user_id = $1;`;
      const walletData = await client.query(walletSql, [user_id]);
      const balance = walletData.rows[0].balance + payment_amount;
      const total_depth = walletData.rows[0].total_depth;
      

      if (balance >= total_depth) {
        const new_balance = balance - total_depth;
        const updateWalletSql = `UPDATE wallet SET balance=$1, total_dept = $2, due_date = $3 WHERE user_id=$4;`;
        await client.query(updateWalletSql, [new_balance, 0, "", user_id]);
      } else { 
        const updateWalletBalance = `UPDATE wallet SET balance=$1 WHERE user_id=$2;`;
        await client.query(updateWalletSql, [updateWalletBalance, user_id]);
      }

    }
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
