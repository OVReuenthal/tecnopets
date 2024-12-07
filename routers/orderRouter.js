import express from 'express';
import { check } from 'express-validator';
import {validateFields} from '../middlewares/validateFields.js';
import { createOrder, getOrders, getFinishedOrderById, getPendingOrdersById, getOrderDetails, deleteOrderById, updateOrderStatus } from '../Controllers/orderControllers.js';
import { validateStock } from '../middlewares/validateStock.js'
import { authenticateToken } from '../middlewares/authenticateToken.js';

const orderRouter = express.Router();


orderRouter.post(
    '/upload-order', 
    [
      check("order_date", "error order_date").notEmpty(),
      check("order_price", "error order_price").notEmpty().isFloat({ min: 0 }),
      check("items", "error order_price").notEmpty().isArray(),
      validateFields,
      validateStock,
      authenticateToken,
    ],
    createOrder
  );

orderRouter.get(
    '/list',
    getOrders
);

orderRouter.get(
    '/finished',
    authenticateToken,
    getFinishedOrderById
);

orderRouter.get(
    '/pending/',
    authenticateToken,
    getPendingOrdersById
    
);

orderRouter.get(
    '/details/:id',
    getOrderDetails
);

orderRouter.put(
    '/update-status',
    [
      check("order_state_id", "error order_state_id").notEmpty().isInt(),
      check("order_id", "error order_id").notEmpty().isInt(),
      validateFields,
    ],
    authenticateToken,
    updateOrderStatus
);

orderRouter.delete(
    '/delete/:id',
    deleteOrderById
)
    
export {orderRouter};