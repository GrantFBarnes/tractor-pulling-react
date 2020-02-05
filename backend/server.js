const cookieParser = require("cookie-parser");
const express = require("express");
const http = require("http");
const parser = require("body-parser");
const session = require("express-session");

const util = require("./util.js");

const app = express();
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
