const express = require('express');
const path = require('path');
const fs = require('fs-extra');
const config = require('./ConfigLoader');
const app = express();

app.use(express.static(config.brain))

app.listen(process.env.PORT || 8000);

exports = app;
