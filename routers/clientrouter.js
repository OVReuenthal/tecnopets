import express from 'express';
import { check } from 'express-validator';
import {validateFields} from '../middlewares/validateFields.js';
import { createClient, getClientById, getClients, getWalletById, getUserMovements } from '../Controllers/clientController.js';
import { validatePhone } from '../middlewares/validatePhone.js';

const clientRouter = express.Router();

clientRouter.post(
    '/upload-client', 
    [
      check("client_name", "error client_name").notEmpty().isLength({ max: 20 }),
      check("phone", "error client_phone").notEmpty().isLength({ min: 10, max: 15 }).custom(validatePhone),
      check("email", "error client_email").isEmail(),
      check("rif", "error rif").notEmpty().isLength({max: 20}).custom(validateFields),
      check("address", "error client_address").notEmpty().isLength({ max: 100 }),
      check("user_name", "error user_name").notEmpty().isLength({ max: 100 })
    ],
    createClient
);

clientRouter.get(
    '/list',
    getClients

);

clientRouter.get(
    '/:id',
    getClientById
);
export { clientRouter };

clientRouter.get(
    '/wallet/:id',
    getWalletById
)

clientRouter.get(
    '/balance/:id',
    getUserMovements
)