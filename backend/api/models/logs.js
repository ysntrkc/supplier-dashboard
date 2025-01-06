import {Schema} from 'mongoose';

export default new Schema({
	method: {type: String},
	url: {type: String},
	status: {type: Number},
	remote_address: {type: String},
	response_time: {type: String},
	agent: {type: String},
	decoded: {type: Object},
	request_body: {type: Object},
	response_body: {type: Object},
	date: {type: Date, default: Date.now},
}, {collection: 'logs'});
