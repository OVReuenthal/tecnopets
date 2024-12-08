import express from 'express';
import { check } from 'express-validator';
import {validateFields} from '../middlewares/validateFields.js';
import { getUserMovements, getWalletById, postPayments, updatePaymentState } from '../Controllers/walletController.js';
import upload from '../helpers/saveImage.js';
import {authenticateToken} from '../middlewares/authenticateToken.js';


const walletRouter = express.Router();

walletRouter.post(
    '/upload-payment', 
    upload.single('payment_img'),
    [
      check("payment_amount", "error payment_amount").notEmpty().isFloat({ min: 0 }),
      check("payment_date", "error payment_date").notEmpty().isISO8601(),
      check("payment_type_id", "error payment_type_id").notEmpty().isInt(),
      validateFields,
    ],
    authenticateToken,
    postPayments
);

walletRouter.get(
    '/wallet',
    authenticateToken,
    getWalletById
)

walletRouter.get(
    '/movements',
    authenticateToken,
    getUserMovements
)

walletRouter.put(
    '/update-payment-state',
    [
      check("payment_id", "error payment_id").notEmpty().isLength({ max: 20 }),
      check("payment_state", "error payment_state").notEmpty().isBoolean(),
      validateFields,
    ],
    authenticateToken,
    updatePaymentState
)

export {walletRouter};