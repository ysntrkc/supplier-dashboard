import db from '../../config/db.js';

import ENUMS from '../../enums/index.js';
import ExceptionHandler from '../../utils/ErrorHandlers.js';

class DashboardService {

	static async getMonthlySales(params) {
		const {vendor_id: vendorId} = params;
		const vendor = await db('vendors').findById(vendorId);
		if (!vendor) {
			throw new ExceptionHandler(ENUMS.ExceptionTypes.NOT_FOUND, 'Vendor not found');
		}

		const sales = await db('orders').aggregate([
			{$unwind: '$cart_item'},
			{
				$lookup: {
					from: 'parent_products',
					localField: 'cart_item.product',
					foreignField: '_id',
					as: 'product',
				},
			},
			{$unwind: '$product'},
			{$match: {'product.vendor': vendor._id}},
			{$addFields: {total_sell_count: {$multiply: [ '$cart_item.item_count', '$cart_item.quantity' ]}}},
			{
				$group: {
					_id: {
						month: {$month: '$payment_at'},
						year: {$year: '$payment_at'},
					},
					total: {$sum: '$total_sell_count'},
				},
			},
		]);

		return {message: 'Monthly sales fetched successfully', data: sales};
	}

}

export default DashboardService;