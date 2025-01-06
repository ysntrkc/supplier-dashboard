import express from 'express';
const route = express();

import VendorController from '../controllers/VendorController.js';

route.get('/', VendorController.getAllVendors);

export default route;