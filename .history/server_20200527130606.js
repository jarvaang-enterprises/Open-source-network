const express = require('express');
const config = require('./server/configure');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });
let app = express();
const DB = process.env.DATABASE;
app.set('port', process.env.PORT || 3000);
app.set('Views', `${__dirname}/Views`);
app = config(app);

mongoose
	.connect(DB, { useNewUrlParser: true, useCreateIndex: true, useFindAndModify: false, useUnifiedTopology: true })
	.then(() => console.log('successfully connected to db'))
	.catch((error) => console.log('there was an error connecting to db ', error));

const server = app.listen(app.get('port'), () => {
	console.log(`Server up: http://localhost:${app.get('port')}`);
});
  