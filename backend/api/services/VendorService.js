import db from '../../config/db.js';

class VendorService {

	static async getAllVendors() {
		const vendors = await db('vendors').find({}).sort({name: 1});
		return {message: 'Vendors found', data: vendors};
	}

}

export default VendorService;