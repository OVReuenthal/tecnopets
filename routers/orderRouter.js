import express from 'express';
import { check } from 'express-validator';
import {validateFields} from '../middlewares/validateFields.js';
import { createOrder, getOrders, getFinishedOrderById, getPendingOrdersById, getOrderDetails, deleteOrderById, updateOrderStatus } from '../Controllers/orderControllers.js';
import { validateStock } from '../middlewares/validateStock.js'

const orderRouter = express.Router();


orderRouter.post(
    '/upload-order', 
    [
      check("user_id", "error client_id").notEmpty(),
      check("order_date", "error order_date").notEmpty(),
      check("order_price", "error order_price").notEmpty().isFloat({ min: 0 }),
      check("items", "error order_price").notEmpty().isArray(),
      validateFields,
      validateStock
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
    updateOrderStatus
);

orderRouter.delete(
    '/delete/:id',
    deleteOrderById
)
    
export {orderRouter};