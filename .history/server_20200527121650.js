const express = require('express');
const config = require('./server/configure');
const mongoose = require('mongoose');
let app = express();

app.set('port', process.env.PORT || 3000);
app.set('Views', `${__dirname}/Views`);
app = config(app);

mongoose.connect('mongodb://localhost/mongoose_myapp',
    { useNewUrlParser: true, useUnifiedTopology: true });

const server = app.listen(app.get('port'), () => {
    console.log(`Server up: http://localhost:${app.get('port')}`);
});