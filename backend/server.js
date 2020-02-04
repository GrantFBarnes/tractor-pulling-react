const cookieParser = require("cookie-parser");
const express = require("express");
const http = require("http");
const https = require("https");
const parser = require("body-parser");
const selfSigned = require("openssl-self-signed-certificate");
const session = require("express-session");

const socket = require("./communication/socket.js");
const util = require("./util.js");

const app = express();
app.use(express.static(`./build`));

app.use(parser.json({ limit: "50mb" }));
app.use(cookieParser());

app.use(require("./communication/api"));

app.use(
    session({
        name: "tractor-pulling",
        secret: "tractor-pulling-secret",
        resave: false,
        saveUninitialized: false
    })
);
app.use(parser.urlencoded({ extended: false }));

////////////////////////////////////////////////////////////////////////////////
app.get("*", function(request, response) {
    response.sendFile("index.html", { root: "./build/" });
});

////////////////////////////////////////////////////////////////////////////////

function main() {
    const httpsServer = https.createServer(
        {
            key: selfSigned.key,
            cert: selfSigned.cert,
            requestCert: false,
            rejectUnauthorized: false
        },
        app
    );
    const httpServer = http.createServer(function(req, res) {
        res.writeHead(301, {
            Location: "https://" + req.headers["host"] + req.url
        });
        res.end();
    });
    if (util.isProd) {
        httpsServer.listen(443);
        httpServer.listen(80);
        console.log("Running in production");
    } else {
        httpsServer.listen(8080);
        console.log("Running local environment on https://localhost:8080");
    }
    socket.connect(httpsServer);
}

main();
