import DashboardService from '../services/DashboardService.js';

import ResponseHelper from '../../helpers/ResponseHelper.js';

class DashboardController {

	static async getMonthlySales(req, res) {
		try {
			const {params} = req;
			const response = await DashboardService.getMonthlySales(params);
			ResponseHelper.success(res, response.message, response.data);
		}
		catch (error) {
			ResponseHelper.error(res, error);
		}
	}

}

export default DashboardController;