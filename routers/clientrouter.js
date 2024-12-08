import express from 'express';
import { check } from 'express-validator';
import {validateFields} from '../middlewares/validateFields.js';
import { createClient, getClientById, getClients} from '../Controllers/clientController.js';
import { validatePhone } from '../middlewares/validatePhone.js';
import { validateAdmin } from '../middlewares/validateAdmin.js';

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
    validateAdmin,  // middleware to validate admin user
    createClient
);

clientRouter.get(
    '/list',
    validateAdmin,  // middleware to validate admin user
    getClients

);

clientRouter.get(
    '/:id',
    validateAdmin,
    getClientById
);




export { clientRouter };