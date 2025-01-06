import {Schema} from 'mongoose';

const cartItemObject = new Schema({
	product: {type: Schema.Types.ObjectId, ref: 'products'},
	item_count: {type: Number},
	quantity: {type: Number},
	cogs: {type: Number},
}, {id: false});

export default new Schema({
	cart_item: [ cartItemObject ],
	payment_at: {type: Date},
}, {collection: 'orders'});
