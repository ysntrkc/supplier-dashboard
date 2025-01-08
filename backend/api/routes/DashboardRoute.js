import express from 'express';
const route = express();

import DashboardController from '../controllers/DashboardController.js';

route.get('/monthly/:vendor_id', DashboardController.getMonthlySales);
route.get('/monthly/:vendor_id/:product_id', DashboardController.getMonthlySalesOfProduct);
route.get('/product/:vendor_id', DashboardController.getAllSalesGroupByProduct);

export default route;