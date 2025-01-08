import Joi from 'joi';

import ENUMS from '../../enums/index.js';

import ExceptionHandler from '../../utils/ExceptionHandler.js';

class DashboardValidation {

	static getMonthlySales(object) {
		const schema = Joi.object({
			vendor_id: Joi.string().hex().length(24).required(),
		});

		const {error} = schema.validate(object);
		if (error) {
			throw new ExceptionHandler(
				ENUMS.ExceptionTypes.BAD_REQUEST,
				error.details[0].message,
			);
		}
	}

	static getAllSalesGroupByProduct(object) {
		const schema = Joi.object({
			vendor_id: Joi.string().hex().length(24).required(),
			page: Joi.number().min(1).optional(),
			limit: Joi.number().min(1).max(100).optional(),
			sort_by: Joi.string().valid('total', 'code', 'name', 'color').default('total'),
			sort_order: Joi.string().valid('asc', 'desc').default('desc'),
		});

		const {error} = schema.validate(object);
		if (error) {
			throw new ExceptionHandler(
				ENUMS.ExceptionTypes.BAD_REQUEST,
				error.details[0].message,
			);
		}
	}

}

export default DashboardValidation;