import express from 'express';
import { check } from 'express-validator';
import {validateFields} from '../middlewares/validateFields.js';
import { getUserMovements, getWalletById, postPayments, updatePaymentState, getDollar } from '../Controllers/walletController.js';
import upload from '../helpers/saveImage.js';


const walletRouter = express.Router();

walletRouter.post(
    '/upload-payment', 
    upload.single('payment_img'),
    [
      check("wallet_id", "error wallet_id").notEmpty().isLength({ max: 20 }),
      check("payment_amount", "error payment_amount").notEmpty().isFloat({ min: 0 }),
      check("payment_date", "error payment_date").notEmpty().isISO8601(),
      check("payment_type_id", "error payment_type_id").notEmpty().isInt(),
      validateFields,
    ],
    postPayments
);

walletRouter.get(
  '/dollar',
  getDollar
)

walletRouter.get(
    '/:id',
    getWalletById
)

walletRouter.get(
    '/movements/:id',
    getUserMovements
)

walletRouter.put(
    '/update-payment-state/:id',
    [
      check("payment_id", "error payment_id").notEmpty().isLength({ max: 20 }),
      check("payment_state", "error payment_state").notEmpty().isBoolean(),
      validateFields,
    ],
    updatePaymentState
)

export {walletRouter};