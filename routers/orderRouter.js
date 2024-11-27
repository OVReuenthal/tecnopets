import express from 'express';
import { check } from 'express-validator';
import {validateFields} from '../middlewares/validateFields.js';
import { createOrder, getOrders, getFinishedOrderById, getPendingOrdersById } from '../Controllers/orderControllers.js';
import { validatePhone } from '../middlewares/validatePhone.js';

const orderRouter = express.Router();

orderRouter.post(
    '/upload-order', 
    [
      check("user_id", "error client_id").notEmpty(),
      check("order_date", "error order_date").notEmpty(),
      check("order_price", "error order_price").notEmpty().isFloat({ min: 0 }),
      check("items", "error order_price").notEmpty().isArray(),
      validateFields,
    ],
    createOrder
);

orderRouter.get(
    '/list',
    getOrders
);

orderRouter.get(
    '/finished/:id',
    getFinishedOrderById
);

orderRouter.get(
    '/pending/:id',
    getPendingOrdersById
);
    
export {orderRouter};