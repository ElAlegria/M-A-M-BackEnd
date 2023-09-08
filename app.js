const express = require("express");
const app = express();

//puerto
const { PORT = 3000 } = process.env;


app.listen(PORT)
