const express = require("express");

const obj = require("./objects.js");
const persist = require("./persist.js");

const router = express.Router();
const app = express();
app.use(router);

////////////////////////////////////////////////////////////////////////////////

router.get("/api/classes", (request, response) => {
    response.writeHead(200, { "Content-Type": "application/json" });
    response.write(JSON.stringify(obj.allClasses));
    response.end();
});

router.get("/api/hooks", (request, response) => {
    response.writeHead(200, { "Content-Type": "application/json" });
    response.write(JSON.stringify(obj.allHooks));
    response.end();
});

router.get("/api/pulls", (request, response) => {
    response.writeHead(200, { "Content-Type": "application/json" });
    response.write(JSON.stringify(obj.allPulls));
    response.end();
});

router.get("/api/pullers", (request, response) => {
    response.writeHead(200, { "Content-Type": "application/json" });
    response.write(JSON.stringify(obj.allPullers));
    response.end();
});

router.get("/api/tractors", (request, response) => {
    response.writeHead(200, { "Content-Type": "application/json" });
    response.write(JSON.stringify(obj.allTractors));
    response.end();
});

////////////////////////////////////////////////////////////////////////////////

app.get("/file/:folder/:file", (request, response) => {
    response.sendFile(request.params.file, { root: "./frontend/" + request.params.folder });
});

app.get("/", (request, response) => {
    response.sendFile("home.html", { root: "./frontend/html" });
});

////////////////////////////////////////////////////////////////////////////////

function main() {
    app.listen(8080);
    persist.initData();
}

main();
