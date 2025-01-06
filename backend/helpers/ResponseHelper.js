import ENUMS from '../src/enums';

class ResponseHelper {

	static success(res, message, data, statusCode = ENUMS.HttpStatuses.OK) {
		return res.status(statusCode).json({
			type: 'success',
			message,
			data,
		});
	}

	static error(res, error) {
		const returnedResponseCode = error.statusCode || ENUMS.HttpStatuses.INTERNAL_SERVER;

		if (process.env.SHOW_ERRORS === 'true' && process.env.NODE_ENV !== 'test') {
			const errorMessageOnly = process.env.SHOW_ERROR_MESSAGE_ONLY === 'true';
			console.log('error --> ', errorMessageOnly ? error.message : error);
		}

		return res.status(returnedResponseCode).json({
			type: 'error',
			message: error.message,
		});
	}

}

export default ResponseHelper;