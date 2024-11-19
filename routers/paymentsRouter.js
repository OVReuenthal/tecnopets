// routes.js
import express from 'express';
import { check } from 'express-validator';
import {validateFields} from '../middlewares/validateFields.js';
import { postPayments } from '../Controllers/paymentController.js';
import upload from '../helpers/saveImage.js';

const paymentRouter = express.Router();

paymentRouter.post(
    '/upload-payment', 
    upload.single('payment_img'),
    [
      check("payment_method", "error payment_method").notEmpty().isLength({ max: 20 }),
      check("wallet_id", "error wallet_id").notEmpty().isLength({ max: 20 }),
      check("payment_amount", "error payment_amount").notEmpty().isFloat({ min: 0 }),
      check("payment_date", "error payment_date").notEmpty().isISO8601(),
      check("payment_type_id", "error payment_type_id").notEmpty().isInt(),
      validateFields,
    ],
    postPayments
);

export {paymentRouter};
