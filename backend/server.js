const express = require("express");

const router = express.Router();
const app = express();
app.use(router);

////////////////////////////////////////////////////////////////////////////////

router.get("/api", (request, response) => {
    response.writeHead(200, { "Content-Type": "application/json" });
    response.write(JSON.stringify({ hello: "world" }));
    response.end();

    // response.status(401).send("Not Authorized");
    // response.end();
});

////////////////////////////////////////////////////////////////////////////////

app.get("/", (request, response) => {
    response.sendFile("index.html", { root: "./frontend/" });
});

app.listen(8080);
