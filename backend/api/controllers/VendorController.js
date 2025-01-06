import VendorService from '../services/VendorService.js';

import ResponseHelper from '../../helpers/ResponseHelper.js';

class VendorController {

	static async getAllVendors(req, res) {
		try {
			const response = await VendorService.getAllVendors();
			ResponseHelper.success(res, response.message, response.data);
		}
		catch (error) {
			ResponseHelper.error(res, error);
		}
	}

}

export default VendorController;