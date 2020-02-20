const express = require("express");
const router = express.Router();

const authentication = require("./authentication.js");
const objects = require("./objects.js");

function returnSuccess(response) {
    response.status(200).send("success");
    response.end();
}

function rejectUnauthorized(response) {
    authentication.removeTokenCookie(response);
    response.status(404).send("not authorized");
    response.end();
}

function returnResponse(response, result) {
    response.writeHead(result.statusCode, {
        "Content-Type": "application/json"
    });
    response.write(JSON.stringify(result.data));
    response.end();
}

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
// APIs defined here

// Heartbeat to make sure server is running
router.get("/api/heartbeat", (request, response) => {
    returnSuccess(response);
});

// Get edit token if body is correct
router.post("/api/token", (request, response) => {
    if (authentication.requestToken(request.body)) {
        authentication.setTokenCookie(response);
        returnSuccess(response);
    } else {
        rejectUnauthorized(response);
    }
});

// Delete object by ID
router.delete("/api/object/:id", (request, response) => {
    if (!authentication.isAuthorized(request)) {
        rejectUnauthorized(response);
        return;
    }
    returnResponse(response, objects.deleteObject(request.params.id, user));
});

// Update existing object
router.put("/api/object", (request, response) => {
    if (!authentication.isAuthorized(request)) {
        rejectUnauthorized(response);
        return;
    }
    returnResponse(response, objects.updateObject(request.body, user));
});

// Create new object
router.post("/api/object", (request, response) => {
    if (!authentication.isAuthorized(request)) {
        rejectUnauthorized(response);
        return;
    }
    returnResponse(response, objects.createObject(request.body, user));
});

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

module.exports = router;
