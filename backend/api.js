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

function returnPromiseResponse(response, promise) {
    promise
        .then(result => {
            response.writeHead(result.statusCode, {
                "Content-Type": "application/json"
            });
            response.write(JSON.stringify(result.data));
            response.end();
        })
        .catch(err => {
            response.writeHead(500, { "Content-Type": "application/json" });
            response.write("error");
            response.end();
        });
}

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
// APIs defined here

// Heartbeat to make sure server is running
router.get("/api/heartbeat", (request, response) => {
    returnSuccess(response);
});

// Get object by ID
router.get("/api/object/:id", (request, response) => {
    returnResponse(response, objects.getObject(request.params.id));
});

// Get objects by type
router.get("/api/objects/:id", (request, response) => {
    returnResponse(response, objects.getObjectsByType(request.params.id));
});

// Get all objects
router.get("/api/objects", (request, response) => {
    returnResponse(response, objects.getAllObjects(request.params.id));
});

// Check if user is authenticated
router.get("/api/authenticated", (request, response) => {
    if (authentication.isAuthorized(request)) {
        returnSuccess(response);
    } else {
        rejectUnauthorized(response);
    }
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
    returnResponse(response, objects.deleteObj(request.params.id));
});

// Update existing object
router.put("/api/object", (request, response) => {
    if (!authentication.isAuthorized(request)) {
        rejectUnauthorized(response);
        return;
    }
    returnResponse(response, objects.updateObj(request.body));
});

// Create new object
router.post("/api/object", (request, response) => {
    if (!authentication.isAuthorized(request)) {
        rejectUnauthorized(response);
        return;
    }
    returnResponse(response, objects.createObj(request.body));
});

// Get excel by pull ID
router.get("/api/excel/pull/:id", (request, response) => {
    returnPromiseResponse(response, objects.getPullExcel(request.params.id));
});

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

module.exports = router;
