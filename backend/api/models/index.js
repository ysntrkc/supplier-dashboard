import fs from 'fs';
import {fileURLToPath} from 'url';
import {dirname} from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const basename = fileURLToPath(import.meta.url)
	.split('/')
	.pop();

export const initModels = async (mongoose) => {
	const files = fs
		.readdirSync(__dirname)
		.filter((file) => !file.startsWith('.') && file !== basename && file !== 'index.js');

	for (const file of files) {
		const filename = file.split('.')[0];
		const {default: schema} = await import(`${__dirname}/${file}`);
		mongoose.model(filename, schema);
	}

	return mongoose;
};
