import express from 'express';
const route = express();

import DashboardController from '../controllers/DashboardController.js';

route.get('/monthly/:vendor_id', DashboardController.getMonthlySales);
route.get('/product/:vendor_id', DashboardController.getAllSalesGroupByProduct);

export default route;