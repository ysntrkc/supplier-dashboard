import ENUMS from '../enums/index.js';

class GlobalHandler extends Error {

	constructor(message, statusCode = ENUMS.HttpStatuses.BAD_REQUEST) {
		super(message);
		this.statusCode = statusCode;
	}

}

class OkHandler extends GlobalHandler {

	constructor(message) {
		super(message);
		this.statusCode = ENUMS.HttpStatuses.OK;
	}

}

class CreatedHandler extends GlobalHandler {

	constructor(message) {
		super(message);
		this.statusCode = ENUMS.HttpStatuses.CREATED;
	}

}

class NoContentHandler extends GlobalHandler {

	constructor(message) {
		super(message);
		this.statusCode = ENUMS.HttpStatuses.NO_CONTENT;
	}

}

class BadRequestHandler extends GlobalHandler {

	constructor(message) {
		super(message);
		this.statusCode = ENUMS.HttpStatuses.BAD_REQUEST;
	}

}

class UnauthorizedHandler extends GlobalHandler {

	constructor(message) {
		super(message);
		this.statusCode = ENUMS.HttpStatuses.UNAUTHORIZED;
	}

}

class ForbiddenHandler extends GlobalHandler {

	constructor(message) {
		super(message);
		this.statusCode = ENUMS.HttpStatuses.FORBIDDEN;
	}

}

class NotFoundHandler extends GlobalHandler {

	constructor(message) {
		super(message);
		this.statusCode = ENUMS.HttpStatuses.NOT_FOUND;
	}

}

class ConflictHandler extends GlobalHandler {

	constructor(message) {
		super(message);
		this.statusCode = ENUMS.HttpStatuses.CONFLICT;
	}

}

class GoneHandler extends GlobalHandler {

	constructor(message) {
		super(message);
		this.statusCode = ENUMS.HttpStatuses.GONE;
	}

}

class InternalServerHandler extends GlobalHandler {

	constructor(message) {
		super(message);
		this.statusCode = ENUMS.HttpStatuses.INTERNAL_SERVER;
	}

}

class BadGatewayHandler extends GlobalHandler {

	constructor(message) {
		super(message);
		this.statusCode = ENUMS.HttpStatuses.BAD_GATEWAY;
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
