import express from "express";
import {
    getBrands,
    getCategories,
    getPaymentStates,
    getPaymentsTypes,
    getOrderState
} from "../Controllers/SelectEndpointController.js";

const selectRouter = express.Router();


selectRouter.get('/brands', getBrands);
selectRouter.get('/categories', getCategories);
selectRouter.get('/payment-states', getPaymentStates);
selectRouter.get('/payments-types', getPaymentsTypes);
selectRouter.get('/order-state', getOrderState);

export { selectRouter };