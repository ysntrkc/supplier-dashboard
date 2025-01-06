import {Schema} from 'mongoose';

export default new Schema({
	name: {type: String},
	vendor: {type: Schema.Types.ObjectId, ref: 'vendors'},
}, {collection: 'parent_products'});
