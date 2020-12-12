// Dependencies
const fs = require('fs');
const http = require('http');
const https = require('https');
const express = require('express');

const redirect_app = express();
const app = express();

// Certificate
const privateKey = fs.readFileSync('/etc/letsencrypt/live/rr.melde.net/privkey.pem', 'utf8');
const certificate = fs.readFileSync('/etc/letsencrypt/live/rr.melde.net/cert.pem', 'utf8');
const ca = fs.readFileSync('/etc/letsencrypt/live/rr.melde.net/chain.pem', 'utf8');

const credentials = {
	key: privateKey,
	cert: certificate,
	ca: ca
};

redirect_app.use((req, res) => {
    // set up a route to redirect http to https
    res.redirect('https://' + req.headers.host + req.url);
})

app.use(express.static('.'));

//app.use((req, res) => {
    // res.send('Hello there !');
//    res.sendFile(__dirname + '/index.html');
//});

// Starting both http & https servers
const httpServer = http.createServer(redirect_app);
const httpsServer = https.createServer(credentials, app);

httpServer.listen(80, () => {
	console.log('HTTP Server running on port 80');
});

httpsServer.listen(443, () => {
    console.log('HTTPS Server running on port 443');
});