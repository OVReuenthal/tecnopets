import express from 'express';
import { getExchangeRate } from '../Controllers/exchangeRate.js';
const routerExchange = express.Router();

routerExchange.get('/rate', getExchangeRate);

export { routerExchange };