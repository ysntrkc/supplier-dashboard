import mongoose from 'mongoose';
import { initModels } from '../api/models/index.js';

let db;

export const connectServer = async () => {
  try {
    const result = await mongoose.connect(process.env.DB_URI);
    if (result.connection) {
      db = initModels(result);
      console.log('connected to mongo');
    } else {
      console.log('MongoDB connection failed!');
    }
  } catch (err) {
    console.log('MongoDB connection failed!');
    console.log(err);
  }
};

export const getDb = () => {
  return db;
};

export default (modelName) => {
  return db.model(modelName);
};
