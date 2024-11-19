import { request, response } from "express";
import { client } from "../DB/db.js";

export const getBrands = async (req = request, res = response) =>{
    try {
        const sql = "SELECT * FROM brands";
        const query = await client.query(sql);
        
        res.status(200).json({ status: "Ok", data: query.rows });
        
    } catch (error) {
        res.status(500).json({
            status: "Failed",
            error: error.message,
        });
    }
}

export const getCategories= async (req, res) => {
    try {
        const sql = "SELECT * FROM categories";
        const query = await client.query(sql);
        
        res.status(200).json({ status: "Ok", data: query.rows });
        
    } catch (error) {
        res.status(500).json({
            status: "Failed",
            error: error.message,
        });
    }
}

export const getPaymentStates= async (req, res) => {
    try {
        const sql = "SELECT * FROM payment_states";
        const query = await client.query(sql);
        
        res.status(200).json({ status: "Ok", data: query.rows });
        
    } catch (error) {
        res.status(500).json({
            status: "Failed",
            error: error.message,
        });
    }
}

export const getPaymentsTypes = async (req, res) => {
    try {
        const sql = "SELECT * FROM payments_types";
        const query = await client.query(sql);
        
        res.status(200).json({ status: "Ok", data: query.rows });
        
    } catch (error) {
        res.status(500).json({
            status: "Failed",
            error: error.message,
        });
    }
}

export const getOrderState = async (req, res) => {
    try {
        const sql = "SELECT * FROM order_states";
        const query = await client.query(sql);
        
        res.status(200).json({ status: "Ok", data: query.rows });
        
    } catch (error) {
        res.status(500).json({
            status: "Failed",
            error: error.message,
        });
    }
}