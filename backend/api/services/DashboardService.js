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
		const {
			vendor_id: vendorId,
			page,
			limit,
			sort_by: sortBy = 'total',
			sort_order: sortOrder = 'desc',
		} = params;

		const vendor = await db('vendors').findById(vendorId);
		if (!vendor) {
			throw new ExceptionHandler(ENUMS.ExceptionTypes.NOT_FOUND, 'Vendor not found');
		}

		const sortStage = {[sortBy]: sortOrder === 'desc' ? -1 : 1};

		const commonAggregates = [
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
		];

		const aggregationPipeline = [
			...commonAggregates,
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
			{$addFields: {splitted_name: {$split: [ '$name', '-' ]}}},
			{
				$addFields: {
					code: {$trim: {input: {$arrayElemAt: [ '$splitted_name', 0 ]}}},
					name: {$trim: {input: {$arrayElemAt: [ '$splitted_name', 1 ]}}},
					color: {$trim: {input: {$ifNull: [ {$arrayElemAt: [ '$splitted_name', 2 ]}, '-' ]}}},
				},
			},
			{
				$project: {
					_id: 0,
					code: 1,
					name: 1,
					color: 1,
					total: 1,
				},
			},
			{$sort: sortStage},
		];

		if (page && limit) {
			const skip = (page - 1) * (+limit);
			aggregationPipeline.push(
				{$skip: skip},
				{$limit: +limit},
			);
		}

		const products = await db('orders').aggregate(aggregationPipeline);

		const response = {
			message: 'Sales grouped by product fetched successfully',
			data: {products},
		};

		if (page && limit) {
			const totalCount = await db('orders').aggregate([
				...commonAggregates,
				{
					$group: {
						_id: '$product._id',
					},
				},
				{$count: 'total'},
			]).then(result => (result[0]?.total || 0));

			response.data = {
				products,
				pagination: {
					total: totalCount,
					page: parseInt(page),
					limit: parseInt(limit || 10),
					total_pages: Math.ceil(totalCount / (limit || 10)),
				},
			};
		}

		return response;
	}

}

export default DashboardService;