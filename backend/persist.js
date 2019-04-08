const fs = require("fs");
const obj = require("./objects.js");

const dataDir = __dirname.substring(0, __dirname.length - 7) + "data";

function initData() {
    var folders = fs.readdirSync(dataDir, "utf-8");
    for (var className of folders) {
        var files = fs.readdirSync(dataDir + "/" + className, "utf-8");
        for (var fileName of files) {
            var file = fs.readFileSync(dataDir + "/" + className + "/" + fileName, "utf-8");
            obj.createObject(JSON.parse(file));
        }
    }
}

module.exports.initData = initData;
