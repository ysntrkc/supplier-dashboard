import DashboardService from '../services/DashboardService.js';
import DashboardValidation from '../validations/DashboardValidation.js';

import ResponseHelper from '../../helpers/ResponseHelper.js';

class DashboardController {

	static async getMonthlySales(req, res) {
		try {
			const {params} = req;

			DashboardValidation.getMonthlySales(params);

			const response = await DashboardService.getMonthlySales(params);
			ResponseHelper.success(res, response.message, response.data);
		}
		catch (error) {
			ResponseHelper.error(res, error);
		}
	}

	static async getAllSalesGroupByProduct(req, res) {
		try {
			const {params} = req;

			DashboardValidation.getAllSalesGroupByProduct(params);

			const response = await DashboardService.getAllSalesGroupByProduct(params);
			ResponseHelper.success(res, response.message, response.data);
		}
		catch (error) {
			ResponseHelper.error(res, error);
		}
	}

}

export default DashboardController;