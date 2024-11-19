import express from "express";
import {getProducts} from '../Controllers/productsControllers.js'

const productRouter = express.Router();

// Get all products

productRouter.get('/list', getProducts);



export { productRouter };