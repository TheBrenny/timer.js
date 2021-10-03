const express = require('express');

const defaultPort = 8463; // "TIME" converted to phone number style

const app = express();
app.use(express.static('public'));

let host = process.env.HOST || "localhost";
let port = process.env.PORT || defaultPort;
app.listen(port, host, () => {
    console.log(`Server running at http://${host}:${port}/`);
});