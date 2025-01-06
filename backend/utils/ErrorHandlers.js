import ENUMS from '../enums/index.js';

class GlobalHandler extends Error {

	constructor(message, statusCode = ENUMS.HttpStatuses.BAD_REQUEST) {
		super(message);
		this.statusCode = statusCode;
	}

}

class OkHandler extends GlobalHandler {

	constructor(message, statusCode = ENUMS.HttpStatuses.OK) {
		super(message, statusCode);
	}

}

class CreatedHandler extends GlobalHandler {

	constructor(message, statusCode = ENUMS.HttpStatuses.CREATED) {
		super(message, statusCode);
	}

}

class NoContentHandler extends GlobalHandler {

	constructor(message, statusCode = ENUMS.HttpStatuses.NO_CONTENT) {
		super(message, statusCode);
	}

}

class BadRequestHandler extends GlobalHandler {

	constructor(message, statusCode = ENUMS.HttpStatuses.BAD_REQUEST) {
		super(message, statusCode);
	}

}

class UnauthorizedHandler extends GlobalHandler {

	constructor(message, statusCode = ENUMS.HttpStatuses.UNAUTHORIZED) {
		super(message, statusCode);
	}

}

class ForbiddenHandler extends GlobalHandler {

	constructor(message, statusCode = ENUMS.HttpStatuses.FORBIDDEN) {
		super(message, statusCode);
	}

}

class NotFoundHandler extends GlobalHandler {

	constructor(message, statusCode = ENUMS.HttpStatuses.NOT_FOUND) {
		super(message, statusCode);
	}

}

class ConflictHandler extends GlobalHandler {

	constructor(message, statusCode = ENUMS.HttpStatuses.CONFLICT) {
		super(message, statusCode);
	}

}

class GoneHandler extends GlobalHandler {

	constructor(message, statusCode = ENUMS.HttpStatuses.GONE) {
		super(message, statusCode);
	}

}

class InternalServerHandler extends GlobalHandler {

	constructor(message, statusCode = ENUMS.HttpStatuses.INTERNAL_SERVER) {
		super(message, statusCode);
	}

}

class BadGatewayHandler extends GlobalHandler {

	constructor(message, statusCode = ENUMS.HttpStatuses.BAD_GATEWAY) {
		super(message, statusCode);
	}

}

const errorTypes = {
	OK: OkHandler,
	CREATED: CreatedHandler,
	NO_CONTENT: NoContentHandler,
	BAD_REQUEST: BadRequestHandler,
	UNAUTHORIZED: UnauthorizedHandler,
	FORBIDDEN: ForbiddenHandler,
	NOT_FOUND: NotFoundHandler,
	CONFLICT: ConflictHandler,
	GONE: GoneHandler,
	INTERNAL_SERVER: InternalServerHandler,
	BAD_GATEWAY: BadGatewayHandler,
};

class ExceptionHandler {

	constructor(type, message, statusCode = 200) {
		const ErrorClass = errorTypes[type] || Error;
		throw new ErrorClass(message, statusCode);
	}

}

export default ExceptionHandler;
