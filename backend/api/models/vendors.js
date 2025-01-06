import {Schema} from 'mongoose';

export default new Schema({
	name: {type: String},
}, {collection: 'vendors'});
