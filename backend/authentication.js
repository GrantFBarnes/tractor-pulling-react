const jwt = require("jsonwebtoken");

const cookieName = "catp_token";

function requestToken(json) {
    if (!json) return false;
    if (!json.edit_secret) return false;
    if (json.edit_secret !== process.env.GFB_EDIT_SECRET) return false;
    return true;
}

function setTokenCookie(response) {
    const token = jwt.sign("authorized", process.env.JWT_SECRET);
    response.cookie(cookieName, token, {
        maxAge: 86400000, // 24 hours = 86400000 ms
        httpOnly: true
    });
}

function removeTokenCookie(response) {
    response.clearCookie(cookieName);
}

function isAuthorized(request) {
    const token = request.cookies[cookieName];
    if (!token) return false;
    let verify = false;
    try {
        verify = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {}
    if (!verify) return false;
    return true;
}

module.exports.requestToken = requestToken;
module.exports.setTokenCookie = setTokenCookie;
module.exports.removeTokenCookie = removeTokenCookie;
module.exports.isAuthorized = isAuthorized;
