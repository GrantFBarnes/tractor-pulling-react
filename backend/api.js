const express = require("express");
const router = express.Router();

const objects = require("./objects.js");

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
// APIs defined here

// Heartbeat to make sure server is running
router.get("/api/heartbeat", (request, response) => {
    response.status(200).send("success");
    response.end();
});

// Delete object by ID
router.delete("/api/object/:id", (request, response) => {
    const result = objects.deleteObject(request.params.id, user);
    response.writeHead(result.statusCode, {
        "Content-Type": "application/json"
    });
    response.write(JSON.stringify(result.data));
    response.end();
});

// Update existing object
router.put("/api/object", (request, response) => {
    const result = objects.updateObject(request.body, user);
    response.writeHead(result.statusCode, {
        "Content-Type": "application/json"
    });
    response.write(JSON.stringify(result.data));
    response.end();
});

// Create new object
router.post("/api/object", (request, response) => {
    const result = objects.createObject(request.body, user);
    response.writeHead(result.statusCode, {
        "Content-Type": "application/json"
    });
    response.write(JSON.stringify(result.data));
    response.end();
});

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

module.exports = router;
