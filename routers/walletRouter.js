import express from 'express';
import { check } from 'express-validator';
import {validateFields} from '../middlewares/validateFields.js';
import { getUserMovements, getWalletById, postPayments, updatePaymentState, getPayments, getPaymentImage, deletePayment } from '../Controllers/walletController.js';
import upload from '../helpers/saveImage.js';
import {authenticateToken} from '../middlewares/authenticateToken.js';
import { validateAdmin } from '../middlewares/validateAdmin.js';


const walletRouter = express.Router();

walletRouter.post(
    '/payment-image',
    authenticateToken,
    getPaymentImage
);

walletRouter.delete(
    '/delete-payment/:payment_id',
    validateAdmin,
    deletePayment
)

walletRouter.get(
    '/payments',
    validateAdmin,
    getPayments
);

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
      validateFields,
    ],
    validateAdmin,
    updatePaymentState
)

export {walletRouter};