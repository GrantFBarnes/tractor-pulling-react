const cookieParser = require("cookie-parser");
const cors = require("cors");
const express = require("express");
const http = require("http");
const parser = require("body-parser");
const session = require("express-session");

const util = require("./util.js");

const app = express();
app.use(cors({ credentials: true, origin: true }));
app.use(express.static(`./build`));

app.use(parser.json({ limit: "50mb" }));
app.use(cookieParser());

app.use(require("./api"));

app.use(
    session({
        name: "tractor-pulling",
        secret: "tractor-pulling-secret",
        resave: false,
        saveUninitialized: false
    })
);
app.use(parser.urlencoded({ extended: false }));

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, OPTIONS, PUT, PATCH, DELETE"
    );
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
    );
    res.setHeader("Access-Control-Allow-Credentials", true);
    next();
});

////////////////////////////////////////////////////////////////////////////////
app.get("*", function(request, response) {
    response.sendFile("index.html", { root: "./build/" });
});

////////////////////////////////////////////////////////////////////////////////

function main() {
    const server = http.createServer(app);
    if (util.isProd) {
        server.listen(80);
        console.log("Running in production");
    } else {
        server.listen(8080);
        console.log("Running local environment on http://localhost:8080");
    }
}

main();
