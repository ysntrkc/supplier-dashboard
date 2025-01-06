
import mongoose from 'mongoose';
import {initModels} from '../api/models/index.js';

export const connectServer = async () => {
	try {
		await mongoose.connect(process.env.DB_URI);
		await initModels(mongoose);
		console.log('MongoDB connection successful!');
	}
	catch (err) {
		console.log('MongoDB connection failed!');
		console.log(err);
	}
};

export default (modelName) => {
	return mongoose.model(modelName);
};
