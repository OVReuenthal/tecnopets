import express from 'express';
import { check } from 'express-validator';
import {validateFields} from '../middlewares/validateFields.js';
import { createOrder, getOrders, getFinishedOrderById, getPendingOrdersById, getOrderDetails, deleteOrderById, updateOrderStatus } from '../Controllers/orderControllers.js';
import { validateStock } from '../middlewares/validateStock.js'
import { authenticateToken } from '../middlewares/authenticateToken.js';
import { validateAdmin } from '../middlewares/validateAdmin.js';


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
    authenticateToken,
    createOrder
  );

orderRouter.get(
    '/list',
    //validateAdmin,
    getOrders
);

orderRouter.get(
    '/finished',
    //validateAdmin,
    authenticateToken,
    getFinishedOrderById
);

orderRouter.get(
    '/pending',
    //validateAdmin,
    authenticateToken,
    getPendingOrdersById
    
);

orderRouter.get(
    '/details/:order_id',
    //validateAdmin,
    getOrderDetails
);

orderRouter.put(
    '/update-status',
    [
      check("order_state_id", "error order_state_id").notEmpty().isInt(),
      check("order_id", "error order_id").notEmpty().isInt(),
      validateFields,
    ],
    validateAdmin,
    updateOrderStatus
);

orderRouter.delete(
    '/delete/:order_id',
    //validateAdmin,
    deleteOrderById
)
    
export {orderRouter};