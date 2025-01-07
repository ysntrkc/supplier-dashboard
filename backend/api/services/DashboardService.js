import db from '../../config/db.js';

import ENUMS from '../../enums/index.js';
import ExceptionHandler from '../../utils/ExceptionHandler.js';

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
			{
				$addFields: {
					total_sell_count: {$multiply: [ '$cart_item.item_count', '$cart_item.quantity' ]},
					year_month: {$dateToString: {format: '%Y-%m', date: '$payment_at'}},
				},
			},
			{
				$group: {
					_id: '$year_month',
					total: {$sum: '$total_sell_count'},
				},
			},
			{$sort: {_id: 1}},
			{
				$project: {
					_id: 0,
					label: '$_id',
					value: '$total',
				},
			},
		]);

		return {message: 'Monthly sales fetched successfully', data: sales};
	}

	static async getAllSalesGroupByProduct(params) {
		const {vendor_id: vendorId} = params;

		const vendor = await db('vendors').findById(vendorId);
		if (!vendor) {
			throw new ExceptionHandler(ENUMS.ExceptionTypes.NOT_FOUND, 'Vendor not found');
		}

		const products = await db('orders').aggregate([
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
			{
				$addFields: {
					total_sell_count: {$multiply: [ '$cart_item.item_count', '$cart_item.quantity' ]},
				},
			},
			{
				$group: {
					_id: '$product._id',
					name: {$first: '$product.name'},
					total: {$sum: '$total_sell_count'},
				},
			},
			{
				$project: {
					_id: 0,
					name: 1,
					total: 1,
				},
			},
		]);

		for (const product of products) {
			const [ code, name, color = '-' ] = product.name.split('-').map(item => item.trim());
			product.code = code;
			product.name = name;
			product.color = color;
		}

		return {message: 'Sales grouped by product fetched successfully', data: products};
	}

}

export default DashboardService;