const express = require('express');
const bodyParser = require('body-parser');
const routes = require('./routes');
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api', routes);

app.listen(3000, () => {
    console.log('Server running on port 3000');
});
